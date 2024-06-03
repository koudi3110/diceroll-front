import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import gameReducer from "./slices/game";
import messageReducer from "./slices/message";
const reducer = {
  auth: authReducer,
  game: gameReducer,
  message: messageReducer,
};
const store = configureStore({
  reducer: reducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
