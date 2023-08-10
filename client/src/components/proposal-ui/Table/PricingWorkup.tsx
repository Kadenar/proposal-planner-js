import {
  Card,
  Collapse,
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
import { ProposalPricingData } from "../../../hooks/ProposalPricingData";
import { ccyFormat, getQuoteNameStr } from "../../../lib/pricing-utils";
import { useState } from "react";
import { StyledIconButton } from "../../StyledComponents";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const PricingWorkup = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const { markedUpPricesForQuotes, baselinePricingForQuotes } =
    ProposalPricingData(activeProposal);

  const quote_options = activeProposal.data.quote_options;

  const filteredQuoteOptions = quote_options.filter(
    (quote) => quote.hasProducts
  );

  const [open, setOpen] = useState(false);

  if (filteredQuoteOptions.length === 0) {
    return <></>;
  }

  return (
    <Card sx={{ marginTop: 2 }}>
      <Stack
        margin={1}
        spacing={2}
        direction="row"
        justifyContent="space-between"
      >
        <StyledIconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
          style={{ fontWeight: "bold" }}
        >
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          Pricing workup
        </StyledIconButton>
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <>
          {filteredQuoteOptions.map((quote, index) => {
            const quoteTitle =
              filteredQuoteOptions[index].title === ""
                ? getQuoteNameStr(quote.guid)
                : filteredQuoteOptions[index].title;
            return (
              <Stack
                key={quote.guid}
                marginBottom={1}
                paddingLeft={2}
                paddingBottom={2}
              >
                <Typography variant="h6" marginBottom={1}>
                  {`${quoteTitle} - ${ccyFormat(
                    baselinePricingForQuotes[quote.guid].invoiceTotal
                  )}`}
                </Typography>
                <TableContainer component={Paper}>
                  <Table stickyHeader={true} aria-label="cost breakdown table">
                    <TableHead>
                      <TableRow key="costs-header">
                        <TableCell>Cost to customer $</TableCell>
                        <TableCell>Your Commission %</TableCell>
                        <TableCell>Your Commission $</TableCell>
                        <TableCell>Company Margin $</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {markedUpPricesForQuotes[quote.guid].map(
                        (quoteData, index) => {
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
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            );
          })}
        </>
      </Collapse>
    </Card>
  );
};

export default PricingWorkup;
