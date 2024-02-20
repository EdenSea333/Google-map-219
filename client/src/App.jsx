import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Files from './pages/Files';
import Users from './pages/Users';
import Companies from './pages/Companies';
import CustomizeMap from './pages/Map';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<SignIn/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/about" element={<About/>} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/map" element={<CustomizeMap/>} />
          <Route element={<AdminRoute />} >
            <Route path="/file-list" element={<Files/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}
