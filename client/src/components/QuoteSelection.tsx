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
      label="Select a quote option"
      value={quoteValue}
      onChange={({ target: { value } }) => {
        const newQuoteOption = Number(value);
        setQuoteValue(newQuoteOption);
        onChangeCallback(newQuoteOption);
      }}
      select
    >
      {quoteOptions.map((quote, index) => {
        return (
          <MenuItem key={index} value={index}>
            {quote.title === "" ? `Quote ${index + 1}` : quote.title}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default QuoteSelection;
