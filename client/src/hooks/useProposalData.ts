import { useMemo } from "react";
import {
  calculateLabor,
  calculateCostForOption,
  calculateCostForProductsInOption,
  calculateFees,
  getFullProductData,
  calculateMarkedUpCostsForOption,
} from "../lib/pricing-utils";
import { omit } from "lodash";
import {
  ProposalObject,
  ProductOnProposalWithPricing,
  Markup,
} from "../middleware/Interfaces";
import { useAppSelector } from "../services/store";

export function useProposalPricing(activeProposal: ProposalObject) {
  const { products } = useAppSelector((state) => state.products);
  const { fees } = useAppSelector((state) => state.fees);
  const { equipmentMarkups, laborMarkups } = useAppSelector(
    (state) => state.multipliers
  );
  const productsOnProposal = activeProposal.data.products;
  const unit_cost_tax = activeProposal.data.unit_cost_tax;

  // The columns that should be dynamically added to the table to represent each option quoted
  const productsInOptionsArrays = useMemo(() => {
    const fullProducts = getFullProductData(productsOnProposal, products);

    const reducedProducts = fullProducts.reduce<
      Record<string, ProductOnProposalWithPricing[]>
    >((result, currentValue) => {
      (result[`quote_${currentValue.quote_option}`] =
        result[`quote_${currentValue.quote_option}`] || []).push(currentValue);
      return result;
    }, {} as Record<number, ProductOnProposalWithPricing[]>);

    return reducedProducts;
  }, [productsOnProposal, products]);

  // Calculate the cost of products applied to ALL quotes
  const costAppliedToAllQuotes = useMemo(() => {
    return calculateCostForProductsInOption(
      productsInOptionsArrays["quote_0"] || []
    );
  }, [productsInOptionsArrays]);

  const costOfFees = useMemo(() => {
    return calculateFees(activeProposal.data.fees, fees);
  }, [activeProposal.data.fees, fees]);

  const costOfLabor = useMemo(() => {
    return calculateLabor(activeProposal.data.labor);
  }, [activeProposal.data.labor]);

  // Construct table information for each quote
  const baselinePricingForQuotes = useMemo(() => {
    // Omit option 0
    const remainingOptions = omit(productsInOptionsArrays, "quote_0");

    // Calculate the cost of the remaining options
    return Object.keys(remainingOptions).reduce<
      Record<string, Record<string, number>>
    >(
      (result, option) => ({
        ...result,
        [option]: calculateCostForOption(
          productsInOptionsArrays[option],
          costAppliedToAllQuotes,
          unit_cost_tax,
          costOfFees,
          costOfLabor
        ),
      }),
      {} as Record<string, Record<string, number>>
    );
  }, [
    productsInOptionsArrays,
    costAppliedToAllQuotes,
    unit_cost_tax,
    costOfFees,
    costOfLabor,
  ]);

  const markedUpPricesForQuotes = useMemo(() => {
    return Object.keys(baselinePricingForQuotes).reduce<
      Record<string, Markup[]>
    >(
      (result, option) => ({
        ...result,
        [option]: calculateMarkedUpCostsForOption(
          baselinePricingForQuotes[option].invoiceTotal,
          baselinePricingForQuotes[option].costOfFees,
          baselinePricingForQuotes[option].costOfLabor,
          baselinePricingForQuotes[option].totalWithTaxes,
          laborMarkups,
          equipmentMarkups
        ),
      }),
      {} as Record<string, Markup[]>
    );
  }, [baselinePricingForQuotes, laborMarkups, equipmentMarkups]);

  return {
    costAppliedToAllQuotes,
    baselinePricingForQuotes,
    markedUpPricesForQuotes,
    costOfFees,
    costOfLabor,
  };
}
