import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import {
  StyledTextarea,
  StyledIconButton,
} from "../../coreui/StyledComponents";
import {
  updateProposalTitle,
  updateProposalSummary,
  updateProposalSpecifications,
  updateProposals,
} from "../../../data-management/store/Reducers";
import { updateStore } from "../../../data-management/store/Dispatcher";
import { saveProposal } from "../../../data-management/backend-helpers/InteractWithBackendData.ts";
import TransferList from "./TransferList";

const ProposalCardDetails = () => {
  const selectedProposal = useSelector((state) => state.selectedProposal);

  const dispatch = useDispatch();

  const titleRef = useRef();
  const briefSummaryRef = useRef();
  const specificationRef = useRef();

  const debouncedSearch = useRef(
    debounce(async (functionToRun) => {
      dispatch(functionToRun());
    }, 1000)
  ).current;

  const [open, setOpen] = useState(true);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  function handleTitleChange(value) {
    titleRef.current.value = value;
    debouncedSearch(() => updateProposalTitle(value));
  }

  function handleSummaryChange(value) {
    briefSummaryRef.current.value = value;
    debouncedSearch(() => updateProposalSummary(value));
  }

  function handleSpecificationChange(value) {
    specificationRef.current.value = value;
    debouncedSearch(() => updateProposalSpecifications(value));
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
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          Proposal specifications
        </StyledIconButton>
        {open && (
          <Button
            variant="contained"
            onClick={async () => {
              updateStore({
                dispatch,
                dbOperation: async () =>
                  saveProposal(
                    selectedProposal.guid,
                    selectedProposal.data.commission,
                    selectedProposal.data.fees,
                    selectedProposal.data.labor,
                    selectedProposal.data.models,
                    selectedProposal.data.unitCostTax,
                    selectedProposal.data.multiplier,
                    selectedProposal.data.title,
                    selectedProposal.data.summary,
                    selectedProposal.data.specifications
                  ),
                methodToDispatch: updateProposals,
                dataKey: "proposals",
                successMessage: "Your proposal has been successfully saved.",
              });
            }}
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
            onChange={({ target: { value } }) => handleTitleChange(value)}
            defaultValue={selectedProposal.data?.title || ""}
          />
          <Stack flexDirection="row" margin={2} gap={2}>
            <StyledTextarea
              placeholder={"Brief summary"}
              ref={briefSummaryRef}
              onChange={({ target: { value } }) => handleSummaryChange(value)}
              sx={{ flexGrow: 1 }}
              minRows={8}
              maxRows={8}
              defaultValue={selectedProposal.data?.summary || ""}
            />
            <StyledTextarea
              placeholder={"Installation details"}
              ref={specificationRef}
              sx={{ flexGrow: 1 }}
              onChange={({ target: { value } }) =>
                handleSpecificationChange(value)
              }
              minRows={8}
              maxRows={8}
              defaultValue={selectedProposal.data?.specifications || ""}
            />
          </Stack>
          <TransferList />
        </Stack>
      </Collapse>
    </Card>
  );
};

export default ProposalCardDetails;
