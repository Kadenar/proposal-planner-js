import { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  calculateTotalCost,
  ccyFormat,
  returnOnlyValidFees,
  returnOnlyValidLabor,
} from "../../../../data-management/utils";

import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
  BoldedItalicsTableCell,
  BoldedTableCell,
  ActionsTableCell,
} from "../../../coreui/StyledComponents";

import { CollapsibleRow } from "./CollapsibleRow";
import {
  ConfigureUnitCostTax,
  ConfigureMultiplier,
  ConfigureCommission,
  ConfigureFees,
  ConfigureLabor,
} from "../PricingInputs";

import BasicDialogue from "../../../coreui/dialogs/BasicDialog";
import { showSnackbar } from "../../../coreui/CustomSnackbar";
import {
  removeProductFromProposal,
  updateProposalFees,
  updateProposalLabors,
} from "../../../../data-management/store/slices/selectedProposalSlice";

export default function PricingTable() {
  const dispatch = useDispatch();
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const { fees } = useSelector((state) => state.fees);
  const { labors } = useSelector((state) => state.labors);

  const models = selectedProposal.data.models;
  const proposalFees = selectedProposal.data.fees;
  const proposalLabors = selectedProposal.data.labor;
  const taxRate = selectedProposal.data.unitCostTax;
  const MULTIPLIER = selectedProposal.data.multiplier;
  const COMMISSION = selectedProposal.data.commission;

  const validFees = returnOnlyValidFees({ proposalFees, availableFees: fees });
  const validLabor = returnOnlyValidLabor({
    proposalLabors,
    availableLabors: labors,
  });

  // TODO - is there a better way to do this avoiding the need for a useEffect entirely?
  useEffect(() => {
    updateProposalFees(dispatch, { newFees: validFees });
    updateProposalLabors(dispatch, { newLabors: validLabor });

    // We only want to run this a SINGLE time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableInfo = useMemo(() => {
    return calculateTotalCost({
      unitCostTax: taxRate,
      commission: COMMISSION,
      multiplier: MULTIPLIER,
      models,
      labor: proposalLabors,
      fees: proposalFees,
    });
  }, [taxRate, COMMISSION, MULTIPLIER, models, proposalLabors, proposalFees]);

  const laborBreakDown = useMemo(() => {
    return Object.keys(proposalLabors).map((type) => {
      return {
        name: proposalLabors[type].name,
        quantity: proposalLabors[type].qty,
        amount: proposalLabors[type].cost,
      };
    });
  }, [proposalLabors]);

  const feesBreakDown = useMemo(() => {
    return Object.keys(proposalFees).map((fee) => {
      return {
        name: proposalFees[fee].name,
        quantity: 1,
        amount: proposalFees[fee].cost,
        type: proposalFees[fee].type,
      };
    });
  }, [proposalFees]);

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
              <BoldedItalicsTableCell align="left">
                Model name
              </BoldedItalicsTableCell>
              <BoldedItalicsTableCell align="left">
                Model #
              </BoldedItalicsTableCell>
              <BoldedItalicsTableCell align="center">
                Qty
              </BoldedItalicsTableCell>
              <BoldedItalicsTableCell align="center">
                Unit cost
              </BoldedItalicsTableCell>
              <BoldedItalicsTableCell align="center">
                Sum
              </BoldedItalicsTableCell>
              <ActionsTableCell align="center">Actions</ActionsTableCell>
            </TableRow>
          </TableHead>
          {/* Include our data */}
          <TableBody>
            {models.length > 0 ? (
              models.map((model, index) => (
                <TableRow key={model.name + index}>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.catalogNum}</TableCell>
                  <TableCell align="center">{model.quantity}</TableCell>
                  <TableCell align="center">
                    {ccyFormat(model.unitCost)}
                  </TableCell>
                  <TableCell align="center">
                    {ccyFormat(model.quantity * model.unitCost)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Remove product">
                      <IconButton
                        onClick={() =>
                          removeProductFromProposal(dispatch, { index })
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <BoldedTableCell align="center" colSpan={6}>
                  No content yet
                </BoldedTableCell>
              </TableRow>
            )}
            {/* Include our subtotal row*/}
            <TableRow>
              <TableCell rowSpan={9} />
              <BoldedTableCell colSpan={3}>Subtotal</BoldedTableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.itemSubtotal)}
              </TableCell>
              <TableCell />
            </TableRow>
            {/* Taxes */}
            <TableRow>
              <BoldedTableCell>Tax</BoldedTableCell>
              <TableCell align="center">
                <ConfigureUnitCostTax />
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.invoiceTaxes)}
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.totalWithTaxes)}
              </TableCell>
              <TableCell />
            </TableRow>
            {/* Labor */}
            <CollapsibleRow
              title={"Labor"}
              costOfItem={tableInfo.costOfLabor}
              costWithItem={tableInfo.costWithLabor}
              ccyFormat={ccyFormat}
              breakdown={laborBreakDown}
              configure={() => setShowLaborModal(true)}
            />
            {/* Multiplier */}
            <TableRow>
              <BoldedTableCell>Multiplier</BoldedTableCell>
              <TableCell align="center">
                <ConfigureMultiplier />
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.multiplierValue)}
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.costAfterMultiplier)}
              </TableCell>
              <TableCell />
            </TableRow>
            {/* Fees */}
            <CollapsibleRow
              title={"Fees"}
              costOfItem={tableInfo.costOfFees}
              costWithItem={tableInfo.costAfterFees}
              ccyFormat={ccyFormat}
              breakdown={feesBreakDown}
              configure={() => setShowFeesModal(true)}
            />
            {/* Commission */}
            <TableRow>
              <BoldedTableCell>Commission</BoldedTableCell>
              <TableCell align="center">
                <ConfigureCommission />
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.commissionAmount)}
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.invoiceTotal)}
              </TableCell>
              <TableCell />
            </TableRow>
            {/* Invoice total */}
            <TableRow>
              <BoldedTableCell>Total</BoldedTableCell>
              <BoldedTableCell
                style={{ fontSize: "20px" }}
                colSpan={4}
                align="right"
              >
                {ccyFormat(tableInfo.invoiceTotal)}
              </BoldedTableCell>
            </TableRow>
            {/* TODO -> Add a table row for each option that the user adds a model to*/}
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

          showSnackbar({
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

          showSnackbar({
            title: "Labor costs successfully updated",
            show: true,
            status: "success",
          });
        }}
        open={showLaborModal}
        content={<ConfigureLabor />}
        header={"Configure labor"}
      />
    </>
  );
}
