import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  calculateTotalCost,
  ccyFormat,
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
import { removeProductFromProposal } from "../../../../data-management/store/slices/selectedProposalSlice";

export default function PricingTable() {
  const dispatch = useDispatch();
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const models = selectedProposal.data.models;
  const fees = selectedProposal.data.fees;
  const labor = selectedProposal.data.labor;
  const taxRate = selectedProposal.data.unitCostTax;
  const MULTIPLIER = selectedProposal.data.multiplier;
  const COMMISSION = selectedProposal.data.commission;

  const [showFeesModal, setShowFeesModal] = useState(false);
  const [showLaborModal, setShowLaborModal] = useState(false);

  const tableInfo = useMemo(() => {
    return calculateTotalCost({
      unitCostTax: taxRate,
      commission: COMMISSION,
      multiplier: MULTIPLIER,
      models,
      labor,
      fees,
    });
  }, [taxRate, COMMISSION, MULTIPLIER, models, labor, fees]);

  const laborBreakDown = useMemo(() => {
    return Object.keys(labor).map((type) => {
      return {
        name: labor[type].name,
        quantity: labor[type].qty,
        amount: labor[type].cost,
      };
    });
  }, [labor]);

  const feesBreakDown = useMemo(() => {
    return Object.keys(fees).map((fee) => {
      return {
        name: fees[fee].name,
        quantity: 1,
        amount: fees[fee].cost,
      };
    });
  }, [fees]);

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
              <BoldedTableCell colSpan={5} align="right">
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
              <BoldedItalicsTableCell colSpan={3} align="center">
                Sum
              </BoldedItalicsTableCell>
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
                  <TableCell colSpan={2} align="center">
                    {ccyFormat(model.unitCost)}
                  </TableCell>
                  <TableCell align="center">
                    {ccyFormat(model.quantity * model.unitCost)}
                  </TableCell>
                  <TableCell align="right">
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
                <BoldedTableCell align="center" colSpan={5}>
                  No content yet
                </BoldedTableCell>
              </TableRow>
            )}
            {/* Include our subtotal row*/}
            <TableRow>
              <TableCell rowSpan={9} />
              <BoldedTableCell colSpan={3}>Subtotal</BoldedTableCell>
              <TableCell colSpan={3} align="center">
                {ccyFormat(tableInfo.itemSubtotal)}
              </TableCell>
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
              <TableCell colSpan={3} align="center">
                {ccyFormat(tableInfo.totalWithTaxes)}
              </TableCell>
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
                <ConfigureMultiplier align="center" />
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.multiplierValue)}
              </TableCell>
              <TableCell align="center">
                {ccyFormat(tableInfo.costAfterMultiplier)}
              </TableCell>
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
              <TableCell colSpan={3} align="center">
                {ccyFormat(tableInfo.invoiceTotal)}
              </TableCell>
            </TableRow>
            {/* Invoice total */}
            <TableRow>
              <BoldedTableCell colSpan={2}>Total</BoldedTableCell>
              <BoldedTableCell
                style={{ fontSize: "20px" }}
                colSpan={4}
                align="right"
              >
                {ccyFormat(tableInfo.invoiceTotal)}
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
