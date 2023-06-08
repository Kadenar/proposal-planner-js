import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

// TODO Placeholder
export default function JobsPage() {
  return (
    <Stack className="landing-page">
      <h1>Jobs</h1>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Item>In-progress jobs</Item>
        <Item>Completed jobs</Item>
      </Stack>
    </Stack>
  );
}
