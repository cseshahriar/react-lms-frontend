import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import MainWrapper from './layouts/MainWrapper'
import PrivateRoute from './layouts/PrivateRoute'

import Register from './views/auth/Register'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/** public routes */}
        <Route path="/register" element={<Register />} />
        {/* Protected Route */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
