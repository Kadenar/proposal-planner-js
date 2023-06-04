import React, { useMemo } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Font,
  PDFViewer,
  View,
} from "@react-pdf/renderer";
import RobisonInvoiceHeader from "../pdf/InvoiceHeader";
import SubmittedToContent from "../pdf/SubmittedToContent";
import { calculateTotalCost } from "../../../../data-management/utils";
import { NumericFormat } from "react-number-format";
import PaymentOptions from "./PaymentOptions";
import Specifications from "./Specifications";

export const PdfDocument = ({ clientInfo, proposalDetails }) => {
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
      invoiceTotal: calculateTotalCost(proposalDetails.data).invoiceTotal,
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
    <>
      <PDFViewer
        fullWidth
        style={{ margin: "0 auto", minHeight: "60vh", minWidth: "85vw" }}
      >
        <MyDocument invoice={invoice_data} />
      </PDFViewer>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  proposal_view: {
    border: "1px solid black",
    padding: 5,
    flexGrow: 1,
  },
  small_text: {
    fontSize: 10,
  },
  proposal_body: {
    padding: 12,
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
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

const NumberAsCurrency = ({ value }) => {
  return (
    <NumericFormat
      sx={{ fontSize: 10 }}
      value={value}
      displayType={"text"}
      decimalScale={2}
      thousandSeparator={true}
      prefix={"$"}
      renderText={(formattedValue) => (
        <Text
          style={{
            fontSize: 10,
            marginLeft: 5,
            fontFamily: "Times-Bold",
            borderBottom: "1px solid black",
            paddingBottom: 5,
            paddingLeft: 25,
            flexGrow: 1,
            marginRight: 50,
          }}
        >
          {formattedValue}
        </Text>
      )}
    />
  );
};

const MyDocument = ({ invoice }) => {
  return (
    <Document>
      <Page style={styles.body}>
        <RobisonInvoiceHeader />
        <SubmittedToContent invoice={invoice} />

        {/* Submitted to content STARTS here */}
        <View style={styles.proposal_view}>
          <Text style={{ paddingLeft: 5, fontSize: 7, position: "absolute" }}>
            We hereby submit specifications and estimate for:
          </Text>
          <Text style={styles.proposal_body}>{invoice.proposal_title}</Text>
          <Text style={styles.proposal_body}>{invoice.proposal_summary}</Text>
          <Text style={styles.proposal_body}>
            {invoice.proposal_specifications}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            paddingRight: 10,
            fontSize: 10,
            fontFamily: "Times-Bold",
          }}
        >
          <Text style={{}}>
            Robison will provide material and labor for the above specifications
            for the sum of:
          </Text>
          <NumberAsCurrency value={invoice.invoiceTotal}>
            {"$"}
            {invoice.invoiceTotal}
          </NumberAsCurrency>
        </View>
        {/* <Specifications invoice={invoice} /> */}
      </Page>

      {/* Submitted to content ENDS here */}
      <PaymentOptions />
    </Document>
  );
};

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
