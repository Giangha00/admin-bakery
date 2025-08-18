import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import ProtectedRoute from "./Components/ProtectRoute";
import Home from "./Pages/Home/Home";
import Product from "./Pages/Product/Product";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<Product />} />
      </Routes>
    </>
  );
}

export default App;
