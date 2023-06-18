import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import FeedIcon from "@mui/icons-material/Feed";
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
    <Breadcrumbs
      separator={
        <NavigateNextIcon
          sx={{ marginBottom: "12px" }}
          fontSize="large"
          aria-label="breadcrumb"
        />
      }
    >
      <StyledBreadcrumb
        label={initialBreadCrumbTitle}
        icon={<FeedIcon fontSize="small" />}
        sx={{ cursor: "pointer", padding: 2 }}
        onClick={(e) => {
          e.preventDefault();
          navigateBackFunc();
        }}
      />
      <StyledBreadcrumb label={breadcrumbName} sx={{ padding: 2 }} />
    </Breadcrumbs>
  );
};

export default BreadcrumbNavigation;
