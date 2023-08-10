import { useState } from "react";
import { useAppDispatch } from "../../../services/store";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

import { StyledTextarea } from "../../StyledComponents";
import {
  setProposalSummary,
  setProposalTitle,
} from "../../../services/slices/activeProposalSlice";
import { Divider, Typography } from "@mui/material";
import { ProposalObject } from "../../../middleware/Interfaces";
import QuoteSelection from "../../QuoteSelection";
import { ManageProposalSpecifications } from "./specifications/ManageProposalSpecifications";

const ProposalCardDetails = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const [quote_option, setQuoteOption] = useState(0);

  const dispatch = useAppDispatch();
  const quote_options = activeProposal.data.quote_options;

  const selectedQuoteOption = quote_options[quote_option];
  const title = selectedQuoteOption?.title || "";
  const summary = selectedQuoteOption?.summary || "";

  return (
    <Stack spacing={2}>
      <QuoteSelection
        value={selectedQuoteOption?.guid}
        quoteOptions={quote_options}
        onChangeCallback={(value) => {
          setQuoteOption(value);
        }}
      />
      <Divider />
      <Card>
        {
          // Can only show specifications if products have been added and there are quotes available
          quote_options && quote_options.length > 0 ? (
            <Stack gap={2} marginTop={2} marginLeft={2} marginRight={2}>
              <TextField
                sx={{ flexGrow: 1 }}
                label="Proposal title"
                placeholder="Enter a title"
                value={title}
                onChange={({ target: { value } }) => {
                  setProposalTitle(dispatch, value, quote_option);
                }}
              />
              <StyledTextarea
                placeholder="Enter a brief summary describing the job"
                title={summary}
                onChange={({ target: { value } }) => {
                  setProposalSummary(dispatch, value, quote_option);
                }}
                sx={{ flexGrow: 1 }}
                minRows={3}
                maxRows={4}
                value={summary}
              />
              <Divider />
              <ManageProposalSpecifications
                quoteOption={Number(quote_option)}
                activeProposal={activeProposal}
              />
            </Stack>
          ) : (
            <Stack
              justifyContent="center"
              alignItems="center"
              alignContent="center"
              margin={5}
            >
              <Typography variant="h6">
                Please add products to this proposal before trying to document
                specifications
              </Typography>
            </Stack>
          )
        }
      </Card>
    </Stack>
  );
};

export default ProposalCardDetails;
