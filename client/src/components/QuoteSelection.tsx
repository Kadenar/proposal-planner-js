import { useState } from "react";

import { MenuItem, TextField } from "@mui/material";
import { QuoteOption } from "../middleware/Interfaces";

const QuoteSelection = ({
  initialValue,
  quoteOptions,
  onChangeCallback,
}: {
  initialValue: number;
  quoteOptions: QuoteOption[];
  onChangeCallback: (value: number) => void;
}) => {
  const [quoteValue, setQuoteValue] = useState(initialValue);

  return (
    <TextField
      id="select"
      label="Quote option"
      value={quoteValue}
      onChange={({ target: { value } }) => {
        const newQuoteOption = Number(value);
        setQuoteValue(newQuoteOption);
        onChangeCallback(newQuoteOption);
      }}
      select
    >
      {quoteOptions.map((_, index) => {
        return <MenuItem value={index}>Quote {index + 1}</MenuItem>;
      })}
    </TextField>
  );
};

export default QuoteSelection;
