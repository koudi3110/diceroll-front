import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "../initialStore/game";
import gameService from "../services/game.service";

export const createGame = createAsyncThunk(
  "game/createGame",
  async (data, thunkAPI) => {
    try {
      const response = await gameService.createGame(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getGameStatus = createAsyncThunk(
  "game/getGameStatus",
  async (data, thunkAPI) => {
    try {
      const response = await gameService.getGameStatus(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getHistory = createAsyncThunk(
  "game/getHistory",
  async (data, thunkAPI) => {
    try {
      const account = thunkAPI.getState()?.auth?.currentUser?.account?._id;
      // console.log(
      //   "===========",
      //   thunkAPI.getState()?.auth?.currentUser?.account?._id
      // );
      const response = await gameService.getHistory({ account, number: data });
      return thunkAPI.dispatch(replaceHistory(response));
    } catch (error) {
      throw error;
    }
  }
);

export const getScores = createAsyncThunk(
  "game/getScores",
  async (data, thunkAPI) => {
    try {
      const response = await gameService.getScores();
      return thunkAPI.dispatch(replaceScore(response));
    } catch (error) {
      console.log("ERRRRRRRRRRRR", error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }
);

export const gameStatus = createAsyncThunk(
  "game/gameStatus",
  async (id, thunkAPI) => {
    try {
      const response = await gameService.gameStatus(id);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }
);

export const getAccountTransaction = createAsyncThunk(
  "game/getAccountTransaction",
  async (data, thunkAPI) => {
    try {
      const response = await gameService.getAccountTransaction(data);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }
);

export const problemGame = createAsyncThunk(
  "game/problemGame",
  async (data, thunkAPI) => {
    try {
      const response = await gameService.problemGame(data);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      throw message;
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    replaceWainting(state, action) {
      return {
        ...state,
        waiting: action.payload,
      };
    },
    replaceEncours(state, action) {
      return {
        ...state,
        encours: action.payload,
      };
    },
    replaceGameData(state, action) {
      return {
        ...state,
        gameData: action.payload,
      };
    },
    replaceHistory(state, action) {
      return {
        ...state,
        history: action.payload,
      };
    },
    replaceScore(state, action) {
      return {
        ...state,
        score: action.payload,
      };
    },
    replaceFinance(state, action) {
      return {
        ...state,
        finance: action.payload,
      };
    },
  },
});
const { reducer, actions } = gameSlice;

export const {
  replaceWainting,
  replaceEncours,
  replaceGameData,
  replaceHistory,
  replaceScore,
  replaceFinance,
} = actions;
export default reducer;
