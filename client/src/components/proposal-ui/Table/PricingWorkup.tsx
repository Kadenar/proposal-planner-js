import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ProposalObject } from "../../../middleware/Interfaces";
import { useProposalPricing } from "../../../hooks/useProposalData";
import { ccyFormat, getQuoteNameStr } from "../../../lib/pricing-utils";

const PricingWorkup = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const { quoteNamesArray, markedUpPricesForQuotes, baselinePricingForQuotes } =
    useProposalPricing(activeProposal);

  return (
    <>
      {quoteNamesArray.length > 0 ? (
        quoteNamesArray.map((quote) => {
          return (
            <Stack key={quote} marginBottom={1}>
              <Typography variant="h6">{`${getQuoteNameStr(
                quote
              )} - ${ccyFormat(
                baselinePricingForQuotes[quote].invoiceTotal
              )}`}</Typography>
              <TableContainer component={Paper}>
                <Table stickyHeader={true} aria-label="cost breakdown table">
                  <TableHead>
                    <TableRow key="costs-header">
                      <TableCell>Customer price</TableCell>
                      <TableCell>% Commission</TableCell>
                      <TableCell>$ Commission</TableCell>
                      <TableCell>Company Margin</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {markedUpPricesForQuotes[quote].map((quoteData, index) => {
                      return (
                        <TableRow key={`costs-body-${index}`}>
                          <TableCell>
                            {ccyFormat(quoteData.sellPrice)}
                          </TableCell>
                          <TableCell>{`${quoteData.commissionPercent}%`}</TableCell>
                          <TableCell>
                            {ccyFormat(quoteData.commissionAmount)}
                          </TableCell>
                          <TableCell>
                            {ccyFormat(quoteData.companyMargin)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          );
        })
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
          alignContent="center"
        >
          <Typography variant="h6">
            Please add products to this proposal before trying to view costs
          </Typography>
        </Stack>
      )}
    </>
  );
};

export default PricingWorkup;
