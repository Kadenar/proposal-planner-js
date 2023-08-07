import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../services/store";

import MaterialTable from "@material-table/core";

import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { newProposalDialog } from "../../components/dialogs/frontend/NewProposalDialog";

import { updateActiveClient } from "../../services/slices/clientsSlice";
import { selectProposal } from "../../services/slices/activeProposalSlice";
import {
  addProposal,
  copyProposal,
  deleteProposal,
} from "../../services/slices/proposalsSlice";
import { ClientObject } from "../../middleware/Interfaces";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";

const ClientProposalsView = ({
  selectedClient,
}: {
  selectedClient: ClientObject;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { clients } = useAppSelector((state) => state.clients);
  const { proposals } = useAppSelector((state) => state.proposals);
  const { templates } = useAppSelector((state) => state.templates);

  const proposalsForClient = useMemo(() => {
    return proposals.filter(
      (proposal) => selectedClient?.guid === proposal?.owner?.guid
    );
  }, [proposals, selectedClient]);

  const [menuItemInfo, setMenuItemInfo] = useState<{
    anchorEl: HTMLAnchorElement | undefined;
    rowData: any;
  }>({
    anchorEl: undefined,
    rowData: undefined,
  });
  const open = Boolean(menuItemInfo.anchorEl);

  return (
    <Stack gap={2}>
      {
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => {
              newProposalDialog({
                name: "",
                description: "",
                owner: {
                  ...selectedClient,
                },
                clients,
                templates,
                isExistingProposal: false,
                onSubmit: async (name, description, client_guid, template) =>
                  addProposal(dispatch, {
                    name,
                    description,
                    client_guid,
                    template,
                  }),
              });
            }}
          >
            Create a proposal
          </Button>
        </Stack>
      }
      <MaterialTable
        title={`Proposals for ${selectedClient?.name}`}
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Date created", field: "dateCreated" },
          { title: "Date modified", field: "dateModified" },
        ]}
        data={proposalsForClient.map((proposal) => {
          return {
            id: proposal.guid,
            name: proposal.name,
            owner: proposal.owner,
            description: proposal.description,
            dateCreated: proposal.dateCreated,
            dateModified: proposal.dateModified,
            guid: proposal.guid,
            data: proposal.data,
          };
        })}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 5,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: "pending",
            tooltip: "Actions",
            onClick: (event, rowData) =>
              setMenuItemInfo({
                anchorEl: event.currentTarget,
                rowData,
              }),
          },
        ]}
      />
      <Menu
        anchorEl={menuItemInfo?.anchorEl}
        open={open}
        onClose={() =>
          setMenuItemInfo({
            anchorEl: undefined,
            rowData: undefined,
          })
        }
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            updateActiveClient(dispatch, undefined);
            selectProposal(dispatch, menuItemInfo.rowData);
            navigate("/proposals");
          }}
        >
          Work on proposal
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            if (!menuItemInfo.rowData) {
              return;
            }

            newProposalDialog({
              name: menuItemInfo.rowData.name,
              description: `${menuItemInfo.rowData.description} copy`,
              owner: { ...selectedClient },
              clients,
              isExistingProposal: true,
              onSubmit: (name, description, client_guid) =>
                copyProposal(dispatch, {
                  name,
                  description,
                  client_guid,
                  existing_proposal: menuItemInfo.rowData,
                }),
            });
          }}
        >
          Copy proposal
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            confirmDialog({
              message:
                "Do you really want to delete this? This action cannot be undone.",
              onSubmit: async () =>
                deleteProposal(dispatch, { guid: menuItemInfo.rowData.guid }),
            });
          }}
        >
          Delete proposal
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default ClientProposalsView;
