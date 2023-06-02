import React from "react";

import { updateFee } from "../../data-management/Reducers";
import { useDispatch, useSelector } from "react-redux";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import {
  updateCommission,
  updateUnitCostTax,
  updateMultiplier,
  updateLaborCost,
  updateLaborQuantity,
} from "../../data-management/Reducers";

// This class is responsible for allowing configuring all of the editable fields for a given proposal such as:
// Fees, commissions, unit cost tax, labor, etc

export function ConfigureFees() {
  const fees = useSelector((state) => state.fees);

  const dispatch = useDispatch();

  return (
    <div className="pricing">
      <Stack column="row" gap="20px">
        {Object.keys(fees).map((fee) => {
          return (
            <TextField
              id={`${fees[fee].name + "-input"}`}
              label={fees[fee].name}
              variant="outlined"
              value={fees[fee].cost}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => dispatch(updateFee(fee, e.target.value || 0))}
              type="number"
            />
          );
        })}
      </Stack>
    </div>
  );
}

export function ConfigureCommission() {
  const commissions = useSelector((state) => state.commissions);
  const commission = useSelector((state) => state.commission);
  const dispatch = useDispatch();

  return (
    <FormControl>
      <InputLabel id="commission-simple-select-label">Commission</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="commission-select-label"
        id="commission-simple-select"
        value={commission}
        label="Commission"
        onChange={(e) => dispatch(updateCommission(e.target.value))}
      >
        {commissions.map((commission, index) => {
          return (
            <MenuItem key={index} value={commission.value}>
              {commission.value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export function ConfigureUnitCostTax() {
  const unitCostTax = useSelector((state) => state.unitCostTax);
  const dispatch = useDispatch();

  return (
    <TextField
      id="outlined-basic"
      label="Unit cost tax"
      variant="outlined"
      value={unitCostTax}
      onChange={(e) => dispatch(updateUnitCostTax(e.target.value || 0))}
      type="number"
      style={{ maxWidth: "100px" }}
    />
  );
}

/**
 * Displays a pricing summary based on the priced out job
 * as well as any fees and commissions
 * @returns
 */
export function ConfigureMultiplier() {
  const multipliers = useSelector((state) => state.multipliers);
  const multiplier = useSelector((state) => state.multiplier);
  const dispatch = useDispatch();

  return (
    <FormControl>
      <InputLabel id="multiplier-simple-select-label">Multiplier</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="multiplier-simple-select-label"
        id="multiplier-simple-select"
        value={multiplier}
        label="Multiplier"
        onChange={(e) => dispatch(updateMultiplier(e.target.value))}
      >
        {multipliers.map((multiplier, index) => {
          return (
            <MenuItem key={index} value={multiplier.value}>
              {multiplier.value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

const LaborCostInput = ({ label, qty, cost, updateQuantity, updateCost }) => {
  return (
    <Stack direction="row" gap="20px">
      <TextField
        id="outlined-basic"
        label="Quantity"
        variant="outlined"
        value={qty}
        onChange={updateQuantity}
        type="number"
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          value={cost}
          onChange={updateCost}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label={label}
        />
      </FormControl>
    </Stack>
  );
};

export function ConfigureLabor() {
  const labor = useSelector((state) => state.labor);

  const dispatch = useDispatch();

  return (
    <div className="pricing">
      <Stack gap="20px">
        {Object.keys(labor).map((type) => {
          return (
            <LaborCostInput
              label={labor[type].name}
              qty={labor[type].qty}
              cost={labor[type].cost}
              updateQuantity={(e) =>
                dispatch(updateLaborQuantity(type, e.target.value))
              }
              updateCost={(e) =>
                dispatch(updateLaborCost(type, e.target.value))
              }
            />
          );
        })}
      </Stack>
    </div>
  );
}
