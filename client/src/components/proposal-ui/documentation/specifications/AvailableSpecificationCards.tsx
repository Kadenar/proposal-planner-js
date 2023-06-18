import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

export const AvailableSpecificationCard = ({
  index,
  text,
  isChecked,
  handleSelect,
}: {
  index: number;
  text: string;
  isChecked: boolean;
  handleSelect: (checked: boolean) => void;
}) => {
  return (
    <Stack
      borderTop={index === 0 ? "1px solid white" : ""}
      borderBottom="1px solid white"
      direction="row"
      padding="15px 0 15px 0"
      margin="5px 0 5px 0"
      alignItems="center"
      spacing={2}
    >
      <Checkbox
        checked={isChecked}
        onChange={({ target: { checked } }) => {
          handleSelect(checked);
        }}
      />
      <Typography variant="body1">{text}</Typography>
    </Stack>
  );
};
