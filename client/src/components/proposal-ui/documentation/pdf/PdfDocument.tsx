import { useMemo, useState } from "react";
import {
  Text,
  Document,
  Page,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { StyledIconButton } from "../../../StyledComponents";
import RobisonInvoiceHeader from "./InvoiceHeader";
import SubmittedToContent from "./SubmittedToContent";
import PaymentOptions from "./PaymentOptions";
import Specifications from "./Specifications";
import {
  ClientObject,
  PdfInvoice,
  ProposalObject,
} from "../../../../middleware/Interfaces";
import { useProposalData } from "../../../../hooks/useProposalData";

export const PdfDocument = ({
  clientInfo,
  proposalDetails,
}: {
  clientInfo: ClientObject | undefined;
  proposalDetails: ProposalObject;
}) => {
  const [open, setOpen] = useState(true);
  const { pricingForQuotesData } = useProposalData(proposalDetails);

  const invoice_data = useMemo<PdfInvoice>(() => {
    return {
      submitted_to: clientInfo?.name,
      address: `${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`,
      phone: clientInfo?.phone,
      email: clientInfo?.email,
      current_date: proposalDetails?.dateModified,
      accountNum: clientInfo?.accountNum,
      quoteOptions: proposalDetails.data.quote_options,
      invoiceTotals: pricingForQuotesData,
    };
  }, [clientInfo, proposalDetails, pricingForQuotesData]);

  if (!clientInfo) {
    return (
      <>
        Client details necessary to create the PDF could not be found. This
        might be an orphaned proposal?
      </>
    );
  }
  return (
    <Card sx={{ padding: 2 }}>
      <StyledIconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
        style={{ fontWeight: "bold", marginBottom: 10 }}
      >
        {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        PDF Document
      </StyledIconButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Stack
          style={{
            flexDirection: "row",
            marginTop: 10,
            minHeight: "75vh",
          }}
        >
          <PDFViewer style={{ minWidth: "100%" }}>
            <Document>
              {invoice_data.quoteOptions?.map((quote, index) => {
                return (
                  <Page style={styles.body}>
                    <RobisonInvoiceHeader />
                    <SubmittedToContent invoice={invoice_data} />
                    <Specifications
                      invoice={invoice_data}
                      quote={quote}
                      index={index + 1}
                    />
                    <Text
                      style={styles.pageNumber}
                      render={({ pageNumber, totalPages }) => `${1} / ${2}`}
                      fixed
                    />
                  </Page>
                );
              })}
              <PaymentOptions invoice={invoice_data} />
            </Document>
          </PDFViewer>
        </Stack>
      </Collapse>
    </Card>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  small_text: {
    fontSize: 10,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
