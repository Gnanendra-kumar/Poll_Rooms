import React from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="739060257154-uisofrcm8h1r6q0hm72s6ttbp2r7qas3.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);