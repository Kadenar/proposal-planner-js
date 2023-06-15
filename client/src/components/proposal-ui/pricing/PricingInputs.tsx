import { useAppDispatch, useAppSelector } from "../../../services/store";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import {
  setProposalCommission,
  setProposalMultiplier,
  setProposalUnitCostTax,
} from "../../../services/slices/activeProposalSlice";

// This class is responsible for allowing configuring all of the editable fields for a given proposal such as:
// Commissions, unit cost tax and multiplier

export function ConfigureCommission() {
  const dispatch = useAppDispatch();

  const { commissions } = useAppSelector((state) => state.commissions);
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return activeProposal ? (
    <FormControl>
      <InputLabel id="commission-simple-select-label">Commission</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="commission-select-label"
        id="commission-simple-select"
        value={activeProposal.data.commission}
        label="Commission"
        onChange={(e) =>
          setProposalCommission(dispatch, Number(e.target?.value) || 0)
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
  ) : (
    <></>
  );
}

export function ConfigureUnitCostTax() {
  const dispatch = useAppDispatch();

  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return activeProposal ? (
    <TextField
      id="unit-cost-id"
      label="Unit cost tax"
      variant="outlined"
      value={activeProposal.data.unitCostTax}
      onChange={(e) => setProposalUnitCostTax(dispatch, e.target?.value)}
      type="number"
      style={{ maxWidth: "100px" }}
    />
  ) : (
    <></>
  );
}

/**
 * Displays a pricing summary based on the priced out job
 * as well as any fees and commissions
 * @returns
 */
export function ConfigureMultiplier() {
  const dispatch = useAppDispatch();
  const { activeProposal } = useAppSelector((state) => state.activeProposal);
  const { multipliers } = useAppSelector((state) => state.multipliers);

  return activeProposal ? (
    <FormControl>
      <InputLabel id="multiplier-simple-select-label">Multiplier</InputLabel>
      <Select
        sx={{ minWidth: 100, maxHeight: 35 }}
        labelId="multiplier-simple-select-label"
        id="multiplier-simple-select"
        value={activeProposal.data.multiplier}
        label="Multiplier"
        onChange={(e) =>
          setProposalMultiplier(dispatch, Number(e.target?.value))
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
  ) : (
    <></>
  );
}
