import React, { useMemo, useState } from "react";
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

import { StyledIconButton } from "../../../coreui/StyledComponents";
import RobisonInvoiceHeader from "./InvoiceHeader";
import SubmittedToContent from "./SubmittedToContent";
import { calculateCostForProductsInOption } from "../../pricing/pricing-utils";
import PaymentOptions from "./PaymentOptions";
import Specifications from "./Specifications";

export const PdfDocument = ({ clientInfo, proposalDetails }) => {
  const [open, setOpen] = useState(true);
  // Prepare invoice data for PDF
  const invoice_data = useMemo(() => {
    return {
      submitted_to: clientInfo?.name,
      address: `${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`,
      phone: clientInfo?.phone,
      email: clientInfo?.email,
      current_date: proposalDetails?.dateModified,
      accountNum: clientInfo?.accountNum,
      proposal_title: proposalDetails.data?.title,
      proposal_summary: proposalDetails.data?.summary,
      proposal_specifications: proposalDetails.data?.specifications,
      invoiceTotals: 0,
      // TODO FIX THIS
      // calculateCostForProductsInOption(proposalDetails).invoiceTotal,
    };
  }, [clientInfo, proposalDetails]);

  if (!clientInfo || !proposalDetails) {
    return (
      <>
        Client or proposal detials necessary to create the PDF could not be
        found. This might be an orphaned proposal?
      </>
    );
  }
  return (
    <Card sx={{ padding: 2 }}>
      <StyledIconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpen(!open)}
        style={{ fontWeight: "bold", marginButton: 10 }}
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
          <PDFViewer fullWidth style={{ minWidth: "100%" }}>
            <Document>
              <Page style={styles.body}>
                <RobisonInvoiceHeader />
                <SubmittedToContent invoice={invoice_data} />
                <Specifications invoice={invoice_data} />
                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) =>
                    `${pageNumber} / ${totalPages}`
                  }
                  fixed
                />
              </Page>
              <PaymentOptions />
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
