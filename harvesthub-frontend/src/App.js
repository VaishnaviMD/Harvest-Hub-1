import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./signin.jsx";
import SignUp from "./pages/SignUp";
import Customer from "./pages/Customer";
import Farmer from "./pages/Farmer";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
      <Route path="/farmer" element={<ProtectedRoute><Farmer /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <AppRoutes />
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
