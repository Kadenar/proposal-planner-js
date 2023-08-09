import { Dispatch, createSlice } from "@reduxjs/toolkit";

interface OpenedTab {
  guid: string;
  title: string;
  path: string;
  editable: boolean;
}

// REDUCERS
const initialState: { activeTab: number; tabs: OpenedTab[] } = {
  activeTab: 0,
  tabs: [
    {
      guid: crypto.randomUUID(),
      title: "home",
      path: "/",
      editable: false,
    },
    {
      guid: crypto.randomUUID(),
      title: "Templates",
      path: "/templates",
      editable: true,
    },
  ],
};

export const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveTab: (state, value) => {
      state.activeTab = value.payload;
    },
    addTab: (state) => {
      const newTab = {
        guid: crypto.randomUUID(),
        title: "Proposals",
        path: "/",
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
    updateActiveTabTitle: (state, value) => {
      state.tabs[state.activeTab].title = value.payload;
    },
  },
});

export default tabSlice.reducer;

// ACTIONS

const { setActiveTab, addTab, removeTab, updateActiveTabTitle } =
  tabSlice.actions;

export const setTabIndex = (dispatch: Dispatch, index: number) => {
  dispatch(setActiveTab(index));
};

export const addNewTab = (dispatch: Dispatch) => dispatch(addTab());

export const deleteTab = (dispatch: Dispatch, guid: string) =>
  dispatch(removeTab(guid));

export const setTabTitle = (dispatch: Dispatch, title: string) =>
  dispatch(updateActiveTabTitle(title));
