import { useState } from "react";

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
} from "../../../data-management/store/slices/activeProposalSlice";
import { saveProposal } from "../../../data-management/store/slices/proposalsSlice";
import { ManageProposalSpecifications } from "./specifications/ManageProposalSpecifications";
import { Typography } from "@mui/material";
import { useProposalDetails } from "../../../hooks/useProposalData";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../data-management/store/store";

const ProposalCardDetails = () => {
  const [open, setOpen] = useState(true);
  const [quote_option, setQuoteOption] = useState(0);

  const dispatch = useAppDispatch();
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  const proposalDetails = useProposalDetails(activeProposal);

  if (!activeProposal || !proposalDetails) {
    return <>No active proposal. Cannot show details.</>;
  }
  const quote_options = proposalDetails.quote_options;
  const title = quote_options[quote_option]?.title || "";
  const summary = quote_options[quote_option]?.summary || "";

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
                guid: proposalDetails.guid,
                commission: proposalDetails.commission,
                fees: proposalDetails.fees,
                labor: proposalDetails.labor,
                products: proposalDetails.products,
                unitCostTax: proposalDetails.unitCostTax,
                multiplier: proposalDetails.multiplier,
                quoteOptions: proposalDetails.quote_options,
              })
            }
          >
            Save proposal
          </Button>
        )}
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {quote_options.length > 0 ? (
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
              {quote_options.map((_, index) => {
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
              activeProposal={activeProposal}
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
