import ProposalDefinition from "../Proposals/ProposalDefinition";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Tab, { tabClasses } from '@mui/base/Tab';
import { buttonClasses } from '@mui/base/Button';
import { emphasize, styled } from '@mui/material/styles';
import Tabs from '@mui/base/Tabs';
import TabsList from '@mui/base/TabsList';
import TabPanel from '@mui/base/TabPanel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { updateSelectedProposal } from "../../reducers/rootReducers";
import { Stack } from "@mui/material";


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

export default function ProposalDefinitionWrapper() {
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const dispatch = useDispatch();
 
  // Handle navigating back to the main table of proposals
  function navigateBackToAllProposalsTable(event) {
    event.preventDefault();
    dispatch(updateSelectedProposal(''));
  }

  return <div className="proposals">
            <Stack gap="20px" direction="row" width="100%">
            <Breadcrumbs aria-label="breadcrumb">
            <div onClick={navigateBackToAllProposalsTable}>
                <StyledBreadcrumb
                component="a"
                label="Home"
                icon={<HomeIcon fontSize="small" />}
                />
                </div>
                <StyledBreadcrumb component="a" label={selectedProposal} />
            </Breadcrumbs>
            </Stack>
            <Tabs defaultValue={0}>
                <StyledTabsList>
                <StyledTab value={0}>Costs</StyledTab>
                <StyledTab value={1}>Documentation</StyledTab>
                </StyledTabsList>
                <StyledTabPanel value={0}><ProposalDefinition /></StyledTabPanel>
                <StyledTabPanel value={1}>Documentation page</StyledTabPanel>
            </Tabs>
            
        </div>
}

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const StyledTab = styled(Tab)`
  font-family: IBM Plex Sans, sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(TabPanel)(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  padding: 20px 12px;
  background: ${theme.palette.mode === 'dark' ? 'grey[900]' : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  border-radius: 12px;
  `,
);

const StyledTabsList = styled(TabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 0px 5px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
  `,
);
