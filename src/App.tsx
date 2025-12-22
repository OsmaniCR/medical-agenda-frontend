import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Appointments from "./pages/Appointments";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated, checkToken } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated && checkToken() ? (
            <Navigate to="/appointments" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/appointments" replace />} />
    </Routes>
  );
}

export default App;
