import React from "react";

import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { NumericFormat } from "react-number-format";

const styles = StyleSheet.create({
  proposal_view: {
    border: "1px solid black",
    padding: 5,
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
});

const NumberAsCurrency = ({ value }) => {
  return (
    <NumericFormat
      value={value}
      displayType={"text"}
      decimalScale={2}
      thousandSeparator={true}
      prefix={"$"}
      renderText={(formattedValue) => <Text>{formattedValue}</Text>}
    />
  );
};

const Specifications = ({ invoice }) => (
  <View>
    <View style={styles.proposal_view}>
      <Text style={styles.proposal_body}>
        <Text style={styles.small_text}>
          We hereby submit specifications and estimate for:
        </Text>
      </Text>
    </View>

    <View style={{ flexDirection: "row" }}>
      <Text
        style={{
          marginTop: 15,
          paddingRight: 10,
          fontSize: 10,
          fontFamily: "Times-Bold",
        }}
      >
        Robison will provide material and labor for the above specifications for
        the sum of:
      </Text>
      <NumberAsCurrency
        value={invoice.invoiceTotal}
        style={{
          marginLeft: 5,
          fontFamily: "Times-Bold",
          textDecoration: "underline",
        }}
      >
        {"$"}
        {invoice.invoiceTotal}
      </NumberAsCurrency>
    </View>
  </View>
);

export default Specifications;
