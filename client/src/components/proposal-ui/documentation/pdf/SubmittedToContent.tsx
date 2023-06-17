import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { PdfInvoice } from "../../../../middleware/Interfaces";

const styles = StyleSheet.create({
  proposal_view: {
    border: "1px solid black",
    padding: 5,
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
  basic_font: {
    fontSize: 11,
  },
  proposal_bar: {
    backgroundColor: "grey",
    color: "white",
    padding: 5,
    fontSize: 13,
    height: 25,
    marginBottom: 15,
  },
});

const SubmittedToContent = ({ invoice }: { invoice: PdfInvoice }) => (
  <View>
    <Text style={styles.proposal_bar}>Proposal</Text>
    <View style={styles.basic_font}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={{ flexGrow: 0 }}>Proposal Submitted To: </Text>
        <Text style={{ flexGrow: 1, borderBottom: "1px solid black" }}>
          {invoice.submitted_to}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            minWidth: 100,
            paddingLeft: 10,
          }}
        >
          <Text>Date: </Text>
          <Text style={{ flexGrow: 1, borderBottom: "1px solid black" }}>
            {invoice.current_date}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ flexGrow: 0 }}>Address: </Text>
        <Text style={{ flexGrow: 1, borderBottom: "1px solid black" }}>
          {invoice.address}
        </Text>
      </View>
      <Text style={{ left: 45, fontSize: 10, fontFamily: "Times-Italic" }}>
        Street, City, State, Zip
      </Text>

      <View style={{ flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
        <Text style={{ flexGrow: 0 }}>Phone: </Text>
        <Text
          style={{
            flexGrow: 1,
            borderBottom: "1px solid black",
            marginRight: 10,
          }}
        >
          {invoice.phone}
        </Text>
        <Text style={{ flexGrow: 0 }}>Email: </Text>
        <Text
          style={{
            color: "blue",
            flexGrow: 1,
            borderBottom: "1px solid black",
          }}
        >
          {invoice.email}
        </Text>
      </View>

      <View
        style={{
          justifyContent: "space-evenly",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <Text style={{ flexGrow: 0 }}>Job Submitted By: </Text>
        <Text
          style={{
            flexGrow: 1,
            marginRight: 10,
            borderBottom: "1px solid black",
          }}
        >
          Tim Fernandez
        </Text>
        <Text style={{ flexGrow: 0 }}>Approximate Start Date: </Text>
        <Text
          style={{
            flexGrow: 1,
            marginRight: 10,
            borderBottom: "1px solid black",
            paddingLeft: 10,
          }}
        >
          ASAP
        </Text>
        <Text style={{ flexGrow: 0 }}>Account # </Text>
        <Text
          style={{
            flexGrow: 1,
            paddingLeft: 5,
            borderBottom: "1px solid black",
          }}
        >
          {invoice.accountNum || "New Customer"}
        </Text>
      </View>
    </View>
  </View>
);

export default SubmittedToContent;
