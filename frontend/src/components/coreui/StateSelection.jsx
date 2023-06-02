import { useState } from "react";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { US_STATES } from "../../data-management/Constants";

const StateSelection = ({ initialValue, onChangeHandler = () => {} }) => {
  const [state, updateState] = useState(initialValue);
  return (
    <FormControl fullWidth>
      <InputLabel>State</InputLabel>
      <Select
        value={state}
        onChange={({ target: { value } }) => {
          updateState(value);
          onChangeHandler(value);
        }}
        label="State"
      >
        {US_STATES.map((state) => {
          return (
            <MenuItem key={state.name} value={state.code}>
              {state.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default StateSelection;
