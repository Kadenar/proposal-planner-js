import { MenuItem, TextField } from "@mui/material";
import { QuoteOption } from "../middleware/Interfaces";
import { getQuoteNameStr } from "../lib/pricing-utils";

const QuoteSelection = ({
  value,
  quoteOptions,
  onChangeCallback,
}: {
  value: string | undefined;
  quoteOptions: QuoteOption[];
  onChangeCallback: (value: number) => void;
}) => {
  const filteredOptions = quoteOptions.filter((quote) => quote.hasProducts);
  return (
    <TextField
      id="select"
      label="Select a quote option"
      value={value}
      onChange={({ target: { value } }) => {
        const newIdx = quoteOptions.findIndex((quote) => quote.guid === value);
        onChangeCallback(newIdx);
      }}
      select
    >
      {
        // Only quotes with products specified are considered for selection

        filteredOptions.map((quote) => {
          return (
            <MenuItem key={quote.guid} value={quote.guid}>
              {quote.name || getQuoteNameStr(quote.guid)}
            </MenuItem>
          );
        })
      }
    </TextField>
  );
};

export default QuoteSelection;
