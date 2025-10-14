import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Parcelas from "./pages/parcelas/Parcelas";
import Login from "./pages/login&register/Login";
import Register from "./pages/login&register/Register";
import Usuarios from "./pages/usuarios/Usuarios";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Rutas protegidas - requieren autenticación */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parcelas"
        element={
          <ProtectedRoute>
            <Parcelas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />

      {/* Rutas públicas - no requieren autenticación */}
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
