import { Card, Stack, TextField, Typography } from "@mui/material";
import { useAppSelector } from "../services/store";

const MarkupsPage = () => {
  const { equipmentMarkups, laborMarkups, miscMaterialMarkups } =
    useAppSelector((state) => state.multipliers);

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
        <Typography>Miscellaneous materials markup</Typography>
        {miscMaterialMarkups.map((material) => {
          return (
            <TextField
              disabled={true} // TODO ENABLE THIS WHEN ABLE TO EDIT
              label={material.name}
              value={material.value}
            />
          );
        })}
      </Stack>
    </Card>
  );
};

export default MarkupsPage;
