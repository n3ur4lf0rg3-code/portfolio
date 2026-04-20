import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./core/store";
import { AuthProvider } from "./core/auth.context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StoreProvider>
      <App />
    </StoreProvider>
  </AuthProvider>
);
