import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";
import initialState from "../initialStore/auth";

const user = JSON.parse(localStorage.getItem("user"));

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(username, email, password);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);
export const login = createAsyncThunk(
  "auth/login",
  async ({ username }, thunkAPI) => {
    try {
      const data = await AuthService.login(username);
      console.log(data);
      return thunkAPI.dispatch(replaceCurrentUser(data));
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (data, thunkAPI) => {
    try {
      const responser = AuthService.logout();
      thunkAPI.dispatch(replaceIsLoggedIn(false));
      return responser;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      thunkAPI.rejectWithValue();
      throw message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },

  reducers: {
    replaceCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    replaceIsLoggedIn(state, action) {
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    },
    replaceSocket(state, action) {
      return {
        ...state,
        socket: action.payload,
      };
    },
  },
});
const { reducer, actions } = authSlice;

export const { replaceCurrentUser, replaceIsLoggedIn, replaceSocket } = actions;
export default reducer;
