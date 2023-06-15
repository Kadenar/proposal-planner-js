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

import { StyledIconButton } from "../../StyledComponents";
import StateSelection from "../../StateSelection";
import { saveClient } from "../../../services/slices/clientsSlice";
import { ClientObject } from "../../../middleware/Interfaces";

export default function ClientCardDetails({
  activeClient,
}: {
  activeClient: ClientObject | undefined;
}) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [clientInfo, setClientInfo] = useState(activeClient);
  const [open, setOpen] = useState(false);

  if (!activeClient) {
    return (
      <>
        Client details could not be found. This might be an orphaned proposal?
      </>
    );
  }

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
                  setClientInfo({
                    ...clientInfo,
                    name: value,
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
                      setClientInfo({
                        ...clientInfo,
                        address: value,
                      });
                    }}
                  />
                  <TextField
                    label="Apt, Suite, etc (optional)"
                    value={clientInfo.apt}
                    onChange={({ target: { value } }) => {
                      setClientInfo({
                        ...clientInfo,
                        apt: value,
                      });
                    }}
                  />
                  <TextField
                    label="City"
                    value={clientInfo.city}
                    onChange={({ target: { value } }) => {
                      setClientInfo({
                        ...clientInfo,
                        city: value,
                      });
                    }}
                  />
                  <StateSelection
                    initialValue={clientInfo.state}
                    onChangeHandler={(value) => {
                      setClientInfo({
                        ...clientInfo,
                        state: value,
                      });
                    }}
                  />
                  <TextField
                    label="Zip code"
                    value={clientInfo.zip}
                    onChange={({ target: { value } }) => {
                      setClientInfo({
                        ...clientInfo,
                        zip: value,
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
                  setClientInfo({
                    ...clientInfo,
                    state: value,
                  });
                }}
              />
              <TextField
                label="Email"
                disabled={isDisabled}
                value={clientInfo.email}
                onChange={({ target: { value } }) => {
                  setClientInfo({
                    ...clientInfo,
                    email: value,
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
                  setClientInfo({
                    ...clientInfo,
                    state: value,
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
