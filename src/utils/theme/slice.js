import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem("theme-appearance") || "light-theme",
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    TOGGLE_LIGHT: (state) => {
      state.theme = "light-theme";
    },
    TOGGLE_DARK: (state) => {
      state.theme = "dark-theme";
    },
  },
});

export const { TOGGLE_LIGHT, TOGGLE_DARK } = themeSlice.actions;

export default themeSlice.reducer;
