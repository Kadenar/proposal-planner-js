import { Dispatch, createSlice } from "@reduxjs/toolkit";

interface OpenedTab {
  guid: string;
  title: string;
  editable: boolean;
}

// REDUCERS
const initialState: { tabs: OpenedTab[] } = {
  tabs: [
    {
      guid: crypto.randomUUID(),
      title: "home",
      editable: false,
    },
    {
      guid: crypto.randomUUID(),
      title: "test",
      editable: true,
    },
  ],
};

export const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state, value) => {
      const newTab = {
        guid: crypto.randomUUID(),
        title: value.payload,
        editable: true,
      };
      state.tabs = state.tabs.concat(newTab);
    },
    removeTab: (state, value) => {
      const index = state.tabs.findIndex((tab) => {
        return tab.guid === value.payload;
      });

      if (index !== -1) {
        state.tabs.splice(index, 1);
      }
    },
  },
});

export default tabSlice.reducer;

// ACTIONS

const { addTab, removeTab } = tabSlice.actions;

export const addNewTab = async (dispatch: Dispatch, name: string) =>
  dispatch(addTab(name));

export const deleteTab = async (dispatch: Dispatch, guid: string) =>
  dispatch(removeTab(guid));
