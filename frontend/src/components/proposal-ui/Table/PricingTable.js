import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { CollapsibleRow } from "./CollapsibleRow";
import {
  ConfigureUnitCostTax,
  ConfigureMultiplier,
  ConfigureCommission,
  ConfigureFees,
  ConfigureLabor,
} from "../PricingInputs";
import Table from "@mui/material/Table";
import BasicDialogue from "../../coreui/dialogs/BasicDialog";
import { Snackbar } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import {
  StyledTableCell,
  BoldedTableCell,
} from "../../coreui/StyledComponents";

/**
 * A table component for rendering data
 * @param {*} props
 * @returns
 */
export default function PricingTable() {
  const rows = useSelector((state) => state.jobTableContents);
  const fees = useSelector((state) => state.fees);
  const labor = useSelector((state) => state.labor);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  const [showSnackBar, setShowSnackbar] = useState({
    title: "",
    show: false,
    status: "success",
  });

  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar({ title: "", show: false, status: "success" });
  };

  // Cache our table rows and only refresh if the rows changed
  const tableRows = useMemo(() => {
    return rows.map((row) => {
      return {
        model: row.name,
        catalog: row.catalogNum,
        qty: row.quantity,
        unit: row.unitCost,
        price: row.quantity * row.unitCost,
      };
    });
    // Added rows.length or else the memo won't recalculate on add (probably a better way of doing this)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, rows.length]);

  const taxRate = useSelector((state) => state.unitCostTax);
  const TAX_RATE = taxRate / 100.0;

  // The total for just the products themselves
  const itemSubtotal = tableRows
    .map(({ price }) => price)
    .reduce((sum, i) => sum + i, 0);

  // Total amount of taxes to be paid
  const invoiceTaxes = TAX_RATE * itemSubtotal;

  const totalWithTaxes = itemSubtotal + invoiceTaxes;

  // Cost for labor
  const costOfLabor = calculateLabor(labor);
  const costWithLabor = totalWithTaxes + costOfLabor;

  // Get the cost after applying the multiplier to the job
  const MULTIPLIER = useSelector((state) => state.multiplier);
  const costAfterMultiplier = costWithLabor * MULTIPLIER;

  // Get the cost that the multiplier has added to the job
  const multiplierValue = costAfterMultiplier - costWithLabor;

  // Cost of fees
  const costOfFees =
    fees.permit.cost + fees.tempTank.cost + fees.financing.cost;
  const costAfterFees = costAfterMultiplier + costOfFees;

  // Commission amount expected to be earned
  const COMMISSION = useSelector((state) => state.commission);
  const commissionAmount = costAfterFees * (COMMISSION / 100.0);
  const invoiceTotal = costAfterFees + commissionAmount;
  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader={true} aria-label="products table">
          {/* Table header */}
          <TableHead>
            {/* First row contains details and price grouping */}
            <TableRow>
              <BoldedTableCell colSpan={2} align="center">
                Details
              </BoldedTableCell>
              <BoldedTableCell colSpan={4} align="right">
                Price
              </BoldedTableCell>
            </TableRow>
            {/* Second row contains specific information for each entry */}
            <TableRow>
              <StyledTableCell align="left">Model</StyledTableCell>
              <StyledTableCell align="left">Catalog #</StyledTableCell>
              <StyledTableCell align="center">Qty</StyledTableCell>
              <StyledTableCell align="center">Unit cost</StyledTableCell>
              <StyledTableCell align="center">Sum</StyledTableCell>
            </TableRow>
          </TableHead>
          {/* Include our data */}
          <TableBody>
            {tableRows.length > 0 ? (
              tableRows.map((row) => (
                <TableRow key={row.model + row.index}>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.catalog}</TableCell>
                  <TableCell align="center">{row.qty}</TableCell>
                  <TableCell align="center">{ccyFormat(row.unit)}</TableCell>
                  <TableCell align="center">{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <BoldedTableCell align="center" colSpan={5}>
                  No content yet
                </BoldedTableCell>
              </TableRow>
            )}
            {/* Include our subtotal row*/}
            <TableRow>
              <TableCell rowSpan={9} />
              <BoldedTableCell colSpan={3}>Subtotal</BoldedTableCell>
              <TableCell align="right">{ccyFormat(itemSubtotal)}</TableCell>
            </TableRow>
            {/* Taxes */}
            <TableRow>
              <BoldedTableCell>Tax</BoldedTableCell>
              <TableCell align="center">
                <ConfigureUnitCostTax />
              </TableCell>
              <TableCell align="center">{ccyFormat(invoiceTaxes)}</TableCell>
              <TableCell align="center">{ccyFormat(totalWithTaxes)}</TableCell>
            </TableRow>
            {/* Labor */}
            <CollapsibleRow
              title={"Labor"}
              costOfItem={costOfLabor}
              costWithItem={costWithLabor}
              ccyFormat={ccyFormat}
              breakdown={Object.keys(labor).map((type) => {
                return {
                  name: labor[type].name,
                  quantity: labor[type].qty,
                  amount: labor[type].cost,
                };
              })}
              configure={() => setShowLaborModal(true)}
            />
            {/* Multiplier */}
            <TableRow>
              <BoldedTableCell>Multiplier</BoldedTableCell>
              <TableCell align="center">
                <ConfigureMultiplier align="center" />
              </TableCell>
              <TableCell align="center">{ccyFormat(multiplierValue)}</TableCell>
              <TableCell align="center">
                {ccyFormat(costAfterMultiplier)}
              </TableCell>
            </TableRow>
            {/* Fees */}
            <CollapsibleRow
              title={"Fees"}
              costOfItem={costOfFees}
              costWithItem={costAfterFees}
              ccyFormat={ccyFormat}
              breakdown={Object.keys(fees).map((fee) => {
                return {
                  name: fees[fee].name,
                  quantity: 1,
                  amount: fees[fee].cost,
                };
              })}
              configure={() => setShowFeesModal(true)}
            />
            {/* Commission */}
            <TableRow>
              <BoldedTableCell>Commission</BoldedTableCell>
              <TableCell align="center">
                <ConfigureCommission />
              </TableCell>

              {/* <TableCell align="center">{`${COMMISSION.toFixed(0)} %`}</TableCell> */}
              <TableCell align="center">
                {ccyFormat(commissionAmount)}
              </TableCell>
              <TableCell align="center">{ccyFormat(invoiceTotal)}</TableCell>
            </TableRow>
            {/* Invoice total */}
            <TableRow>
              <BoldedTableCell>Total</BoldedTableCell>
              <BoldedTableCell
                style={{ fontSize: "20px" }}
                colSpan={4}
                align="right"
              >
                {ccyFormat(invoiceTotal)}
              </BoldedTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialogue for configuring fees */}
      <BasicDialogue
        handleClose={(event, reason) => {
          setShowFeesModal(false);

          if (reason === "backdropClick") {
            return;
          }

          setShowSnackbar({
            title: "Fees successfully updated",
            show: true,
            status: "success",
          });
        }}
        open={showFeesModal}
        content={<ConfigureFees />}
        header={"Configure fees"}
      />
      {/* Dialogue for configuring labor costs */}
      <BasicDialogue
        handleClose={(event, reason) => {
          setShowLaborModal(false);

          if (reason === "backdropClick") {
            return;
          }

          setShowSnackbar({
            title: "Labor costs successfully updated",
            show: true,
            status: "success",
          });
        }}
        open={showLaborModal}
        content={<ConfigureLabor />}
        header={"Configure labor"}
      />
      {/* Show a success message when adding an entry to the table */}
      <Snackbar
        open={showSnackBar.show}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={showSnackBar.status}
          sx={{ width: "100%" }}
        >
          {showSnackBar.title}
        </Alert>
      </Snackbar>
    </>
  );
}

// Handle formatting input cells with a '$' in front
function ccyFormat(num) {
  if (!num) {
    num = 0;
  }

  return `${"$" + Number(num).toFixed(2)}`;
}

// Calculate the total cost of labor
function calculateLabor(labor) {
  let totalLabor = 0;
  Object.keys(labor).forEach((key) => {
    totalLabor += labor[key].qty * labor[key].cost;
  });

  return totalLabor;
}
