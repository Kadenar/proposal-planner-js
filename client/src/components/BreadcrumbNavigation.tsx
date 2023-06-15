import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import FeedIcon from "@mui/icons-material/Feed";
import { Stack } from "@mui/material";
import { StyledBreadcrumb } from "./StyledComponents";

const BreadcrumbNavigation = ({
  navigateBackFunc,
  initialBreadCrumbTitle,
  breadcrumbName,
}: {
  navigateBackFunc: () => void;
  initialBreadCrumbTitle: string;
  breadcrumbName: string;
}) => {
  return (
    <Stack direction="row" width="100%">
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            sx={{ paddingBottom: 1 }}
            fontSize="large"
            aria-label="breadcrumb"
          />
        }
        sx={{}}
      >
        <StyledBreadcrumb
          label={initialBreadCrumbTitle}
          icon={<FeedIcon fontSize="small" />}
          sx={{ cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            navigateBackFunc();
          }}
        />
        <StyledBreadcrumb label={breadcrumbName} />
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadcrumbNavigation;
