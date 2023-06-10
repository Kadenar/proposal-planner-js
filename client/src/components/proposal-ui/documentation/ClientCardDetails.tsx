import { useState } from "react";
import { useDispatch } from "react-redux";
import { Stack, Card, TextField, Typography } from "@mui/material";

import UndoIcon from "@mui/icons-material/Undo";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { StyledIconButton } from "../../coreui/StyledComponents";
import StateSelection from "../../coreui/StateSelection";
import { saveClient } from "../../../data-management/store/slices/clientsSlice";
import { ClientObject } from "../../../data-management/middleware/Interfaces";

export default function ClientCardDetails({
  activeClient,
}: {
  activeClient: ClientObject;
}) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [clientInfo, setClientInfo] = useState(activeClient);
  const [open, setOpen] = useState(false);

  const ActionButtons = () => {
    if (!open) {
      return <></>;
    }

    if (isDisabled) {
      return (
        <Tooltip title="Edit client details">
          <IconButton
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
              if (!clientInfo) {
                return;
              }

              const response = await saveClient(dispatch, clientInfo);

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

  if (!activeClient) {
    return <>There is no active client selected! No details to show</>;
  }

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
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            Client details
          </StyledIconButton>
          {clientInfo && <ActionButtons />}
        </Stack>
        <Collapse in={open || !clientInfo} timeout="auto" unmountOnExit>
          {!clientInfo ? (
            <Typography sx={{ margin: 2 }}>
              Client could not be found. This might be an orphaned proposal?
            </Typography>
          ) : (
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
          )}
        </Collapse>
      </Card>
    </>
  );
}
