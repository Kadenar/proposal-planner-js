import { Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import { ProposalObject } from "../../../middleware/Interfaces";

interface SoldJobDialogActions {
  message: string;
  proposal: ProposalObject | undefined;
  onSubmit: (() => Promise<boolean | undefined>) | undefined;
}

interface SoldJobDialogType extends SoldJobDialogActions {
  updateProposal: (proposal: ProposalObject) => void;
  close: () => void;
}

const useSoldJobDialogStore = create<SoldJobDialogType>((set) => ({
  message: "",
  proposal: undefined,
  updateProposal: (proposal) => set(() => ({ proposal: proposal })),
  onSubmit: undefined,
  close: () => set({ onSubmit: undefined }),
}));

const SoldJobDialog = () => {
  return <></>;
  //   const { onSubmit, close } = useSoldJobDialogStore();
  //   const [proposal, updateProposal] = useSoldJobDialogStore((state) => [
  //     state.proposal,
  //     state.updateProposal,
  //   ]);
  //   const [description, updateDescription] = useSoldJobDialogStore((state) => [
  //     state.description,
  //     state.updateDescription,
  //   ]);
  //   return (
  //     <BaseDialog
  //       title={"Mark job as sold"}
  //       content={
  //         <div style={{ paddingTop: "5px" }}>
  //           <Stack spacing={2}>
  //             <TextField
  //               label="Name"
  //               value={undefined}
  //               onChange={({ target: { value } }) => {
  //                 // updateName(value);
  //               }}
  //               autoFocus
  //             />
  //             <TextField
  //               label="Description"
  //               value={description}
  //               onChange={({ target: { value } }) => {
  //                 updateDescription(value);
  //               }}
  //             />
  //           </Stack>
  //         </div>
  //       }
  //       actions={
  //         <>
  //           <Button color="secondary" variant="contained" onClick={close}>
  //             Cancel
  //           </Button>
  //           <Button
  //             color="primary"
  //             variant="contained"
  //             onClick={async () => {
  //               if (!onSubmit) {
  //                 close();
  //                 return;
  //               }
  //               const returnValue = await onSubmit();
  //               if (returnValue) {
  //                 close();
  //               }
  //             }}
  //           >
  //             Confirm
  //           </Button>
  //         </>
  //       }
  //       show={Boolean(onSubmit)}
  //       close={close}
  //     />
  //   );
};

export const soldJobDialog = ({ message, onSubmit }: SoldJobDialogActions) => {
  useSoldJobDialogStore.setState({
    message,
    onSubmit,
  });
};

export default SoldJobDialog;
