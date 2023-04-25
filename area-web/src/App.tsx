import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/App.css";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Profile from "./pages/Profile";

const App = () => {
  if (!document.cookie) {
    return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Auth />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
