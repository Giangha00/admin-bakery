import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import ProtectedRoute from "./Components/ProtectRoute";
import Home from "./Pages/Home";

function App() {
  return (
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
    </Routes>
  );
}

export default App;
