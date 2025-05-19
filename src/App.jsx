import React, { useState, useEffect } from 'react';
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

import Index from "./views/base/Index";
import CourseDetail from "./views/base/CourseDetail";
import Cart from "./views/base/Cart";
import Checkout from "./views/base/Checkout";
import Success from "./views/base/Success";
import Search from "./views/base/Search";

import StudentDashboard from "./views/student/Dashboard";
import StudentCourses from "./views/student/Courses";
import StudentCourseDetail from "./views/student/CourseDetail";
import Wishlist from "./views/student/Wishlist";
import StudentProfile from "./views/student/Profile";

import UserData from "./views/plugin/UserData";
import StudentChangePassword from "./views/student/ChangePassword";
import Dashboard from "./views/instructor/Dashboard";
import Courses from "./views/instructor/Courses";
import Review from "./views/instructor/Review";
import Students from "./views/instructor/Students";
import Earning from "./views/instructor/Earning";
import Orders from "./views/instructor/Orders";
import Coupon from "./views/instructor/Coupon";
import TeacherNotification from "./views/instructor/TeacherNotification";
import QA from "./views/instructor/QA";
import ChangePassword from "./views/instructor/ChangePassword";
import Profile from "./views/instructor/Profile";
import CourseCreate from "./views/instructor/CourseCreate";
import CourseEdit from "./views/instructor/CourseEdit";
// import CourseEditCurriculum from "./views/instructor/CourseEditCurriculum";


import { setUser } from './utils/auth';
import { CartContext } from './views/plugin/Context';

import apiInstance from './utils/axios';
import CartId from './views/plugin/CartId';

// private
function App() {
  const [cartCount, setCartCount] = useState(0);
  const cartId = CartId();

  useEffect(() => {
    setUser(); // Initialize user state from cookies

    // cart count fetch
    apiInstance.get(`course/cart-list/${cartId}`)
      .then((response) => {
          console.log('carts: ', response.data);
          setCartCount(response.data?.length);
          console.log('cart count : ', cartCount);
      });
    }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <BrowserRouter>
        <MainWrapper>
          <Routes>
            {/** public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreateNewPassword />} />

            {/* Base Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/course-detail/:slug/" element={<CourseDetail />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/checkout/:order_oid/" element={<Checkout />} />
            <Route path="/payment-success/:order_oid/" element={<Success />} />
            <Route path="/search/" element={<Search />} />

            {/* Protected Route */}
            {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </CartContext.Provider>
  )
}

export default App
