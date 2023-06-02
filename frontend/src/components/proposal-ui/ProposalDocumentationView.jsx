import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Stack, Card, TextField } from "@mui/material";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Image,
  Font,
  PDFViewer,
  View,
} from "@react-pdf/renderer";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveIcon from "@mui/icons-material/Save";

import { updateStore } from "../../data-management/Dispatcher";
import { updateClients } from "../../data-management/Reducers";
import { saveClient } from "../../data-management/InteractWithBackendData.ts";

import StateSelection from "../coreui/StateSelection";

export default function ProposalDocumentationView() {
  const dispatch = useDispatch();
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const allClients = useSelector((state) => state.allClients);

  const clientAddressRef = useRef();
  const clientAptRef = useRef();
  const clientCityRef = useRef();
  const clientStateRef = useRef();
  const clientZipRef = useRef();
  const clientPhoneRef = useRef();
  const clientEmailRef = useRef();
  const clientAccountNumRef = useRef();

  const [isDisabled, setDisabled] = useState(true);

  const activeClient = allClients.find((client) => {
    return client.name === selectedProposal.client;
  });

  if (!activeClient) {
    return <>Failed to load information from client!</>;
  }

  const fullAddress = `${activeClient.address} ${activeClient.apt} ${activeClient.city} ${activeClient.state} ${activeClient.zip}`;

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>
        <Stack margin={1} spacing={2} direction="row" justifyContent="flex-end">
          {isDisabled ? (
            <ManageAccountsIcon
              onClick={() => {
                setDisabled((prev) => !prev);
              }}
            />
          ) : (
            <SaveIcon
              onClick={async () => {
                const response = await updateStore({
                  dispatch,
                  dbOperation: async () => {
                    saveClient({
                      guid: activeClient.guid,
                      name: activeClient.name,
                      address: activeClient.address,
                      apt: activeClient.apt,
                      city: activeClient.city,
                      state: activeClient.state,
                      zip: activeClient.zip,
                      phone: clientPhoneRef.current.value,
                      email: clientEmailRef.current.value,
                      accountNum: clientAccountNumRef.current.value,
                    });
                  },
                  methodToDispatch: updateClients,
                  dataKey: "guid",
                  successMessage: "Updated client details.",
                });
                if (response) {
                  setDisabled((prev) => !prev);
                }
              }}
            />
          )}
        </Stack>

        <Stack margin={2} spacing={2}>
          <TextField
            label="Proposal submitted to"
            disabled={true}
            defaultValue={activeClient.name}
          >
            {activeClient.name}
          </TextField>
          {isDisabled ? (
            <TextField
              label="Address"
              disabled={true}
              defaultValue={fullAddress}
            />
          ) : (
            <>
              <TextField
                ref={clientAddressRef}
                label="Address"
                defaultValue={activeClient.address}
              />
              <TextField
                ref={clientAptRef}
                label="Apt, Suite, etc (optional)"
                defaultValue={activeClient.apt}
              />
              <TextField
                ref={clientCityRef}
                label="City"
                defaultValue={activeClient.city}
              />
              <StateSelection
                ref={clientStateRef}
                initialValue={activeClient.state}
                onChangeHandler={(value) => {
                  clientStateRef.current.value = value;
                }}
              />
              <TextField
                ref={clientZipRef}
                label="Zip code"
                defaultValue={activeClient.zip}
              />
            </>
          )}
          <TextField
            ref={clientPhoneRef}
            label="Phone"
            disabled={isDisabled}
            defaultValue={activeClient.phone}
            onChange={(e) => {
              clientPhoneRef.current.value = e.target.value;
            }}
          />
          <TextField
            ref={clientEmailRef}
            label="Email"
            disabled={isDisabled}
            defaultValue={activeClient.email}
            onChange={(e) => {
              clientEmailRef.current.value = e.target.value;
            }}
          >
            {activeClient.email}
          </TextField>
          <TextField
            ref={clientAccountNumRef}
            label="Account #"
            disabled={isDisabled}
            defaultValue={activeClient.accountNum}
            onChange={(e) => {
              clientAccountNumRef.current.value = e.target.value;
            }}
          >
            {activeClient.accountNum}
          </TextField>
        </Stack>
      </Card>
      <PDFViewer fullWidth style={{ minHeight: "80vh", minWidth: "93vw" }}>
        <MyDocument data={selectedProposal} />
      </PDFViewer>
    </>
  );
}

