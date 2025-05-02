import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import MainWrapper from './layouts/MainWrapper'
import PrivateRoute from './layouts/PrivateRoute'

// public
import Register from './views/auth/Register'
import Login from './views/auth/Login'
import Logout from './views/auth/Logout'
import ForgotPassword from './views/auth/ForgotPassword'
import CreateNewPassword from './views/auth/CreateNewPassword'
import Index from './views/base/Index'

import { setUser } from './utils/auth';

// private
function App() {

  useEffect(() => {
    setUser(); // Initialize user state from cookies
  }, []);

  return (
    <>
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          {/** public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />

          <Route path="/" element={<Index />} />

          {/* Protected Route */}
          {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        </Routes>
      </MainWrapper>
    </BrowserRouter>
    </>
  )
}

export default App
