import React from "react";
import { createRoot } from "react-dom/client";

// import ReactDOM from "react-dom";
import "./index.css";
import StoreProvider from "./StoreProvider";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <div className="App">
    <StoreProvider />
  </div>
);

// ReactDOM.render(
//   <React.StrictMode></React.StrictMode>,
//   document.getElementById("root")
// );
