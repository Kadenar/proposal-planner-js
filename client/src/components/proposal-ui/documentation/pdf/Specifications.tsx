import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfInvoice, QuoteOption } from "../../../../middleware/Interfaces";
import { ccyFormat } from "../../../../lib/pricing-utils";

const styles = StyleSheet.create({
  proposal_view: {
    border: "1px solid black",
    padding: 5,
    flexGrow: 1,
    gap: 10,
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
    marginTop: 5,
  },
  summary: {
    fontSize: 12,
  },
  specification_title: {
    fontSize: 12,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  specifications: {
    fontSize: 12,
    gap: 5,
  },
});

const Specifications = ({
  invoice,
  quote,
  index,
}: {
  invoice: PdfInvoice;
  quote: QuoteOption;
  index: number;
}) => (
  <>
    <View style={styles.proposal_view}>
      <Text style={{ fontSize: 7 }}>
        We hereby submit specifications and estimate for:
      </Text>
      <Text style={styles.title}>
        {quote.title || `Quote option #${index}`}
      </Text>
      <Text style={styles.summary}>
        {quote.summary || "Enter a brief summary for this proposal!"}
      </Text>
      <Text style={styles.specification_title}>
        Installation with include the following:
      </Text>
      <View style={styles.specifications}>
        {quote.specifications?.map((spec, idx) => {
          return <Text key={idx}>{`${idx + 1}. ${spec.text}`}</Text>;
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
