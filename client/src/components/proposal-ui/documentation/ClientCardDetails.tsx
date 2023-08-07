import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Stack,
  Card,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

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
import { useAppSelector } from "../../../services/store";

export default function ClientCardDetails({
  activeClient,
}: {
  activeClient: ClientObject | undefined;
}) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [clientInfo, setClientInfo] = useState(activeClient);
  const [open, setOpen] = useState(false);
  const { addresses } = useAppSelector((state) => state.addresses);

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
      <Card>
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
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="h6" sx={{ margin: 2 }}>
                Client could not be found. This might be an orphaned proposal?
              </Typography>
            </Stack>
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
                {clientInfo.name}
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
                  <Autocomplete
                    disablePortal
                    id="filters"
                    ListboxProps={{ style: { maxHeight: 150 } }}
                    getOptionLabel={(option) => String(option.zip)}
                    isOptionEqualToValue={(option, value) =>
                      option.zip === value.zip
                    }
                    options={addresses}
                    value={addresses.find(
                      (add) => String(add.zip) === clientInfo.zip
                    )}
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <TextField {...params} label="Zip code" />
                      </div>
                    )}
                    onChange={(_, value) => {
                      setClientInfo({
                        ...clientInfo,
                        zip: String(value?.zip) || "",
                        state: value?.state || "",
                        city: value?.primary_city || "",
                      });
                    }}
                  />
                </>
              )}
              <TextField
                label="City"
                disabled={isDisabled}
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
                disabled={isDisabled}
                onChangeHandler={(value) => {
                  setClientInfo({
                    ...clientInfo,
                    state: value,
                  });
                }}
              />

              <TextField
                label="Phone"
                disabled={isDisabled}
                value={clientInfo.phone}
                onChange={({ target: { value } }) => {
                  setClientInfo({
                    ...clientInfo,
                    phone: value,
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
                {clientInfo.email}
              </TextField>
              <TextField
                label="Account #"
                disabled={isDisabled}
                value={clientInfo.accountNum}
                onChange={({ target: { value } }) => {
                  setClientInfo({
                    ...clientInfo,
                    accountNum: value,
                  });
                }}
              >
                {clientInfo.accountNum}
              </TextField>
            </Stack>
          )}
        </Collapse>
      </Card>
    </>
  );
}
