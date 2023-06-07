import React from "react";
import logo from "../../../../resources/robison_oil.png";

import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 15,
  },
  logo: {
    width: 130,
    height: 70,
  },
  address: {
    fontSize: 12,
  },
});

const RobisonInvoiceHeader = () => (
  <View style={styles.header}>
    <Image style={styles.logo} src={logo} />
    <View style={styles.address}>
      <Text>One Gatway Plaza, 4th Flr</Text>
      <Text>Port Chester, NY 10573</Text>
      <Text>(914)-345-5700</Text>
      <Text>Fax (914)-345-5783</Text>
    </View>
  </View>
);

export default RobisonInvoiceHeader;
