import { Text, View, StyleSheet, Page } from "@react-pdf/renderer";
import { PdfInvoice } from "../../../../data-management/middleware/Interfaces";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  proposal_view: {
    border: "1px solid black",
    padding: 5,
  },
  small_text: {
    fontSize: 10,
  },
  text_bolded: {
    fontFamily: "Times-Bold",
  },
  text_italics: {
    fontFamily: "Times-Italic",
  },
  text_bold_underlined: {
    fontFamily: "Times-Bold",
    textDecoration: "underline",
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

const PaymentOptions = ({ invoice }: { invoice: PdfInvoice }) => (
  <Page style={styles.body}>
    <View style={styles.proposal_view}>
      <Text style={styles.small_text}>
        <Text style={styles.text_bolded}>Payment can be made as follows:</Text>
        <Text style={styles.text_italics}>
          (with customer credit check approval)
        </Text>
      </Text>

      <View style={{ gap: 20 }}>
        <Text style={{ fontFamily: "Times-Italic", fontSize: 10 }}>
          Please initial the payment plan option you would like to proceed with.
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 1</Text> - No Money
          Down - 0 Interest for 18 months ______ Initial
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 2</Text> - No Money
          Down - 5.99% Interest for 37 months ______ Initial
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 3</Text> - No Money
          Down - 7.99% Interest for 61 months ______ Initial
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 4</Text> - No Money
          Down - 9.99% Interest for 132 Months ______ Initial
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 5</Text> - 50% down
          payment & 50% due day of installation (with customer credit check
          approval) ______ Initial
        </Text>
        <Text style={styles.small_text}>
          <Text style={styles.text_bold_underlined}>Option # 6</Text> - 80% down
          payment & 20% due day of installation (with customer credit check
          approval) ______ Initial
        </Text>
      </View>
      <View style={{ gap: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 11 }}>
          Visa, Master Card, American Express, Discover or Personal Check
        </Text>
        <Text style={{ fontFamily: "Times-BoldItalic", fontSize: 11 }}>
          *Financing is through Synchrony Financial or National Energy
          Improvement Fund with customer credit approval
        </Text>
      </View>
    </View>

    <View style={{ fontSize: 10, marginTop: 10, flexDirection: "row" }}>
      <Text style={{ fontSize: 6, flexGrow: 1, marginBottom: 10 }}>
        All material is warranted to be as specified. All work to be completed
        in a workmanlike manner. Any alteration or deviation from above
        specifications involving extra costs found during or after installation
        will become an extra charge over and above the estimate. These may
        include extra code requirements, asbestos abatement, fire rated
        sheetrock, & fresh air ducts, etc. Robison is not responsible for any
        faulty piping, water or steam leak, oil lines, poor draft, or electrical
        wiring, etc. which may hinder the proper performance of the equipment
        being installed. Robison is not responsible for delays beyond its
        control. Homeowner to carry homeowner's insurance (fire, etc). All
        workmen will have workmen's' comp and public liability insurance.
      </Text>
      <View style={{ flexGrow: 1 }}>
        <Text>Authorized Signature: ________________________ </Text>
        <Text>
          Note: This proposal may be withdrawn by Robison if not accepted within
          30 days and is contingent upon managers approval.
        </Text>
        <Text>Approved: ______________</Text>
        <Text>Date: ______________</Text>
      </View>
    </View>
    <View style={{ fontSize: 11 }}>
      <Text style={styles.text_bolded}>Acceptance of Proposal: </Text>
      <Text>
        The above prices, specifications and conditions are satisfactory and are
        hereby accepted. Robison is authorized to do the work. Payment will be
        made as outlined above. To the extend that the price is being reduced by
        anticipated rebates, the customer will be responsible for the full price
        in the event rebate application is denied for any reason. Robison will
        make reasonable efforts to resubmit documents to remediate denial and
        will be in communication with homeowner throughout, including
        authorization to commence, choose alternate equipment or full
        cancellation option.
      </Text>
    </View>
    <View
      style={{
        flexDirection: "row",
        marginTop: 30,
        fontSize: 14,
        flexWrap: "nowrap",
      }}
    >
      <Text>Signature: _______________________________________</Text>
      <Text style={{ marginLeft: 10 }}>Date: ____________</Text>
    </View>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
  </Page>
);

export default PaymentOptions;
