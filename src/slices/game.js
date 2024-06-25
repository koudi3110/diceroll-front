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
  async (limit, thunkAPI) => {
    try {
      const player = thunkAPI.getState()?.auth?.currentUser?._id;

      const response = await gameService.getHistory({ player, limit });
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

export const sessionStatus = createAsyncThunk(
  "game/sessionStatus",
  async (id, thunkAPI) => {
    try {
      const response = await gameService.sessionStatus(id);
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
