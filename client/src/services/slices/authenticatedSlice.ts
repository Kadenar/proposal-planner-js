import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  addUser,
  fetchUsers,
  validateUserSession,
} from "../../middleware/authenticationHelpers";
import { updateStore } from "../Dispatcher";

// REDUCERS

const initialState: { users: []; isAuthenticated: boolean } = {
  users: [],
  isAuthenticated: false, // toggle this for dev
};

export const authenticatedSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    updateUsers: (state, value) => {
      state.users = value.payload;
    },
    setAuthenticated: (state, value) => {
      state.isAuthenticated = value.payload;
    },
  },
});

export default authenticatedSlice.reducer;

// ACTIONS

const { updateUsers, setAuthenticated } = authenticatedSlice.actions;

export const initializeUsers = () => async (dispatch: Dispatch) => {
  const products = await fetchUsers();
  dispatch(updateUsers(products));
};

export async function createUser(
  dispatch: Dispatch,
  userName: string,
  password: string
) {
  return updateStore({
    dispatch,
    dbOperation: async () => addUser(userName, password),
    methodToDispatch: updateUsers,
    dataKey: "users",
    successMessage: "User successfully created!",
  });
}

export function logOut(dispatch: Dispatch) {
  dispatch(setAuthenticated(false));
}

export async function validateSession(
  dispatch: Dispatch,
  userName: string,
  password: string
) {
  return updateStore({
    dispatch,
    dbOperation: async () => validateUserSession(userName, password),
    methodToDispatch: setAuthenticated,
    dataKey: "isAuthenticated",
    successMessage: "Successfully logged in!",
  });
}
