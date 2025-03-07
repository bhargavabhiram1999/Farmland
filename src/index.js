import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Import BrowserRouter
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap CSS


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <BrowserRouter basename="/Farmland"> {/* ✅ Wrap App inside BrowserRouter */}
      <App />
    </BrowserRouter>
  
);

reportWebVitals();
