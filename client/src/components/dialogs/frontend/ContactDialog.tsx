import { Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface ContactStoreActions {
  header: string;
  name: string;
  email: string;
  phone: string;
  onSubmit:
    | ((
        name: string,
        email: string,
        phone: string
      ) => Promise<boolean | undefined>)
    | undefined;
}
interface ContactStoreType extends ContactStoreActions {
  updateName: (name: string) => void;
  updateEmail: (email: string) => void;
  updatePhone: (phone: string) => void;
  close: () => void;
}

const useContactStore = create<ContactStoreType>((set) => ({
  header: "",
  name: "",
  email: "",
  phone: "",
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateEmail: (email) => set(() => ({ email: email })),
  updatePhone: (phone) => set(() => ({ phone: phone })),
  close: () => set({ onSubmit: undefined }),
}));

const ContactDialog = () => {
  const { onSubmit, close, header } = useContactStore();

  const [name, updateName] = useContactStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [email, updateEmail] = useContactStore((state) => [
    state.email,
    state.updateEmail,
  ]);

  const [phone, updatePhone] = useContactStore((state) => [
    state.phone,
    state.updatePhone,
  ]);

  return (
    <BaseDialog
      title={header}
      content={
        <Stack
          spacing={2}
          paddingTop="5px"
          sx={{ maxHeight: "50vh", overflowY: "auto" }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={({ target: { value } }) => {
              updateName(value);
            }}
            autoFocus
          />
          <TextField
            label="Email"
            value={email}
            onChange={({ target: { value } }) => {
              updateEmail(value);
            }}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={({ target: { value } }) => {
              updatePhone(value);
            }}
          />
        </Stack>
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

              const isValid = await onSubmit(name, email, phone);

              if (isValid) {
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

export const contactDialog = ({
  header,
  name,
  email,
  phone,
  onSubmit,
}: ContactStoreActions) => {
  useContactStore.setState({
    header,
    name,
    email,
    phone,
    onSubmit,
  });
};

export default ContactDialog;
