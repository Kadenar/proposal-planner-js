import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfInvoice } from "../../../../middleware/Interfaces";
import { ccyFormat } from "../../../../lib/pricing-utils";
import ListItem from "./ListItem";

const styles = StyleSheet.create({
  proposal_view: {
    border: "1px solid black",
    padding: 5,
    flexGrow: 1,
    gap: 5,
  },
  proposal_body: {
    padding: 12,
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  small_text: {
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
    margin: 0,
  },
  summary: {
    fontSize: 11,
  },
  specification_title: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  specifications: {
    fontSize: 10,
    gap: 5,
    marginLeft: 5,
    marginRight: 25,
  },
});

const Specifications = ({ invoice }: { invoice: PdfInvoice }) => (
  <>
    <View style={styles.proposal_view}>
      <Text style={{ fontSize: 7 }}>
        We hereby submit specifications and estimate for:
      </Text>
      <Text style={styles.title}>
        {invoice.title || "Specify a title for your quote"}
      </Text>
      <Text style={styles.summary}>
        {invoice.summary || "Enter a brief summary for this proposal!"}
      </Text>
      <Text style={styles.specification_title}>
        Installation will include the following:
      </Text>
      <View style={styles.specifications}>
        {invoice.specifications?.map((spec, idx) => {
          return <ListItem key={idx} index={idx + 1} text={spec.text} />;
        })}
      </View>
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
      <Text>
        Robison will provide material and labor for the above specifications for
        the sum of:
      </Text>
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
        {ccyFormat(invoice.invoiceTotal)}
      </Text>
    </View>
  </>
);

export default Specifications;
