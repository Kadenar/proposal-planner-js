import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";

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

const ProposalCardDetails = () => {
  const dispatch = useDispatch();
  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );
  const titleRef = useRef<HTMLInputElement>(null);
  const briefSummaryRef = useRef<HTMLTextAreaElement>(null);

  const debouncedSearch = useRef(
    debounce(async (functionToRun) => functionToRun(), 300)
  ).current;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  if (!selectedProposal) {
    return <>No selected proposal. Cannot show details.</>;
  }

  return (
    <Card sx={{ marginBottom: 2 }}>
      <Stack flexDirection="row" margin={1} justifyContent="space-between">
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
                title: selectedProposal.data.title,
                summary: selectedProposal.data.summary,
                specifications: selectedProposal.data.specifications,
              })
            }
          >
            Save proposal
          </Button>
        )}
      </Stack>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Stack margin={1} gap={2}>
          <TextField
            ref={titleRef}
            sx={{ marginLeft: 2, flexGrow: 1 }}
            label={"Proposal title"}
            onChange={({ target: { value } }) => {
              if (titleRef.current !== null) {
                titleRef.current.value = value;
                debouncedSearch(() =>
                  setProposalTitle(dispatch, { title: value })
                );
              }
            }}
            defaultValue={selectedProposal.data?.title || ""}
          />
          <Stack flexDirection="row" margin={2} gap={2}>
            <StyledTextarea
              placeholder={"Brief summary"}
              ref={briefSummaryRef}
              onChange={({ target: { value } }) => {
                if (briefSummaryRef.current !== null) {
                  briefSummaryRef.current.value = value;
                  debouncedSearch(() =>
                    setProposalSummary(dispatch, { summary: value })
                  );
                }
              }}
              sx={{ flexGrow: 1 }}
              minRows={4}
              maxRows={4}
              defaultValue={selectedProposal.data?.summary || ""}
            />
          </Stack>
          <ManageProposalSpecifications />
        </Stack>
      </Collapse>
    </Card>
  );
};

export default ProposalCardDetails;
