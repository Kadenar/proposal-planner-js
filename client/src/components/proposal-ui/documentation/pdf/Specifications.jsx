import React from "react";

import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { NumericFormat } from "react-number-format";

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
  },
});

const Specifications = ({ invoice }) => (
  <>
    <View style={styles.proposal_view}>
      <Text style={{ fontSize: 7 }}>
        We hereby submit specifications and estimate for:
      </Text>
      <Text style={styles.title}>{invoice.proposal_title}</Text>
      <Text style={styles.summary}>{invoice.proposal_summary}</Text>
      <Text style={styles.specification_title}>
        Installation with include the following:
      </Text>
      <Text style={styles.specifications}>
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
        Robison will provide material and labor for the above specifications for
        the sum of:
      </Text>
      <NumberAsCurrency value={invoice.invoiceTotal}>
        {"$"}
        {invoice.invoiceTotal}
      </NumberAsCurrency>
    </View>
  </>
);

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

export default Specifications;
