import { useState } from "react";
import { useAppDispatch } from "../../../services/store";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { StyledTextarea, StyledIconButton } from "../../StyledComponents";
import {
  setProposalSummary,
  setProposalTitle,
} from "../../../services/slices/activeProposalSlice";
import { ManageProposalSpecifications } from "./specifications/ManageProposalSpecifications";
import { Typography } from "@mui/material";
import { ProposalObject } from "../../../middleware/Interfaces";
import QuoteSelection from "../../QuoteSelection";

const ProposalCardDetails = ({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) => {
  const [open, setOpen] = useState(true);
  const [quote_option, setQuoteOption] = useState(0);

  const dispatch = useAppDispatch();

  const quote_options = activeProposal.data.quote_options;
  const selectedQuoteOption = quote_options
    ? quote_options[quote_option]
    : undefined;
  const title = selectedQuoteOption ? selectedQuoteOption.title : "";
  const summary = selectedQuoteOption ? selectedQuoteOption.summary : "";

  return (
    <Card sx={{ marginBottom: 2 }}>
      <Stack
        flexDirection="row"
        padding={1}
        margin={1}
        justifyContent="space-between"
      >
        <StyledIconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
          style={{ fontWeight: "bold" }}
        >
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          Proposal specifications
        </StyledIconButton>
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {
          // Can only show specifications if products have been added and there are quotes available
          quote_options && quote_options.length > 0 ? (
            <Stack gap={2} marginLeft={2} marginRight={2}>
              <QuoteSelection
                initialValue={quote_option}
                quoteOptions={quote_options}
                onChangeCallback={(value) => {
                  setQuoteOption(value);
                }}
              />
              <TextField
                sx={{ flexGrow: 1 }}
                label="Proposal title"
                value={title}
                onChange={({ target: { value } }) => {
                  setProposalTitle(dispatch, value, quote_option);
                }}
              />
              <StyledTextarea
                placeholder="Enter a brief summary"
                title={summary}
                onChange={({ target: { value } }) => {
                  setProposalSummary(dispatch, value, quote_option);
                }}
                sx={{ flexGrow: 1 }}
                minRows={4}
                maxRows={4}
                value={summary}
              />
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
      </Collapse>
    </Card>
  );
};

export default ProposalCardDetails;
