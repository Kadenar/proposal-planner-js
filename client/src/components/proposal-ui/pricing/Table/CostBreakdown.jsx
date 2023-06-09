import { useSelector } from "react-redux";

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
import { ccyFormat, getQuoteName } from "../pricing-utils";
import { useProposalData } from "../../../../hooks/useProposalData";

const CostBreakdown = () => {
  const { selectedProposal } = useSelector((state) => state.selectedProposal);

  const {
    productsInOptionsArrays,
    costAppliedToAllQuotes,
    arrayOfQuoteNames,
    labor,
    fees,
  } = useProposalData(selectedProposal);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="cost breakdown table">
        <TableHead>
          <TableRow>
            <BoldedTableCell>Costs</BoldedTableCell>
            <TableCell>Cost applicable to all options</TableCell>
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
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
            <TableCell>{ccyFormat(costAppliedToAllQuotes)}</TableCell>
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(productsInOptionsArrays[info].itemSubtotal)}
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
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(productsInOptionsArrays[info].totalWithTaxes)}
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

            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(productsInOptionsArrays[info].costWithLabor)}
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
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(
                      productsInOptionsArrays[info].costAfterMultiplier
                    )}
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
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((info) => {
                return (
                  <TableCell>
                    {ccyFormat(productsInOptionsArrays[info].costAfterFees)}
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
            <OptionTableCell
              arrayOfOptions={productsInOptionsArrays}
              key={"invoiceTotal"}
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const OptionTableCell = ({ arrayOfOptions, key }) => {
  return arrayOfOptions.length > 0 ? (
    arrayOfOptions.map((info) => {
      return <TableCell>{ccyFormat(arrayOfOptions[info][key])}</TableCell>;
    })
  ) : (
    <TableCell />
  );
};

export default CostBreakdown;
