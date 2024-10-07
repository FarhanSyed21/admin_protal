import './App.css';
import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailsPage from './Components/DetailsPage';
import LoginPage from './Components/Pages/Login/LoginPage';
import OtpPage from './Components/Pages/Otp/OtpPage';
import HomePage from './Components/Pages/Home/HomePage';
import UserList from './Components/UserList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/userList" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
