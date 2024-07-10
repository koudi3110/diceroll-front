import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import configService from "../services/config.service";
import initialState from "../initialStore/config";

export const getConfigs = createAsyncThunk(
  "config/getConfigs",
  async (data, thunkAPI) => {
    try {
      const response = await configService.getConfigs(data);
      thunkAPI.dispatch(replaceConfigs(response));
      return response;
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

export const createUpdateConfigs = createAsyncThunk(
  "config/createUpdateConfigs",
  async (data, thunkAPI) => {
    try {
      const response = await configService.createUpdateConfigs(data);
      thunkAPI.dispatch(replaceConfigs(response));
      return response;
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

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    replaceConfigs(state, action) {
      return {
        ...state,
        configs: action.payload,
      };
    },
  },
});
const { reducer, actions } = configSlice;

export const { replaceConfigs } = actions;
export default reducer;
