import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.scss";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";

import Signin from "./pages/Signin";
import Game from "./pages/Game";
import Score from "./pages/Score";
import Configuration from "./pages/Configuration";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/signin" element={<Signin />} />
        <Route exact path="/game" element={<Game />} />
        <Route path="/scores" element={<Score />} />
        <Route path="/settings" element={<Configuration />} />

        <Route path="*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
