import { Text, View, StyleSheet, Page } from "@react-pdf/renderer";
import { PdfInvoice } from "../../../../middleware/Interfaces";
import { ccyFormat } from "../../../../lib/pricing-utils";

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
  option_category: {
    fontFamily: "Times-BoldItalic",
    textDecoration: "underline",
    fontSize: 12,
  },
  option_prefix: {
    borderBottom: "1px solid black",
    paddingBottom: 1,
    marginRight: 5,
  },
});

const PaymentOptions = ({ invoice }: { invoice: PdfInvoice }) => (
  <Page key={"payment-options"} style={styles.body}>
    <View key={"payment-options-view"} style={styles.proposal_view}>
      <Text style={styles.small_text}>
        <Text style={styles.text_bolded}>Payment can be made as follows: </Text>
        <Text style={styles.text_italics}>
          (with customer credit check approval)
        </Text>
      </Text>
      <Text style={{ fontFamily: "Times-Italic", fontSize: 10 }}>
        Please initial the payment plan option you would like to proceed with.
      </Text>
      <View style={{ marginTop: 5 }}>
        {Object.keys(invoice.financingOptions).map((provider, index) => {
          return (
            <View
              key={`financing-options-${index}`}
              style={{ marginTop: 10, gap: 10 }}
            >
              <Text style={styles.option_category}>
                {provider} - Financing Options
              </Text>
              {invoice.financingOptions[provider].map((option, index) => {
                return (
                  <Text
                    key={`${option.name}-financing-options-${index}`}
                    style={styles.small_text}
                  >
                    <Text style={styles.option_prefix}>
                      Option # {index + 1}
                    </Text>
                    <Text>
                      {" "}
                      - {option.name} - Total ={" "}
                      {ccyFormat(option.costPerMonth || 0)} per month
                    </Text>
                    <Text>______ Initial</Text>
                  </Text>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={{ gap: 10, marginTop: 20, fontSize: 11 }}>
        <Text>
          ** There's no prepayment penalty on any of the financing options.
        </Text>
        <Text style={{ fontFamily: "Times-BoldItalic" }}>
          *Financing is through Synchrony Financial or National Energy
          Improvement Fund with customer credit approval
        </Text>
        <Text style={styles.option_category}>Credit card or Check Payment</Text>
        <Text>
          50% down payment and 50% due day of installation (with customer credit
          check approval) ______ Initial
        </Text>
        <Text>
          Visa, Master Card, American Express, Discover or Personal Check
        </Text>
      </View>
    </View>

    <View
      style={{
        fontSize: 10,
        marginTop: 10,
        flexDirection: "row",
        gap: 15,
      }}
    >
      <View style={{ width: "50%" }}>
        <Text style={{ fontSize: 6, marginBottom: 10 }}>
          All material is warranted to be as specified. All work to be completed
          in a workmanlike manner. Any alteration or deviation from above
          specifications involving extra costs found during or after
          installation will become an extra charge over and above the estimate.
          These may include extra code requirements, asbestos abatement, fire
          rated sheetrock, & fresh air ducts, etc. Robison is not responsible
          for any faulty piping, water or steam leak, oil lines, poor draft, or
          electrical wiring, etc. which may hinder the proper performance of the
          equipment being installed. Robison is not responsible for delays
          beyond its control. Homeowner to carry homeowner's insurance (fire,
          etc). All workmen will have workmen's' comp and public liability
          insurance.
        </Text>
      </View>
      <View style={{ width: "50%", gap: 10 }}>
        <Text>Authorized Signature: ________________________ </Text>
        <Text style={{ fontSize: 8 }}>
          Note: This proposal may be withdrawn by Robison if not accepted within
          30 days and is contingent upon managers approval.
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text>Approved: ______________</Text>
          <Text>Date: ______________</Text>
        </View>
      </View>
    </View>
    <Text style={{ fontSize: 10 }}>
      <Text style={styles.text_bolded}>Acceptance of Proposal: </Text>
      <Text>
        The above prices, specifications and conditions are satisfactory and are
        hereby accepted. Robison is authorized to do the work. Payment will be
        made as outlined above. To the extent that the price is being reduced by
        anticipated rebates, the customer will be responsible for the full price
        in the event rebate application is denied for any reason. Robison will
        make reasonable efforts to resubmit documents to remediate denial and
        will be in communication with homeowner throughout, including
        authorization to commence, choose alternate equipment or full
        cancellation option.
      </Text>
    </Text>
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
      render={({ pageNumber, totalPages }) => `${2} / ${2}`}
      fixed
    />
  </Page>
);

export default PaymentOptions;
