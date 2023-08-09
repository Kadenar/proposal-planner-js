import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  addTemplate as add_template,
  deleteTemplate as delete_template,
  fetchTemplates,
  saveTemplate as save_template,
} from "../../middleware/templateHelpers.ts";
import { updateStore } from "../Dispatcher.ts";
import { TemplateObject } from "../../middleware/Interfaces.ts";
import { markProposalAsDirty } from "./activeProposalSlice.ts";

// REDUCERS

const initialState: { templates: TemplateObject[] } = {
  templates: [],
};

export const proposalsSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    updateTemplates: (state, value) => {
      state.templates = value.payload;
    },
  },
});

export default proposalsSlice.reducer;

// ACTIONS

const { updateTemplates } = proposalsSlice.actions;

export const initializeTemplates = () => async (dispatch: Dispatch) => {
  const templateData = await fetchTemplates();
  dispatch(updateTemplates(templateData));
};

export async function addTemplate(
  dispatch: Dispatch,
  {
    name,
    description,
  }: {
    name: string;
    description: string;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => add_template(name, description, null),
    methodToDispatch: updateTemplates,
    dataKey: "templates",
    successMessage: "Successfully added new template!",
  });
}

export async function copyTemplate(
  dispatch: Dispatch,
  {
    name,
    description,
    existing_template,
  }: {
    name: string;
    description: string;
    existing_template: TemplateObject | undefined;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => add_template(name, description, existing_template),
    methodToDispatch: updateTemplates,
    dataKey: "templates",
    successMessage: "Successfully copied template!",
  });
}

export async function deleteTemplate(
  dispatch: Dispatch,
  { guid }: { guid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_template(guid),
    methodToDispatch: updateTemplates,
    dataKey: "templates",
    successMessage: "Successfully deleted template!",
  });
}

export async function saveTemplate(
  dispatch: Dispatch,
  template: TemplateObject
) {
  const response = await updateStore({
    dispatch,
    dbOperation: async () => save_template(template),
    methodToDispatch: updateTemplates,
    dataKey: "templates",
    successMessage: "Your template has been successfully saved.",
  });

  if (response) {
    markProposalAsDirty(dispatch, false);
  }
}
