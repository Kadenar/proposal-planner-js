import React from "react";
import { createRoot } from "react-dom/client";

// import ReactDOM from "react-dom";
import "./index.css";
import StoreProvider from "./StoreProvider";
import { ThemeContextProvider } from "./theme/ThemeContextProvider.tsx";

// const container = document.getElementById("root");
// const root = createRoot(container);
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <div className="App">
        <StoreProvider />
      </div>
    </ThemeContextProvider>
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode></React.StrictMode>,
//   document.getElementById("root")
// );
