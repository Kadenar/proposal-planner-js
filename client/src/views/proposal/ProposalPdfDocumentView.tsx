import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { PdfDocument } from "../../components/proposal-ui/documentation/pdf/PdfDocument";
import { Card, MenuItem, Stack, TextField, Typography } from "@mui/material";
import QuoteSelection from "../../components/QuoteSelection";
import { useProposalPricing } from "../../hooks/useProposalData";
import { PdfInvoice, ProposalObject } from "../../middleware/Interfaces";
import {
  setProposalStartDate,
  setTargetCommission,
  setTargetQuoteOption,
} from "../../services/slices/activeProposalSlice";
import { debounce, groupBy } from "lodash";
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
  const { markedUpPricesForQuotes } = useProposalPricing(activeProposal);

  const quote_options = activeProposal.data.quote_options;

  // Get active quote option - handling the possibility user deleted products removing quote option
  const quote_option =
    activeProposal.data.target_quote &&
    quote_options[activeProposal.data.target_quote].hasProducts
      ? activeProposal.data.target_quote
      : 0;

  const markedUpPrices = markedUpPricesForQuotes[`quote_${quote_option + 1}`];

  // Default markup option to most expensive unless user made a selection
  const markUpOption =
    activeProposal.data.target_commission === undefined
      ? markedUpPrices.length - 1
      : activeProposal.data.target_commission;

  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal.owner.guid;
    });
  }, [activeProposal, clients]);

  const invoice_data = useMemo<PdfInvoice | undefined>(() => {
    if (!clientInfo) {
      return undefined;
    }

    const pricingForQuote = markedUpPrices
      ? markedUpPrices[markUpOption]?.sellPrice
      : 0;

    return {
      submitted_to: clientInfo?.name,
      address: `${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`,
      phone: clientInfo?.phone,
      email: clientInfo?.email,
      start_date: activeProposal?.data.start_date,
      current_date: activeProposal?.date_modified,
      accountNum: clientInfo?.accountNum,
      quoteOptions: activeProposal?.data.quote_options,
      invoiceTotal: pricingForQuote,
      financingOptions: groupBy(
        updateFinancingOptionsWithCost(financing, pricingForQuote),
        "provider"
      ),
    };
  }, [clientInfo, activeProposal, markedUpPrices, markUpOption, financing]);

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

  if (!invoice_data.quoteOptions || invoice_data.quoteOptions.length === 0) {
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
            quote_guid={quote_options[quote_option].guid}
            quoteOptions={quote_options || []}
            onChangeCallback={(value) => {
              setTargetQuoteOption(dispatch, value);
            }}
          />
          <TextField
            id="select"
            label="Cost for customer / your commission"
            value={markUpOption}
            onChange={({ target: { value } }) => {
              setTargetCommission(dispatch, Number(value));
            }}
            select
          >
            {markedUpPricesForQuotes &&
              markedUpPricesForQuotes[`quote_${quote_option + 1}`].map(
                (option, index) => {
                  return (
                    <MenuItem key={index} value={index}>{`Cost: ${ccyFormat(
                      option.sellPrice
                    )} - Commission: ${option.commissionPercent}%`}</MenuItem>
                  );
                }
              )}
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
      {clientInfo && <ClientCardDetails activeClient={clientInfo} />}
      <PdfDocument invoice_data={invoice_data} quote_option={quote_option} />
    </Stack>
  );
};

export default ProposalPdfDocumentView;
