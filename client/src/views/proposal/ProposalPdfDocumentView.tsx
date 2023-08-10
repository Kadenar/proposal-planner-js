import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { debounce, groupBy } from "lodash";
import {
  setProposalStartDate,
  setTargetCommission,
  setTargetQuoteOption,
} from "../../services/slices/activeProposalSlice";

import { PdfDocument } from "../../components/proposal-ui/documentation/pdf/PdfDocument";
import { Card, MenuItem, Stack, TextField, Typography } from "@mui/material";

import QuoteSelection from "../../components/QuoteSelection";
import { ProposalPricingData } from "../../hooks/ProposalPricingData";
import { PdfInvoice, ProposalObject } from "../../middleware/Interfaces";

import {
  ccyFormat,
  updateFinancingOptionsWithCost,
} from "../../lib/pricing-utils";
import ClientCardDetails from "../../components/proposal-ui/documentation/ClientCardDetails";

const ProposalPdfDocumentView = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { financing } = useAppSelector((state) => state.financing);
  const { markedUpPricesForQuotes } = ProposalPricingData(activeProposal);

  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal.owner.guid;
    });
  }, [activeProposal, clients]);

  const quote_options = activeProposal.data.quote_options;

  // Get active quote option - handling the possibility user deleted products removing quote option
  const quote_option_index =
    activeProposal.data.target_quote &&
    quote_options[activeProposal.data.target_quote].hasProducts
      ? activeProposal.data.target_quote
      : 0;
  const selectedQuoteOption = quote_options[quote_option_index];
  const markedUpPrices = markedUpPricesForQuotes[selectedQuoteOption.guid];

  // Default markup option to most expensive unless user made a selection
  const markUpOptionIndex =
    activeProposal.data.target_commission === undefined
      ? markedUpPrices?.length - 1 || 0
      : activeProposal.data.target_commission;

  // Construct invoice data to populate the pdf with
  const invoice_data = useMemo<PdfInvoice | undefined>(() => {
    if (!clientInfo) {
      return undefined;
    }

    //The cost for the selected quote
    const pricingForQuote = markedUpPrices
      ? markedUpPrices[markUpOptionIndex]?.sellPrice
      : 0;

    return {
      submitted_to: clientInfo.name,
      address: `${clientInfo.address} ${clientInfo.apt} ${clientInfo.city} ${clientInfo.state} ${clientInfo.zip}`,
      phone: clientInfo.phone,
      email: clientInfo.email,
      accountNum: clientInfo.accountNum,
      current_date: activeProposal.date_modified,
      start_date: activeProposal.data.start_date,
      title: selectedQuoteOption.title,
      summary: selectedQuoteOption.summary,
      specifications: selectedQuoteOption.specifications,
      invoiceTotal: pricingForQuote,
      financingOptions: groupBy(
        updateFinancingOptionsWithCost(financing, pricingForQuote),
        "provider"
      ),
    };
  }, [
    clientInfo,
    activeProposal.date_modified,
    activeProposal.data.start_date,
    selectedQuoteOption,
    markedUpPrices,
    markUpOptionIndex,
    financing,
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
          Client details which are necessary to create the PDF could not be
          found. This might be an orphaned proposal?
        </Typography>
      </Stack>
    );
  }

  if (!markedUpPrices || markedUpPrices.length === 0) {
    return (
      <Stack alignItems="center">
        <Typography variant="h6">
          Please add products to this proposal before trying to view the PDF for
          it
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Card sx={{ padding: 2, gap: 2 }}>
        <Stack gap={2}>
          <Typography variant="h6" fontWeight={"bold"}>
            Source for PDF generation
          </Typography>
          <QuoteSelection
            value={selectedQuoteOption.guid}
            quoteOptions={quote_options}
            onChangeCallback={(value) => {
              setTargetQuoteOption(dispatch, value);
            }}
          />
          <TextField
            id="select"
            label="Cost for customer / your commission"
            value={markUpOptionIndex}
            onChange={({ target: { value } }) => {
              setTargetCommission(dispatch, Number(value));
            }}
            select
          >
            {markedUpPrices &&
              markedUpPrices.map((option, index) => {
                return (
                  <MenuItem key={index} value={index}>{`Cost: ${ccyFormat(
                    option.sellPrice
                  )} - Commission: ${option.commissionPercent}%`}</MenuItem>
                );
              })}
          </TextField>
          <TextField
            autoComplete="off"
            id="start-date"
            label="Starting date"
            placeholder="ASAP"
            defaultValue={activeProposal.data.start_date}
            onChange={({ target: { value } }) => {
              setStartDateDebounced(value);
            }}
          />
        </Stack>
      </Card>
      <ClientCardDetails activeClient={clientInfo} />
      <PdfDocument invoice_data={invoice_data} />
    </Stack>
  );
};

export default ProposalPdfDocumentView;
