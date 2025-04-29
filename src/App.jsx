import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import MainWrapper from './layouts/MainWrapper'
import PrivateRoute from './layouts/PrivateRoute'

// public
import Register from './views/auth/Register'
import Login from './views/auth/Login'
import ForgotPassword from './views/auth/ForgotPassword'
import CreateNewPassword from './views/auth/CreateNewPassword'
import Index from './views/base/Index'

// private
function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/** public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />

        <Route path="/" element={<Index />} />
        
        {/* Protected Route */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
