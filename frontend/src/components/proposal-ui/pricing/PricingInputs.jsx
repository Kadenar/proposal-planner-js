import React from "react";
import { useSelector, useDispatch } from "react-redux";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import {
  setProposalCommission,
  setProposalFeeCosts,
  setProposalLaborCosts,
  setProposalLaborQuantity,
  setProposalMultiplier,
  setProposalUnitCostTax,
} from "../../../data-management/store/slices/selectedProposalSlice";

// This class is responsible for allowing configuring all of the editable fields for a given proposal such as:
// Fees, commissions, unit cost tax, labor, etc

export function ConfigureFees() {
  const dispatch = useDispatch();
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const fees = selectedProposal.data.fees;

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
              onChange={(e) =>
                setProposalFeeCosts(dispatch, {
                  key: fee,
                  value: e.target?.value || 0,
                })
              }
              type="number"
            />
          );
        })}
      </Stack>
    </div>
  );
}

export function ConfigureCommission() {
  const dispatch = useDispatch();

  const { commissions } = useSelector((state) => state.commissions);
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const commission = selectedProposal.data.commission;

  return (
    <FormControl>
      <InputLabel id="commission-simple-select-label">Commission</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="commission-select-label"
        id="commission-simple-select"
        value={commission}
        label="Commission"
        onChange={(e) =>
          setProposalCommission(dispatch, { value: e.target?.value || 0 })
        }
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
  const dispatch = useDispatch();

  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const unitCostTax = selectedProposal.data.unitCostTax;

  return (
    <TextField
      id="unit-cost-id"
      label="Unit cost tax"
      variant="outlined"
      value={unitCostTax}
      onChange={(e) =>
        setProposalUnitCostTax(dispatch, { value: e.target?.value || 0 })
      }
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
  const dispatch = useDispatch();
  const { multipliers } = useSelector((state) => state.multipliers);
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const multiplier = selectedProposal.data.multiplier;

  return (
    <FormControl>
      <InputLabel id="multiplier-simple-select-label">Multiplier</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="multiplier-simple-select-label"
        id="multiplier-simple-select"
        value={multiplier}
        label="Multiplier"
        onChange={(e) =>
          setProposalMultiplier(dispatch, { value: e.target?.value || 0 })
        }
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
        id="labor-cost-id"
        label="Quantity"
        variant="outlined"
        value={qty}
        onChange={updateQuantity}
        type="number"
      />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel htmlFor="labor-cost-input-label">{label}</InputLabel>
        <OutlinedInput
          id="labor-cost-input-label"
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
  const dispatch = useDispatch();
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const labor = selectedProposal.data.labor;

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
                setProposalLaborQuantity(dispatch, {
                  key: type,
                  value: e.target.value || 0,
                })
              }
              updateCost={(e) =>
                setProposalLaborCosts(dispatch, {
                  key: type,
                  value: e.target?.value || 0,
                })
              }
            />
          );
        })}
      </Stack>
    </div>
  );
}
