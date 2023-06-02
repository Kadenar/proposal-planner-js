import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Stack, Button, Slider, Typography, Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";

import {
  updateCommissions,
  updateMultipliers,
} from "../../data-management/Reducers";
import {
  deleteCommission,
  deleteMultiplier,
} from "../../data-management/InteractWithBackendData.ts";
import AddNewItem from "../coreui/AddNewItem";
import { addScalarValueDialog } from "../coreui/dialogs/AddScalarValueDialog";

export default function CommissionMultipliers() {
  const commissions = useSelector((state) => state.commissions);
  const multipliers = useSelector((state) => state.multipliers);

  const dispatch = useDispatch();

  const handleCommissionDelete = async (value) => {
    const commissions = await deleteCommission(value);
    dispatch(updateCommissions(commissions.data.commissions));
  };

  const handleMultiplierDelete = async (value) => {
    const multipliers = await deleteMultiplier(value);
    dispatch(updateMultipliers(multipliers.data.multipliers));
  };

  return (
    <Box>
      {constructCard({
        heading: "Commissions",
        source: commissions,
        marks: commissionMarks,
        min: 5,
        max: 10,
        step: 0.5,
        addNewFunc: () => {
          addScalarValueDialog({
            header: "Add a commission",
            value: "",
            onSubmit: () => {},
            validate: () => {},
          });
        },
        deleteFunc: handleCommissionDelete,
      })}
      {constructCard({
        heading: "Multipliers",
        source: multipliers,
        marks: multiplierMarks,
        min: 1,
        max: 2,
        step: 0.1,
        addNewFunc: () => {
          addScalarValueDialog({
            header: "Add a multiplier",
            value: "",
            onSubmit: () => {},
            validate: () => {},
          });
        },
        deleteFunc: handleMultiplierDelete,
      })}
    </Box>
  );
}

function constructCard({
  heading = "",
  source = [],
  marks = [],
  min = 0,
  max = 10,
  step = 1,
  addNewFunc = () => {},
  deleteFunc = () => {},
}) {
  return (
    <Card sx={{ marginTop: 1, marginBottom: 2 }}>
      <Stack margin={2} spacing={1} direction="row">
        <Typography
          sx={{ marginLeft: 2, marginBottom: 1 }}
          variant="h5"
          color="text.secondary"
          flexGrow={1}
        >
          {heading}
        </Typography>
        <AddNewItem onClick={addNewFunc} />
      </Stack>

      <Grid marginLeft={1} marginBottom={2} container spacing={2}>
        {source.map((entry) => {
          console.log(entry.value);
          return (
            <>
              <Grid xs={8}>
                <Slider
                  value={entry.value}
                  min={min}
                  step={step}
                  max={max}
                  valueLabelFormat={`${entry.value}`}
                  onChange={() => {}}
                  valueLabelDisplay="auto"
                  aria-labelledby="non-linear-slider"
                  marks={marks}
                />
                {/* <Item value={entry.value}>{entry.value}</Item> */}
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    confirmDialog({
                      message:
                        "Do you really want to delete this? This action cannot be undone.",
                      onSubmit: () => {
                        deleteFunc(entry.value);
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Card>
  );
}

const multiplierMarks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 1.1,
    label: "1.1",
  },
  {
    value: 1.2,
    label: "1.2",
  },
  {
    value: 1.3,
    label: "1.3",
  },
  {
    value: 1.4,
    label: "1.4",
  },
  {
    value: 1.5,
    label: "1.5",
  },
  {
    value: 1.6,
    label: "1.6",
  },
  {
    value: 1.7,
    label: "1.7",
  },
  {
    value: 1.8,
    label: "1.8",
  },
];

const commissionMarks = [
  {
    value: 5.0,
    label: "5",
  },
  {
    value: 5.5,
    label: "5.5",
  },
  {
    value: 6.0,
    label: "6",
  },
  {
    value: 6.5,
    label: "6.5",
  },
  {
    value: 7.0,
    label: "7",
  },
  {
    value: 7.5,
    label: "7.5",
  },
  {
    value: 8.0,
    label: "8",
  },
  {
    value: 8.5,
    label: "8.5",
  },
  {
    value: 9.0,
    label: "9",
  },
  {
    value: 9.5,
    label: "9.5",
  },
  {
    value: 10.0,
    label: "10",
  },
];
