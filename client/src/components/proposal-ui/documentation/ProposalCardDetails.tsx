import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  StyledTextarea,
  StyledIconButton,
} from "../../coreui/StyledComponents";
import {
  setProposalSummary,
  setProposalTitle,
} from "../../../data-management/store/slices/selectedProposalSlice";
import { saveProposal } from "../../../data-management/store/slices/proposalsSlice";
import { ReduxStore } from "../../../data-management/middleware/Interfaces";
import { ManageProposalSpecifications } from "./specifications/ManageProposalSpecifications";
import { Typography } from "@mui/material";

const ProposalCardDetails = () => {
  const dispatch = useDispatch();
  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );

  const quoteOptions = selectedProposal?.data.quote_options;

  const [open, setOpen] = useState(true);
  const [quote_option, setQuoteOption] = useState(0);
  const title = selectedProposal?.data.quote_options[quote_option]?.title || "";
  const summary =
    selectedProposal?.data.quote_options[quote_option]?.summary || "";

  if (!selectedProposal) {
    return <>No selected proposal. Cannot show details.</>;
  }

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
        {open && (
          <Button
            variant="contained"
            onClick={async () =>
              saveProposal(dispatch, {
                guid: selectedProposal.guid,
                commission: selectedProposal.data.commission,
                fees: selectedProposal.data.fees,
                labor: selectedProposal.data.labor,
                products: selectedProposal.data.products,
                unitCostTax: selectedProposal.data.unitCostTax,
                multiplier: selectedProposal.data.multiplier,
                quoteOptions: selectedProposal.data.quote_options,
              })
            }
          >
            Save proposal
          </Button>
        )}
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {quoteOptions && quoteOptions.length > 0 ? (
          <Stack gap={2} marginLeft={2} marginRight={2}>
            <TextField
              id="select"
              label="Quote option"
              value={quote_option}
              onChange={({ target: { value } }) => {
                const newQuoteOption = Number(value);
                setQuoteOption(newQuoteOption);
              }}
              select
            >
              {quoteOptions.map((_, index) => {
                return <MenuItem value={index}>Quote {index + 1}</MenuItem>;
              })}
            </TextField>
            <TextField
              sx={{ flexGrow: 1 }}
              label={"Proposal title"}
              value={title}
              onChange={({ target: { value } }) => {
                setProposalTitle(dispatch, value, quote_option);
              }}
            />
            <StyledTextarea
              placeholder={"Brief summary"}
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
              selectedProposal={selectedProposal}
            />
          </Stack>
        ) : (
          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            alignContent={"center"}
            margin={5}
          >
            <Typography>
              Please add some products to the proposal first
            </Typography>
          </Stack>
        )}
      </Collapse>
    </Card>
  );
};

export default ProposalCardDetails;
