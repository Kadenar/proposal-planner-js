import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Stack, Card, TextField } from "@mui/material";

import UndoIcon from "@mui/icons-material/Undo";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { updateStore } from "../../../data-management/store/Dispatcher";
import { updateClients } from "../../../data-management/store/Reducers";
import { saveClient } from "../../../data-management/backend-helpers/InteractWithBackendData.ts";

import { StyledIconButton } from "../../coreui/StyledComponents";
import StateSelection from "../../coreui/StateSelection";

export default function ClientCardDetails({ activeClient }) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [clientInfo, setClientInfo] = useState(activeClient);
  const [open, setOpen] = useState(false);

  if (!clientInfo) {
    return <>Client could not be found. This might be an orphaned proposal?</>;
  }

  const ActionButtons = () => {
    if (!open) {
      return <></>;
    }

    if (isDisabled) {
      return (
        <Tooltip title="Edit client details">
          <IconButton
            tooltip="Edit client details"
            onClick={() => {
              setDisabled((prev) => !prev);
            }}
          >
            <ManageAccountsIcon />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Stack flexDirection="row">
        <Tooltip title="Restore">
          <IconButton
            onClick={async () => {
              setClientInfo(activeClient);
              setDisabled(true);
            }}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save client details">
          <IconButton
            onClick={async () => {
              const response = await updateStore({
                dispatch,
                dbOperation: async () =>
                  saveClient({
                    ...clientInfo,
                    guid: activeClient.guid,
                  }),
                methodToDispatch: updateClients,
                dataKey: "clients",
                successMessage: "Client details were saved successfully.",
              });

              if (response) {
                setDisabled((prev) => !prev);
              }
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  };

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>
        <Stack
          margin={1}
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <StyledIconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ fontWeight: "bold" }}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            Client details
          </StyledIconButton>
          <ActionButtons />
        </Stack>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Stack margin={2} spacing={2}>
            <TextField
              label="Proposal submitted to"
              disabled={isDisabled}
              value={clientInfo.name}
              onChange={({ target: { value } }) => {
                setClientInfo((prev) => {
                  return {
                    ...prev,
                    name: value,
                  };
                });
              }}
            >
              {activeClient.name}
            </TextField>
            {isDisabled ? (
              <TextField
                label="Address"
                disabled={true}
                defaultValue={`${clientInfo?.address} ${clientInfo?.apt} ${clientInfo?.city} ${clientInfo?.state} ${clientInfo?.zip}`}
              />
            ) : (
              <>
                <TextField
                  label="Address"
                  value={clientInfo.address}
                  onChange={({ target: { value } }) => {
                    setClientInfo((prev) => {
                      return {
                        ...prev,
                        address: value,
                      };
                    });
                  }}
                />
                <TextField
                  label="Apt, Suite, etc (optional)"
                  value={clientInfo.apt}
                  onChange={({ target: { value } }) => {
                    setClientInfo((prev) => {
                      return {
                        ...prev,
                        apt: value,
                      };
                    });
                  }}
                />
                <TextField
                  label="City"
                  value={clientInfo.city}
                  onChange={({ target: { value } }) => {
                    setClientInfo((prev) => {
                      return {
                        ...prev,
                        city: value,
                      };
                    });
                  }}
                />
                <StateSelection
                  initialValue={clientInfo.state}
                  onChangeHandler={(value) => {
                    setClientInfo((prev) => {
                      return {
                        ...prev,
                        state: value,
                      };
                    });
                  }}
                />
                <TextField
                  label="Zip code"
                  value={clientInfo.zip}
                  onChange={({ target: { value } }) => {
                    setClientInfo((prev) => {
                      return {
                        ...prev,
                        zip: value,
                      };
                    });
                  }}
                />
              </>
            )}
            <TextField
              label="Phone"
              disabled={isDisabled}
              value={clientInfo.phone}
              onChange={({ target: { value } }) => {
                setClientInfo((prev) => {
                  return {
                    ...prev,
                    state: value,
                  };
                });
              }}
            />
            <TextField
              label="Email"
              disabled={isDisabled}
              value={clientInfo.email}
              onChange={({ target: { value } }) => {
                setClientInfo((prev) => {
                  return {
                    ...prev,
                    email: value,
                  };
                });
              }}
            >
              {activeClient.email}
            </TextField>
            <TextField
              label="Account #"
              disabled={isDisabled}
              value={clientInfo.accountNum}
              onChange={({ target: { value } }) => {
                setClientInfo((prev) => {
                  return {
                    ...prev,
                    state: value,
                  };
                });
              }}
            >
              {activeClient.accountNum}
            </TextField>
          </Stack>
        </Collapse>
      </Card>
    </>
  );
}
