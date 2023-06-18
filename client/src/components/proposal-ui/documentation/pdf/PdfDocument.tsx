import { useState } from "react";
import {
  Text,
  Document,
  Page,
  StyleSheet,
  PDFViewer,
  View,
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
import { PdfInvoice } from "../../../../middleware/Interfaces";

export const PdfDocument = ({
  invoice_data,
  quote_option,
}: {
  invoice_data: PdfInvoice;
  quote_option: number;
}) => {
  const [open, setOpen] = useState(true);

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
              <Page style={styles.body}>
                <View
                  style={{
                    border: "3px solid purple",
                    flexGrow: 1,
                    paddingHorizontal: 20,
                    paddingBottom: 65,
                    paddingTop: 25,
                  }}
                >
                  <RobisonInvoiceHeader />
                  <SubmittedToContent invoice={invoice_data} />
                  <Specifications
                    invoice={invoice_data}
                    quote={invoice_data.quoteOptions[quote_option]}
                    index={quote_option + 1}
                  />
                  <Text
                    style={styles.pageNumber}
                    render={({ pageNumber, totalPages }) => `${1} / ${2}`}
                    fixed
                  />
                </View>
              </Page>

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
    padding: 10,
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
