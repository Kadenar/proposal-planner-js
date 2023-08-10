import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import { ProposalObject } from "../../../middleware/Interfaces";
import QuoteSelection from "../../QuoteSelection";
import { ProposalPricingData } from "../../../hooks/ProposalPricingData";
import { ccyFormat } from "../../../lib/pricing-utils";

interface SoldJobDialogActions {
  proposal: ProposalObject | undefined;
  quote_option: number;
  target_commission: number | undefined;
  onSubmit:
    | ((job_price: number, commission: number) => Promise<boolean | undefined>)
    | undefined;
}

interface SoldJobDialogType extends SoldJobDialogActions {
  updateProposal: (proposal: ProposalObject) => void;
  updateQuoteOption: (option: number) => void;
  updateTargetCommission: (option: number) => void;
  close: () => void;
}

const useSoldJobDialogStore = create<SoldJobDialogType>((set) => ({
  proposal: undefined,
  quote_option: 0,
  target_commission: 0,
  updateProposal: (proposal) => set(() => ({ proposal: proposal })),
  updateQuoteOption: (quote_option) =>
    set(() => ({ quote_option: quote_option })),
  updateTargetCommission: (target_commission) =>
    set(() => ({ target_commission: target_commission })),
  onSubmit: undefined,
  close: () => set({ onSubmit: undefined }),
}));

const NewSoldJobDialog = () => {
  const { onSubmit, close, proposal } = useSoldJobDialogStore();

  const [quote_option, updateQuoteOption] = useSoldJobDialogStore((state) => [
    state.quote_option,
    state.updateQuoteOption,
  ]);

  const [target_commission, updateTargetCommission] = useSoldJobDialogStore(
    (state) => [state.target_commission, state.updateTargetCommission]
  );

  const { markedUpPricesForQuotes } = ProposalPricingData(proposal);

  // Default the quote option from the proposal
  const selectedQuoteGuid = proposal?.data.quote_options[quote_option]?.guid;

  // Default the commission value from user's selection on the actual proposal
  const commissionValue = target_commission
    ? target_commission
    : markedUpPricesForQuotes[`quote_${quote_option}`]
    ? markedUpPricesForQuotes[`quote_${quote_option}`].length - 1
    : 0;

  return (
    <BaseDialog
      title={"Mark job as sold"}
      content={
        <div style={{ paddingTop: "5px" }}>
          <Stack spacing={2}>
            <QuoteSelection
              quote_guid={selectedQuoteGuid}
              quoteOptions={proposal?.data.quote_options || []}
              onChangeCallback={(value) => {
                updateQuoteOption(value);
              }}
            />
            <TextField
              id="select-target-commission"
              label="Cost for customer / your commission"
              value={commissionValue}
              onChange={({ target: { value } }) => {
                updateTargetCommission(Number(value));
              }}
              select
            >
              {markedUpPricesForQuotes &&
                selectedQuoteGuid &&
                markedUpPricesForQuotes[selectedQuoteGuid].map(
                  (option, index) => {
                    return (
                      <MenuItem key={index} value={index}>{`Cost: ${ccyFormat(
                        option.sellPrice
                      )} - Commission: ${option.commissionPercent}%`}</MenuItem>
                    );
                  }
                )}
            </TextField>
          </Stack>
        </div>
      }
      actions={
        <>
          <Button color="secondary" variant="contained" onClick={close}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              if (!onSubmit) {
                close();
                return;
              }

              if (!selectedQuoteGuid) {
                return;
              }

              const selectedJobInfo =
                markedUpPricesForQuotes[selectedQuoteGuid][commissionValue];

              const returnValue = await onSubmit(
                selectedJobInfo.sellPrice,
                selectedJobInfo.commissionAmount
              );

              if (returnValue) {
                close();
              }
            }}
          >
            Confirm
          </Button>
        </>
      }
      show={Boolean(onSubmit)}
      close={close}
    />
  );
};

export const newSoldJobDialog = ({
  proposal,
  quote_option,
  target_commission,
  onSubmit,
}: SoldJobDialogActions) => {
  useSoldJobDialogStore.setState({
    proposal,
    quote_option,
    target_commission,
    onSubmit,
  });
};

export default NewSoldJobDialog;
