import { useMemo } from "react";
import calculateLabor, {
  calculateCostForOption,
  calculateCostForProductsInOption,
  calculateFees,
} from "../components/proposal-ui/pricing/pricing-utils";
import { omit } from "lodash";

import * as Interfaces from "../data-management/middleware/Interfaces";

export function useProposalData(selectedProposal: Interfaces.ProposalObject) {
  const products = selectedProposal.data.products;
  const fees = selectedProposal.data.fees;
  const labor = selectedProposal.data.labor;

  // The columns that should be dynamically added to the table to represent each option quoted
  const productsInOptionsArrays = useMemo(() => {
    return products.reduce<Interfaces.PsuedoObjectOfModel>(
      (result, currentValue) => {
        (result[currentValue.quote_option] =
          result[currentValue.quote_option] || []).push(currentValue);
        return result;
      },
      {} as Interfaces.PsuedoObjectOfModel
    );
  }, [products]);

  // Calculate the cost of products applied to ALL quotes
  const costAppliedToAllQuotes = useMemo(() => {
    return calculateCostForProductsInOption(productsInOptionsArrays[0] || []);
  }, [productsInOptionsArrays]);

  // Construct table information for each quote
  const pricingForQuotesData = useMemo(() => {
    // Omit option 0
    const remainingOptions = omit(productsInOptionsArrays, "0");

    // Calculate the cost of the remaining options
    return Object.keys(remainingOptions).reduce<{ [key: string]: number }[]>(
      (result, option: string) => ({
        ...result,
        [option]: calculateCostForOption(
          selectedProposal,
          productsInOptionsArrays[option],
          costAppliedToAllQuotes
        ),
      }),
      {} as { [key: string]: number }[]
    );
  }, [productsInOptionsArrays, costAppliedToAllQuotes, selectedProposal]);

  const arrayOfQuoteNames = useMemo(() => {
    return Object.keys(pricingForQuotesData);
  }, [pricingForQuotesData]);

  const _fees = useMemo(() => {
    return calculateFees(fees);
  }, [fees]);

  const _labor = useMemo(() => {
    return calculateLabor(labor);
  }, [labor]);

  return {
    productsInOptionsArrays,
    costAppliedToAllQuotes,
    pricingForQuotesData,
    arrayOfQuoteNames,
    fees: _fees,
    labor: _labor,
  };
}
