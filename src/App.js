import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Welcome from "./components/Welcome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/welcome/:username" element={<Welcome />} />
    </Routes>
  );
}

export default App;
