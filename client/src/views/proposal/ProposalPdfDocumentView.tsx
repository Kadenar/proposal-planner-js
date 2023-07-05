import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { PdfDocument } from "../../components/proposal-ui/documentation/pdf/PdfDocument";
import { Card, MenuItem, Stack, TextField, Typography } from "@mui/material";
import QuoteSelection from "../../components/QuoteSelection";
import { useProposalPricing } from "../../hooks/useProposalData";
import { PdfInvoice, ProposalObject } from "../../middleware/Interfaces";
import { setProposalStartDate } from "../../services/slices/activeProposalSlice";
import { debounce, groupBy } from "lodash";
import {
  ccyFormat,
  updateFinancingOptionsWithCost,
} from "../../lib/pricing-utils";

const ProposalPdfDocumentView = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { financing } = useAppSelector((state) => state.financing);

  const quote_options = activeProposal?.data.quote_options;
  const [quote_option, setQuoteOption] = useState(0);

  const { markedUpPricesForQuotes } = useProposalPricing(activeProposal);
  const [markUpOption, setMarkupOption] = useState(6);

  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal.owner.guid;
    });
  }, [activeProposal, clients]);

  const invoice_data = useMemo<PdfInvoice | undefined>(() => {
    if (!clientInfo) {
      return undefined;
    }

    const markedUpPrices = markedUpPricesForQuotes[`quote_${quote_option + 1}`];

    const pricingForQuote = markedUpPrices
      ? markedUpPrices[markUpOption]?.sellPrice
      : 0;

    return {
      submitted_to: clientInfo?.name,
      address: `${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`,
      phone: clientInfo?.phone,
      email: clientInfo?.email,
      start_date: activeProposal?.data.start_date,
      current_date: activeProposal?.dateModified,
      accountNum: clientInfo?.accountNum,
      quoteOptions: activeProposal?.data.quote_options,
      invoiceTotal: pricingForQuote,
      financingOptions: groupBy(
        updateFinancingOptionsWithCost(financing, pricingForQuote),
        "provider"
      ),
    };
  }, [
    clientInfo,
    activeProposal,
    markUpOption,
    markedUpPricesForQuotes,
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
          it
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
            id="select"
            label="Cost for customer / your commission"
            value={markUpOption}
            onChange={({ target: { value } }) => {
              setMarkupOption(Number(value));
            }}
            select
          >
            {markedUpPricesForQuotes &&
              markedUpPricesForQuotes[`quote_${quote_option + 1}`].map(
                (option, index) => {
                  return (
                    <MenuItem value={index}>{`Cost: ${ccyFormat(
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
