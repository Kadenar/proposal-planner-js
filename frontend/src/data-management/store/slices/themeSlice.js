import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: true,
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export default themeSlice.reducer;

export const { toggleTheme } = themeSlice.actions;

export const updateTheme = () => (dispatch) => {
  dispatch(toggleTheme());
};
