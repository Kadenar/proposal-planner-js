import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { PdfDocument } from "../../components/proposal-ui/documentation/pdf/PdfDocument";
import { Card, Stack, TextField, Typography } from "@mui/material";
import QuoteSelection from "../../components/QuoteSelection";
import { useProposalData } from "../../hooks/useProposalData";
import {
  Financing,
  PdfInvoice,
  ProposalObject,
} from "../../middleware/Interfaces";
import { setProposalStartDate } from "../../services/slices/activeProposalSlice";
import { debounce, groupBy } from "lodash";

function updateFinancingOptionsWithCost(
  financingOptions: Financing[],
  totalCost: number
) {
  return [...financingOptions].map((option) => {
    let totalNumPayments = option.term_length;
    // If it is yearly, multiply the payments by 12
    if (option.term_type === "years") {
      totalNumPayments *= 12;
    }

    const loanAmount = totalCost - 0; // Can replace 0 with the money down option if that were an option

    // Calculating the Payment Amount per Period
    // A = P * (r*(1+r)^n) / ((1+r)^n - 1)
    // a = payment amount per period
    // P = initial principal (loan amount)
    // r = interest rate per period
    // n = total number of payments or periods
    let ratePerPeriod = option.interest / 12.0 / 100.0;
    let paymentPerPeriod;

    // If the rate is 0, then the loan is just all principal payments
    if (ratePerPeriod === 0) {
      paymentPerPeriod = loanAmount / totalNumPayments;
    } else {
      const paymentPerPeriodTop =
        ratePerPeriod * Math.pow(1 + ratePerPeriod, totalNumPayments);
      const paymentPerPeriodBot =
        Math.pow(1 + ratePerPeriod, totalNumPayments) - 1;
      paymentPerPeriod =
        loanAmount * (paymentPerPeriodTop / paymentPerPeriodBot);
    }

    return {
      ...option,
      costPerMonth: paymentPerPeriod,
    };
  });
}

const ProposalPdfDocumentView = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { financing } = useAppSelector((state) => state.financing);

  const [quote_option, setQuoteOption] = useState(0);
  const quote_options = activeProposal?.data.quote_options;

  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal.owner.guid;
    });
  }, [activeProposal, clients]);

  const { pricingForQuotesData } = useProposalData(activeProposal);
  const invoice_data = useMemo<PdfInvoice | undefined>(() => {
    if (!clientInfo) {
      return undefined;
    }

    return {
      submitted_to: clientInfo?.name,
      address: `${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`,
      phone: clientInfo?.phone,
      email: clientInfo?.email,
      start_date: activeProposal?.data.start_date,
      current_date: activeProposal?.dateModified,
      accountNum: clientInfo?.accountNum,
      quoteOptions: activeProposal?.data.quote_options,
      invoiceTotals: pricingForQuotesData,
      financingOptions: groupBy(
        updateFinancingOptionsWithCost(
          financing,
          pricingForQuotesData[quote_option + 1]?.invoiceTotal || 0
        ),
        "provider"
      ),
    };
  }, [
    clientInfo,
    activeProposal,
    pricingForQuotesData,
    financing,
    quote_option,
  ]);

  const setStartDateDebounced = useRef(
    debounce(async (value) => {
      setProposalStartDate(dispatch, value);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      setStartDateDebounced.cancel();
    };
  }, [setStartDateDebounced]);

  if (!invoice_data) {
    return (
      <Stack alignItems="center">
        <Typography variant="h6">
          Client details necessary to create the PDF could not be found. This
          might be an orphaned proposal?
        </Typography>
      </Stack>
    );
  }

  if (!invoice_data.quoteOptions || invoice_data.quoteOptions.length === 0) {
    return (
      <Stack alignItems="center">
        <Typography variant="h6">
          Please add products to this proposal before trying to view the PDF for
          it.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Card sx={{ padding: 2, gap: 2 }}>
        <Stack gap={2}>
          <QuoteSelection
            initialValue={quote_option}
            quoteOptions={quote_options || []}
            onChangeCallback={(value) => {
              setQuoteOption(value);
            }}
          />
          <TextField
            autoComplete="off"
            id="start-date"
            label="Starting date"
            defaultValue={activeProposal.data.start_date}
            onChange={({ target: { value } }) => {
              setStartDateDebounced(value);
            }}
          />
        </Stack>
      </Card>
      <PdfDocument invoice_data={invoice_data} quote_option={quote_option} />
    </Stack>
  );
};

export default ProposalPdfDocumentView;
