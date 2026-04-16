import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ClassCompetition from "./ClassCompetition";
import ClassMatch from "./ClassMatch";
import ClassRoster from "./ClassRoster";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/competition" element={<ClassCompetition />} />
        <Route path="/match" element={<ClassMatch />} />
        <Route path="/roster" element={<ClassRoster />} />
      </Routes>
    </Router>
  );
}

export default App;