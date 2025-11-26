import HomePage from "./components/HomePage";
import CheckOut from "./components/CheckOut";

import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProtectedRoute from "./components/context/ProtectedRoute";
import ProductList from "./components/Products/ProductList";
import ViewProduct from "./components/Products/ViewProduct";
import Product from "./components/Products/Product";
import ProductDetails from "./components/ProductDetails";

function App() {
  return (
    <Routes>
  
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

        <Route 
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails/>
            </ProtectedRoute>
          }
        />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckOut />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute role="admin">
            <ProductList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProtectedRoute role="admin">
            <ViewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/create"
        element={
          <ProtectedRoute role="admin">
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/edit/:id"
        element={
          <ProtectedRoute role="admin">
            <Product />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
