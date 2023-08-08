import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import {
  AddedSpecification,
  TemplateObject,
} from "../../../middleware/Interfaces";
import { useState } from "react";
import { ManageImportSpecifications } from "../../proposal-ui/documentation/specifications/ManageImportSpecifications";
import QuoteSelection from "../../QuoteSelection";

interface ImportSpecificationActions {
  templates: TemplateObject[];
  template: TemplateObject | null;
  onSubmit:
    | ((specificationsToImport: AddedSpecification[]) => void)
    | undefined;
}
interface ImportSpecificationType extends ImportSpecificationActions {
  addedSpecifications: AddedSpecification[];
  updateTemplate: (template: TemplateObject | null) => void;
  updateAddedSpecifications: (
    addedSpecifications: AddedSpecification[]
  ) => void;
  close: () => void;
}

const useProductTypeStore = create<ImportSpecificationType>((set) => ({
  templates: [],
  template: null,
  addedSpecifications: [],
  onSubmit: undefined,
  updateTemplate: (template) => set(() => ({ template: template })),
  updateAddedSpecifications: (addedSpecifications) =>
    set(() => ({ addedSpecifications: addedSpecifications })),
  close: () => set({ onSubmit: undefined }),
}));

const ImportSpecificationDialog = () => {
  const { onSubmit, close, templates } = useProductTypeStore();

  const [template, updateTemplate] = useProductTypeStore((state) => [
    state.template,
    state.updateTemplate,
  ]);

  const [quoteSelection, updateQuoteSelection] = useState(0);

  const [addedSpecifications, updateAddedSpecifications] = useProductTypeStore(
    (state) => [state.addedSpecifications, state.updateAddedSpecifications]
  );

  return (
    <BaseDialog
      title="Import specifications from a template"
      content={
        <Stack spacing={2} paddingTop="5px">
          {/* Input selection for available templates */}
          <Autocomplete
            disablePortal
            id="templates"
            ListboxProps={{ style: { maxHeight: 350 } }}
            options={templates}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) =>
              !value || value.guid === "" || option?.guid === value.guid
            }
            value={template}
            renderInput={(params) => (
              <TextField {...params} label="Select a template" />
            )}
            onChange={(_, value) => {
              updateQuoteSelection(0);
              updateTemplate(value);
            }}
          />
          {/* Input selection for available quotes for a given template*/}
          <QuoteSelection
            initialValue={quoteSelection}
            quoteOptions={template?.data.quote_options || []}
            onChangeCallback={(value) => {
              // When the quote is changed, the available specifications should also cahnge
              updateQuoteSelection(value);
            }}
          />
          {template && (
            <ManageImportSpecifications
              selectedTemplate={template}
              quoteOption={quoteSelection}
              onChangeCallback={(value) => {
                updateAddedSpecifications(value);
              }}
            />
          )}
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

              onSubmit(addedSpecifications);
              close();
            }}
          >
            Confirm
          </Button>
        </>
      }
      show={Boolean(onSubmit)}
      close={close}
      styles={{
        minWidth: "50vw",
        maxWidth: "100vw",
      }}
    />
  );
};

export const importSpecificationDialog = ({
  templates,
  template,
  onSubmit,
}: ImportSpecificationActions) => {
  useProductTypeStore.setState({
    templates,
    template,
    onSubmit,
  });
};

export default ImportSpecificationDialog;
