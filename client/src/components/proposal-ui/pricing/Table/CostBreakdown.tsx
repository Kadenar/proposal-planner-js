import { useSelector } from "react-redux";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ReduxStore } from "../../../../data-management/middleware/Interfaces";
import { useProposalData } from "../../../../hooks/useProposalData";
import { BoldedTableCell } from "../../../coreui/StyledComponents";
import {
  ConfigureCommission,
  ConfigureMultiplier,
  ConfigureUnitCostTax,
} from "../PricingInputs";
import { ccyFormat, getQuoteName } from "../pricing-utils";

const CostBreakdown = () => {
  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );

  const { costAppliedToAllQuotes, pricingForQuotesData, labor, fees } =
    useProposalData(selectedProposal);

  const arrayOfQuoteNames = Object.keys(pricingForQuotesData);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader={true} aria-label="cost breakdown table">
        <TableHead>
          <TableRow>
            <BoldedTableCell>Costs</BoldedTableCell>
            <TableCell>Cost applicable to all options</TableCell>
            {arrayOfQuoteNames.length > 0 ? (
              arrayOfQuoteNames.map((quote_name) => {
                return (
                  <TableCell>{getQuoteName(Number(quote_name))}</TableCell>
                );
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
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="itemSubtotal"
              valueToSubtract={undefined}
            />
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost with taxes</BoldedTableCell>
            <TableCell>
              <ConfigureUnitCostTax />
            </TableCell>
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="totalWithTaxes"
              valueToSubtract="itemSubtotal"
            />
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost with labor</BoldedTableCell>
            <TableCell>{ccyFormat(labor)}</TableCell>
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="costWithLabor"
              valueToSubtract={undefined}
            />
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost with multiplier</BoldedTableCell>
            <TableCell>
              <ConfigureMultiplier />
            </TableCell>
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="costAfterMultiplier"
              valueToSubtract="costWithLabor"
            />
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after fees</BoldedTableCell>
            <TableCell>{ccyFormat(fees)}</TableCell>
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="costAfterFees"
              valueToSubtract={undefined}
            />
          </TableRow>
          <TableRow>
            <BoldedTableCell>Cost after commission</BoldedTableCell>
            <TableCell>
              <ConfigureCommission />
            </TableCell>
            <TableCellTest
              arrayOfQuoteNames={arrayOfQuoteNames}
              pricingForQuotesData={pricingForQuotesData}
              valueToFetch="invoiceTotal"
              valueToSubtract="costAfterFees"
            />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TableCellTest = ({
  arrayOfQuoteNames,
  pricingForQuotesData,
  valueToFetch,
  valueToSubtract,
}: {
  arrayOfQuoteNames: string[];
  pricingForQuotesData: Record<number, Record<string, number>>;
  valueToFetch: string;
  valueToSubtract: string | undefined;
}) => {
  const dataToShow = (quote_name: string) =>
    ccyFormat(pricingForQuotesData[Number(quote_name)][valueToFetch]);

  const dataToIncrementBy = (quote_name: string) => {
    return valueToSubtract
      ? `(+${ccyFormat(
          pricingForQuotesData[Number(quote_name)][valueToFetch] -
            pricingForQuotesData[Number(quote_name)][valueToSubtract]
        )})`
      : undefined;
  };

  const formattedContent = (quote_name: string) =>
    valueToSubtract
      ? `${dataToShow(quote_name)} ${dataToIncrementBy(quote_name)}`
      : dataToShow(quote_name);

  return (
    <>
      {arrayOfQuoteNames.length > 0 ? (
        arrayOfQuoteNames.map((quote_name) => {
          return <TableCell>{formattedContent(quote_name)}</TableCell>;
        })
      ) : (
        <TableCell />
      )}
    </>
  );
};

export default CostBreakdown;
