import { Card, Stack, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../services/store";

const MarkupsPage = () => {
  const { equipmentMarkups, laborMarkups } = useAppSelector(
    (state) => state.multipliers
  );

  console.log("labor", laborMarkups);
  console.log("equipment", equipmentMarkups);

  return (
    <Card sx={{ padding: 3, marginTop: 1, marginBottom: 2 }}>
      <Stack gap={2}>
        <Typography>Labor markup</Typography>
        {laborMarkups.map((labor) => {
          return (
            <TextField
              disabled={true} // TODO ENABLE THIS WHEN ABLE TO EDIT
              label={labor.name}
              value={labor.value}
            />
          );
        })}
        <Typography>Equipment markup</Typography>
        {equipmentMarkups.map((equipment) => {
          return (
            <TextField
              disabled={true} // TODO ENABLE THIS WHEN ABLE TO EDIT
              label={equipment.name}
              value={equipment.value}
            />
          );
        })}
      </Stack>
    </Card>
  );
};

export default MarkupsPage;
