import {
  FormControl,
  Input,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import { ProposalPricingData } from "../../../hooks/ProposalPricingData";
import {
  BoldedItalicsTableCell,
  BoldedTableCell,
  StyledIconButton,
} from "../../StyledComponents";
import { ccyFormat, getQuoteNameStr } from "../../../lib/pricing-utils";
import {
  Fee,
  FeeOnProposal,
  Labor,
  LaborOnProposal,
  ProposalObject,
  QuoteOption,
} from "../../../middleware/Interfaces";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import {
  setProposalMiscMaterialCost,
  setProposalUnitCostTax,
  updateProposalFees,
  updateProposalLabors,
} from "../../../services/slices/activeProposalSlice";
import { useEffect, useMemo } from "react";
import { laborsDialog } from "../../dialogs/frontend/LaborsDialog";
import { showSnackbar } from "../../CustomSnackbar";
import { feesDialog } from "../../dialogs/frontend/FeesDialog";

// Only retain fees that are still available in the database
export function returnOnlyValidFees(
  proposalFees: FeeOnProposal[],
  allFees: Fee[]
) {
  return allFees.map((fee) => {
    const matchingFee = proposalFees.find(
      (matching) => matching.guid === fee.guid
    );

    // If this proposal does not have this fee available to it yet, then insert it
    if (!matchingFee) {
      return {
        guid: fee.guid,
        cost: fee.cost,
      };
    }

    // Otherwise, include the existing fee
    return matchingFee;
  });
}

// Takes any labor present on the proposal, and removes any that are not in sync with the system
export function returnOnlyValidLabor(
  proposalLabors: LaborOnProposal[],
  availableLabors: Labor[]
) {
  return availableLabors.map((labor) => {
    const matchingLabor = proposalLabors.find(
      (matching) => matching.guid === labor.guid
    );

    // If this proposal does not have this fee available to it yet, then insert it
    if (!matchingLabor) {
      return {
        name: labor.name,
        guid: labor.guid,
        cost: labor.cost,
        qty: 0,
        allowCostOverride: labor.allowCostOverride,
      };
    }

    // Otherwise, include the existing labor
    return {
      ...matchingLabor,
      cost: labor.allowCostOverride ? matchingLabor.cost : labor.cost,
    };
  });
}

const CostBreakdown = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const dispatch = useAppDispatch();

  const { fees: _fees } = useAppSelector((state) => state.fees);
  const { labors: _labors } = useAppSelector((state) => state.labors);

  const proposalFees = activeProposal.data.fees;
  const proposalLabors = activeProposal.data.labor;

  const {
    costAppliedToAllQuotes,
    baselinePricingForQuotes,
    costOfLabor,
    costOfFees,
  } = ProposalPricingData(activeProposal);

  useEffect(() => {
    // On load of the form, remove any invalid labors
    updateProposalLabors(
      dispatch,
      returnOnlyValidLabor(proposalLabors, _labors),
      false
    );

    // On load of the form, remove any invalid fees
    updateProposalFees(
      dispatch,
      returnOnlyValidFees(proposalFees, _fees),
      false
    );
    // We only want to run this a SINGLE time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Used for inner table of labor
  const laborBreakDown = useMemo(() => {
    if (!proposalLabors) {
      return [];
    }

    return proposalLabors.map((_labor) => {
      const matchingLabor = _labors.find(
        (matching) => matching.guid === _labor.guid
      );
      return {
        guid: _labor.guid,
        name: matchingLabor?.name || "Labor not found in database",
        qty: _labor.qty,
        cost: _labor.cost,
        allowCostOverride: matchingLabor?.allowCostOverride || false,
      };
    });
  }, [proposalLabors, _labors]);

  // User for inner table of fees
  const feesBreakDown = useMemo(() => {
    return proposalFees.map((fee) => {
      const matchingFee = _fees.find((matching) => matching.guid === fee.guid);

      return {
        guid: fee.guid,
        name: matchingFee?.name || "Fee not found in database",
        qty: 1,
        cost: fee.cost,
        type: matchingFee?.type || "Fee not found in database",
      };
    });
  }, [proposalFees, _fees]);

  const quotesWithProducts = activeProposal.data.quote_options.filter(
    (quote) => quote.hasProducts
  );

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader={true} aria-label="cost breakdown table">
          <TableHead>
            <TableRow key="costs-header">
              <BoldedItalicsTableCell>Base costs</BoldedItalicsTableCell>
              <BoldedItalicsTableCell>
                Cost applied to all quotes
              </BoldedItalicsTableCell>
              {quotesWithProducts.length > 0 ? (
                quotesWithProducts.map((quote) => {
                  return (
                    <BoldedItalicsTableCell key={quote.guid}>
                      {getQuoteNameStr(quote.guid)}
                    </BoldedItalicsTableCell>
                  );
                })
              ) : (
                <TableCell></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key="base-cost-row">
              <BoldedTableCell>Cost of equipment</BoldedTableCell>
              <TableCell>{ccyFormat(costAppliedToAllQuotes)}</TableCell>
              <QuoteOptionPriceCell
                quotes={quotesWithProducts}
                pricingForQuotesData={baselinePricingForQuotes}
                valueToFetch="costOfEquipment"
                valueToSubtract={undefined}
              />
            </TableRow>
            <TableRow key="misc-cost-row">
              <BoldedTableCell>Cost of misc materials</BoldedTableCell>
              <TableCell>
                <FormControl sx={{ maxWidth: "100px" }}>
                  <Input
                    type="number"
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                    value={activeProposal.data.misc_materials}
                    onChange={(e) =>
                      setProposalMiscMaterialCost(dispatch, e.target?.value)
                    }
                  />
                </FormControl>
              </TableCell>
              <QuoteOptionPriceCell
                quotes={quotesWithProducts}
                pricingForQuotesData={baselinePricingForQuotes}
                valueToFetch="equipmentPlusMaterials"
                valueToSubtract={undefined}
              />
            </TableRow>
            <TableRow key="taxes-row">
              <BoldedTableCell>Equipment + taxes</BoldedTableCell>
              <TableCell>
                <TextField
                  id="unit-cost-id"
                  label="Unit cost tax"
                  variant="outlined"
                  value={activeProposal.data.unit_cost_tax}
                  onChange={(e) =>
                    setProposalUnitCostTax(dispatch, e.target?.value)
                  }
                  type="number"
                  style={{ maxWidth: "100px" }}
                />
              </TableCell>
              <QuoteOptionPriceCell
                quotes={quotesWithProducts}
                pricingForQuotesData={baselinePricingForQuotes}
                valueToFetch="equipmentAndMaterialsWithTaxes"
                valueToSubtract="equipmentPlusMaterials"
              />
            </TableRow>
            <TableRow key="labor-row">
              <BoldedTableCell>
                <>Cost with labor</>
                <StyledIconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() =>
                    laborsDialog({
                      labor: laborBreakDown,
                      onSubmit: async (labors) => {
                        if (!labors) {
                          showSnackbar({
                            title:
                              "Internal Server Error - Something went wrong.",
                            show: true,
                            status: "error",
                          });
                          return false;
                        }

                        let errors = false;
                        labors.forEach((labor) => {
                          if (labor.qty < 0 || labor.cost < 0) {
                            errors = true;
                            return false;
                          }
                        });

                        if (errors) {
                          showSnackbar({
                            title:
                              "Labor cost / quantity must be greater than or equal to 0.",
                            show: true,
                            status: "error",
                          });
                          return false;
                        }

                        updateProposalLabors(dispatch, labors, true);
                        showSnackbar({
                          title: "Successfully updated labor!",
                          show: true,
                          status: "success",
                        });
                        return true;
                      },
                    })
                  }
                >
                  {<SettingsIcon />}
                </StyledIconButton>
              </BoldedTableCell>
              <TableCell>{ccyFormat(costOfLabor)}</TableCell>
              <QuoteOptionPriceCell
                quotes={quotesWithProducts}
                pricingForQuotesData={baselinePricingForQuotes}
                valueToFetch="costWithLabor"
                valueToSubtract={undefined}
              />
            </TableRow>
            <TableRow key="fees-row">
              <BoldedTableCell>
                <>Cost with fees</>
                <StyledIconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() =>
                    feesDialog({
                      fees: feesBreakDown,
                      onSubmit: async (fees) => {
                        if (!fees) {
                          showSnackbar({
                            title:
                              "Internal Server Error - Something went wrong.",
                            show: true,
                            status: "error",
                          });
                          return false;
                        }

                        let errors = false;
                        fees.forEach((fee) => {
                          if (fee.cost < 0) {
                            errors = true;
                            return false;
                          }
                        });

                        if (errors) {
                          showSnackbar({
                            title:
                              "Fee costs must be greater than or equal to 0.",
                            show: true,
                            status: "error",
                          });
                          return false;
                        }

                        updateProposalFees(dispatch, fees, true);
                        showSnackbar({
                          title: "Successfully updated fees!",
                          show: true,
                          status: "success",
                        });
                        return true;
                      },
                    })
                  }
                >
                  {<SettingsIcon />}
                </StyledIconButton>
              </BoldedTableCell>
              <TableCell>{ccyFormat(costOfFees)}</TableCell>
              <QuoteOptionPriceCell
                quotes={quotesWithProducts}
                pricingForQuotesData={baselinePricingForQuotes}
                valueToFetch="costAfterFees"
                valueToSubtract={undefined}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const QuoteOptionPriceCell = ({
  quotes,
  pricingForQuotesData,
  valueToFetch,
  valueToSubtract,
}: {
  quotes: QuoteOption[];
  pricingForQuotesData: Record<string, Record<string, number>>;
  valueToFetch: string;
  valueToSubtract: string | undefined;
}) => {
  const dataToShow = (quote_name: string) => {
    return ccyFormat(pricingForQuotesData[quote_name][valueToFetch]);
  };

  const dataToIncrementBy = (quote_name: string) => {
    return valueToSubtract
      ? `(+${ccyFormat(
          pricingForQuotesData[quote_name][valueToFetch] -
            pricingForQuotesData[quote_name][valueToSubtract]
        )})`
      : undefined;
  };

  const formattedContent = (quote_name: string) =>
    valueToSubtract
      ? `${dataToShow(quote_name)} ${dataToIncrementBy(quote_name)}`
      : dataToShow(quote_name);

  return (
    <>
      {quotes.length > 0 ? (
        quotes.map((quote) => {
          return (
            <TableCell key={quote.guid}>
              {formattedContent(quote.guid)}
            </TableCell>
          );
        })
      ) : (
        <TableCell />
      )}
    </>
  );
};

export default CostBreakdown;
