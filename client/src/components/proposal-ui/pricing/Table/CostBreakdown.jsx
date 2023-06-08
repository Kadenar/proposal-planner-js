import { useMemo } from "react";
import { useSelector } from "react-redux";

import { omit } from "lodash";

import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import {
  ConfigureCommission,
  ConfigureMultiplier,
  ConfigureUnitCostTax,
} from "../PricingInputs";
import { BoldedTableCell } from "../../../coreui/StyledComponents";
import {
  calculateCostForOption,
  calculateCostForProductsInOption,
  calculateFees,
  calculateLabor,
  ccyFormat,
  getQuoteName,
} from "../pricing-utils";

const CostBreakdown = () => {
  const { selectedProposal } = useSelector((state) => state.selectedProposal);

  const products = selectedProposal.data.products;

  // The columns that should be dynamically added to the table to represent each option quoted
  // TODO move this to be rows
  const optionsRows = useMemo(() => {
    return products.reduce((result, currentValue) => {
      (result[currentValue.quote_option] =
        result[currentValue.quote_option] || []).push(currentValue.data);
      return result;
    }, {});
  }, [products]);

  // Calculate the cost of products applied to ALL quotes
  const costForAll = useMemo(() => {
    return calculateCostForProductsInOption(optionsRows[0] || []);
  }, [optionsRows]);

  const tableInfo = useMemo(() => {
    // Omit option 0
    const remainingOptions = omit(optionsRows, "0");

    // Calculate the cost of the remaining options
    return Object.keys(remainingOptions).reduce(
      (result, option) => ({
        ...result,
        [option]: calculateCostForOption(
          selectedProposal.data,
          optionsRows[option],
          costForAll
        ),
      }),
      {}
    );
  }, [optionsRows, costForAll, selectedProposal]);

  const arrayOfTableInfo = useMemo(() => {
    return Object.keys(tableInfo);
  }, [tableInfo]);

  const fees = useMemo(() => {
    return calculateFees(selectedProposal.data.fees);
  }, [selectedProposal]);

  const labor = useMemo(() => {
    return calculateLabor(selectedProposal.data.labor);
  }, [selectedProposal]);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="cost breakdown table">
        <TableHead>
          <TableRow>
            <BoldedTableCell>Costs</BoldedTableCell>
            <TableCell>Cost applicable to all options</TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return <TableCell>{getQuoteName(info)}</TableCell>;
              })
            ) : (
              <TableCell></TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <BoldedTableCell>Base cost</BoldedTableCell>
            <TableCell>{ccyFormat(costForAll)}</TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].itemSubtotal)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after taxes</BoldedTableCell>
            <TableCell>
              <ConfigureUnitCostTax />
            </TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].totalWithTaxes)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost with labor</BoldedTableCell>
            <TableCell>{ccyFormat(labor)}</TableCell>

            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].costWithLabor)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after multiplier</BoldedTableCell>
            <TableCell>
              <ConfigureMultiplier />
            </TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].costAfterMultiplier)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after fees</BoldedTableCell>
            <TableCell>{ccyFormat(fees)}</TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].costAfterFees)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after commission</BoldedTableCell>
            <TableCell>
              <ConfigureCommission />
            </TableCell>
            {arrayOfTableInfo.length > 0 ? (
              arrayOfTableInfo.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(tableInfo[info].invoiceTotal)}
                  </TableCell>
                );
              })
            ) : (
              <TableCell />
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CostBreakdown;
