import { Box, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../services/store";
import { Link } from "react-router-dom";
import { addNewTab, deleteTab, setTabIndex } from "../services/slices/tabSlice";
import AllProductsView from "../views/database/AllProductsView";
import ClientsPage from "../pages/ClientsPage";
import ContactsView from "../views/ContactsView";
import FinancingOptionsView from "../views/database/FinancingOptionsView";
import LaborAndFeesView from "../views/database/LaborAndFeesView";
import MarkupsPage from "../pages/MarkupsPage";
import AllProductTypesView from "../views/database/AllProductTypesView";
import ProposalsPage from "../pages/ProposalsPage";
import TemplatesPage from "../pages/TemplatesPage";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const getElementFromPath = (path: string) => {
  if (path === "clients") {
    return <ClientsPage />;
  }

  if (path === "contacts") {
    return <ContactsView />;
  }

  if (path === "financing") {
    return <FinancingOptionsView />;
  }

  if (path === "labor_fees") {
    return <LaborAndFeesView />;
  }

  if (path === "markups") {
    return <MarkupsPage />;
  }

  if (path === "products") {
    return <AllProductsView />;
  }

  if (path === "product/types") {
    return <AllProductTypesView />;
  }

  if (path === "proposals" || path === "/") {
    return <ProposalsPage />;
  }

  if (path === "templates") {
    return <TemplatesPage />;
  }

  return (
    <Stack alignItems={"center"}>
      <h2>404 Page not found</h2>
    </Stack>
  );
};
const TabContainer = () => {
  const dispatch = useAppDispatch();
  const { tabs, activeTab } = useAppSelector((state) => state.tabs);

  return (
    <>
      <Stack direction="row">
        <Tabs
          value={activeTab}
          onChange={(_, index) => setTabIndex(dispatch, index)}
        >
          {tabs.map((tab) => {
            return (
              <Tab
                label={
                  <span>
                    {tab.title}
                    {tab.editable && (
                      <IconButton
                        size="small"
                        component="span"
                        onClick={() => {
                          setTabIndex(dispatch, 0);
                          deleteTab(dispatch, tab.guid);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </span>
                }
                component={Link}
                to={tab.path}
              />
            );
          })}
        </Tabs>
        <IconButton
          onClick={() => {
            addNewTab(dispatch);
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      {tabs.map((tab, index) => {
        return (
          <CustomTabPanel index={index} value={activeTab}>
            {getElementFromPath(tab.path)}
          </CustomTabPanel>
        );
      })}
    </>
  );
};

export default TabContainer;
