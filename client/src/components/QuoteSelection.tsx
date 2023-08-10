import { MenuItem, TextField } from "@mui/material";
import { QuoteOption } from "../middleware/Interfaces";
import { getQuoteNameStr } from "../lib/pricing-utils";

const QuoteSelection = ({
  quote_guid,
  quoteOptions,
  onChangeCallback,
}: {
  quote_guid: string | undefined;
  quoteOptions: QuoteOption[];
  onChangeCallback: (value: number) => void;
}) => {
  return (
    <TextField
      id="select"
      label="Select a quote option"
      value={quote_guid}
      onChange={({ target: { value } }) => {
        const newIdx = quoteOptions.findIndex((quote) => quote.guid === value);
        onChangeCallback(newIdx);
      }}
      select
    >
      {
        // Only quotes with products specified are considered for selection
        quoteOptions
          .filter((quote) => quote.hasProducts)
          .map((quote) => {
            return (
              <MenuItem key={quote.guid} value={quote.guid}>
                {quote.title === "" ? getQuoteNameStr(quote.guid) : quote.title}
              </MenuItem>
            );
          })
      }
    </TextField>
  );
};

export default QuoteSelection;
