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
import { useMemo, useState } from "react";
import { BoldedTableCell, StyledIconButton } from "../../StyledComponents";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function getMarkupLabelText(index: number) {
  if (index === 0) {
    return "Min";
  }

  if (index === 3) {
    return "Target";
  }

  if (index === 6) {
    return "Max";
  }

  return "";
}

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

  const markups = useMemo(() => {
    const clonedMarkups = { ...markedUpPricesForQuotes };
    const markUpMap = Object.keys(clonedMarkups).reduce((obj, key) => {
      obj[key] = clonedMarkups[key]; // TODO Fix typescript being unhappy

      // I'm sure there are more performant ways to do this, but we only ever have 5 entries in this array so no need to over-optimize
      const labor = obj[key].map((l) => {
        return Number(
          baselinePricingForQuotes[key].costOfLabor > 0
            ? (l.laborMarkup / baselinePricingForQuotes[key].costOfLabor) *
                100 -
                100
            : 0
        ).toFixed(2);
      });

      const equipment = obj[key].map((e) => {
        return Number(
          baselinePricingForQuotes[key].costOfEquipment > 0
            ? (e.equipmentMarkup /
                baselinePricingForQuotes[key].costOfEquipment) *
                100 -
                100
            : 0
        ).toFixed(2);
      });

      const materials = obj[key].map((m) => {
        return Number(
          baselinePricingForQuotes[key].misc_materials > 0
            ? (m.miscMaterialMarkup /
                baselinePricingForQuotes[key].misc_materials) *
                100 -
                100
            : 0
        ).toFixed(2);
      });

      return {
        labor,
        equipment,
        materials,
      };
    }, {} as { labor: number[]; equipment: number[]; materials: number[] });

    return markUpMap;
  }, [markedUpPricesForQuotes, baselinePricingForQuotes]);

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
              filteredQuoteOptions[index].name || getQuoteNameStr(quote.guid);
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
                        <TableCell></TableCell>
                        <BoldedTableCell>{`Equipment ${ccyFormat(
                          baselinePricingForQuotes[quote.guid].costOfEquipment
                        )}`}</BoldedTableCell>
                        <BoldedTableCell>{`Labor ${ccyFormat(
                          baselinePricingForQuotes[quote.guid].costOfLabor
                        )}`}</BoldedTableCell>
                        <BoldedTableCell>{`Misc materials ${ccyFormat(
                          baselinePricingForQuotes[quote.guid].misc_materials
                        )}`}</BoldedTableCell>
                        <BoldedTableCell>Cost to customer $</BoldedTableCell>
                        <BoldedTableCell>Commission %</BoldedTableCell>
                        <BoldedTableCell>Commission $</BoldedTableCell>
                        <BoldedTableCell>Company Margin $</BoldedTableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {markedUpPricesForQuotes[quote.guid].map(
                        (quoteData, index) => {
                          return (
                            <TableRow key={`costs-body-${index}`}>
                              <TableCell>{getMarkupLabelText(index)}</TableCell>
                              <TableCell>
                                {`${ccyFormat(quoteData.equipmentMarkup)} (${
                                  markups.equipment[index]
                                }%)`}
                              </TableCell>
                              <TableCell>
                                {`${ccyFormat(quoteData.laborMarkup)} (${
                                  markups.labor[index]
                                }%)`}
                              </TableCell>
                              <TableCell>
                                {`${ccyFormat(quoteData.miscMaterialMarkup)} (${
                                  markups.materials[index]
                                }%)`}
                              </TableCell>
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
