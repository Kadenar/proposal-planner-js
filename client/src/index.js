import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import StoreProvider from "./app/StoreProvider.tsx";

// Root is always present in index.html
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="App">
      <StoreProvider />
    </div>
  </React.StrictMode>
);
