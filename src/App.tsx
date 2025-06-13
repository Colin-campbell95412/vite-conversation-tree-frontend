import React from "react";

import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { RouterConfig } from "./navigation/RouterConfig";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <RouterConfig />
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
