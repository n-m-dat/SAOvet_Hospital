import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //-----LOGIN-----//
    logInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    logInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //-----UPDATE-----//
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('currentUser');
    },
  },
});

export const {
  logInStart,
  logInSuccess,
  logInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  logoutSuccess,
} = userSlice.actions;

export default userSlice.reducer;
