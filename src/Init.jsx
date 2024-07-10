import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import {
  replaceCurrentUser,
  replaceIsLoggedIn,
  replaceSocket,
} from "./slices/auth";
import { replaceEncours, replaceWainting } from "./slices/game";
import { baseURL } from "./utils/baseUrl";
import { getConfigs } from "./slices/config";

const Init = ({ children }) => {
  const { currentUser, isLoggedIn, socket, language } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const socket1 = io(baseURL, {
    // reconnectionDelayMax: 10000,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
    autoConnect: false,
  });

  useEffect(() => {
    if (isLoggedIn) {
      try {
        socket1.connect();
        dispatch(replaceSocket(socket1));
      } catch (error) {
        console.log(error);
      }
    }

    if (localStorage.getItem("user")) {
      if (!currentUser || JSON.stringify(currentUser) == "{}") {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        dispatch(replaceCurrentUser(user));
        dispatch(replaceIsLoggedIn(true));
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getConfigs(currentUser?._id));
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      // socket?.on("connect", () => {
      //   // showSucces(transation.connection_established);
      //   dispatch(replaceOnline(true));
      //   // localStorage.setItem("last_connect", new Date().toDateString());
      // });

      // socket?.on("disconnect", () => {
      //   dispatch(replaceOnline(false));
      //   // showWarning("Connexion intérrompue");
      // });

      // socket?.on("close", () => {
      //   dispatch(replaceOnline(false));
      // });

      socket?.on("session:list", (data) => {
        // console.log(data);

        const waitingSession = data?.filter((e) => e?.status == "init");
        const encoursSessin = data?.filter((e) => e?.status == "pending");

        dispatch(replaceEncours([...encoursSessin]));
        dispatch(replaceWainting([...waitingSession]));
      });
    }
    // currentUser
  }, [socket]);

  return <React.Fragment>{children}</React.Fragment>;
};
export default Init;
