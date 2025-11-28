import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import HowItWorks from "./Pages/HowItWorks";
import GreenRouteDemo from "./Pages/GreenRouteDemo";
import CO2Calculator from "./Pages/CO2Calculator";
import AboutPage from "./Pages/AboutPage";
import './App.css';  // Import the CSS file

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/EcoRouteLogo.png" alt="EcoRoute Logo" className="logo-image" />
          </Link>
        </div>
        
        <div className="menu">
          <Link to="/">Home</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/demo">Green Route Demo</Link>
          <Link to="/calculator">CO₂ Calculator</Link>
          <Link to="/about">About</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/demo" element={<GreenRouteDemo />} />
        <Route path="/calculator" element={<CO2Calculator />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
