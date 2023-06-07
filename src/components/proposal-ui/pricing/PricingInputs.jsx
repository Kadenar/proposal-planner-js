import { useSelector, useDispatch } from "react-redux";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import {
  setProposalCommission,
  setProposalMultiplier,
  setProposalUnitCostTax,
} from "../../../data-management/store/slices/selectedProposalSlice";

// This class is responsible for allowing configuring all of the editable fields for a given proposal such as:
// Commissions, unit cost tax and multiplier

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