const styles = StyleSheet.create({
  robison_title: {},
  robison_icon: {
    position: "absolute",
  },
  robison_address: {
    textAlign: "right",
    fontSize: 12,
    flexDirection: "row",
  },
  proposal_bar: {
    backgroundColor: "black",
    color: "white",
    padding: 5,
    fontSize: 13,
    height: "25px",
  },
  proposal_view: {
    border: "1px solid black",
    padding: 5,
  },
  small_text: {
    fontSize: 10,
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
  },
  text_bolded: {
    fontFamily: "Times-Bold",
  },
  text_bold_underlined: {
    fontFamily: "Times-Bold",
    textDecoration: "underline",
  },
  text_italics: {
    fontFamily: "Times-Italic",
  },
  proposal_body: {
    padding: 12,
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  text: {
    padding: 12,
    margin: 5,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
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

const MyDocument = ({ data }) => {
  return (
    <Document>
      <Page style={styles.body}>
        {/* <Image style={styles.robison_icon} src="/resources/robison_oil.png" /> */}
        <Text style={styles.title}>Robison Oil</Text>
        <View style={styles.robison_address}>
          <Text>One Gatway Plaza, 4th Flr</Text>
          <Text>Port Chester, NY 10573</Text>
          <Text>(914)-345-5700</Text>
          <Text>Fax (914)-345-5783</Text>
        </View>

        <Text style={styles.proposal_bar}>Proposal</Text>

        <View style={styles.proposal_view}>
          <Text style={styles.proposal_body}>
            <Text style={styles.small_text}>
              We hereby submit specifications and estimate for:
            </Text>
          </Text>
        </View>

        <Text style={{ marginTop: 15, fontSize: 10, fontFamily: "Times-Bold" }}>
          Robison will provide material and labor for the above specifications
          for the sum of:
          <Text style={styles.text_bold_underlined}> $17,000</Text>
        </Text>
      </Page>

      <Page style={styles.body}>
        <View style={styles.proposal_view}>
          <Text style={styles.small_text}>
            <Text style={styles.text_bolded}>
              Payment can be made as follows:
            </Text>
            <Text style={styles.text_italics}>
              (with customer credit check approval)
            </Text>
          </Text>

          <View style={{ gap: 20 }}>
            <Text style={{ fontFamily: "Times-Italic", fontSize: 10 }}>
              Please initial the payment plan option you would like to proceed
              with.
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 1</Text> - No
              Money Down - 0 Interest for 18 months ______ Initial
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 2</Text> - No
              Money Down - 5.99% Interest for 37 months ______ Initial
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 3</Text> - No
              Money Down - 7.99% Interest for 61 months ______ Initial
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 4</Text> - No
              Money Down - 9.99% Interest for 132 Months ______ Initial
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 5</Text> - 50%
              down payment & 50% due day of installation (with customer credit
              check approval) ______ Initial
            </Text>
            <Text style={styles.small_text}>
              <Text style={styles.text_bold_underlined}>Option # 6</Text> - 80%
              down payment & 20% due day of installation (with customer credit
              check approval) ______ Initial
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

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 6, width: "50%", marginBottom: 10 }}>
            All material is warranted to be as specified. All work to be
            completed in a workmanlike manner. Any alteration or deivation from
            above specifications involving extra costs found during or after
            installation will become an extra charge over and above the
            estimate. These may include extra code requirements, asbestos
            abatement, fire rated sheetrock, & fresh air ducts, etc. Robison is
            not responsible for any faulty piping, water or steam leak, oil
            lines, poor draft, or electrical wiring, etc. which may hinder the
            proper performance of the equipment being installed. Robison is not
            responsible for delays beyond its control. Homeowner to carry
            homeowner's insurance (fire, etc). All workmen will have workmen's'
            comp and public liability insurance.
          </Text>
          <Text style={{ fontSize: 11 }}>
            <Text style={styles.text_bolded}>Acceptance of Proposal: </Text>
            <Text>
              The above prices, specifications and conditions are satisfactory
              and are hereby accepted. Robison is authorized to do the work.
              Payment will be made as outlined above. To the extend that the
              price is being reduced by anticipated rebates, the customer will
              be responsible for the full price in the event rebate application
              is denied for any reason. Robison will make reasonable efforts to
              resubmit documents to remediate denial and will be in
              communication with homeowner throughout, including authorization
              to commence, choose alternate equipment or full cancellation
              option.
            </Text>
          </Text>
          <Text style={{ marginTop: 30, fontSize: 14, flexWrap: "nowrap" }}>
            Signature: _______________________________________Date: ____________
          </Text>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});
