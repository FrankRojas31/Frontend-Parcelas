import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Parcelas from "./pages/parcelas/Parcelas";
import Login from "./pages/login&register/Login";
import Register from "./pages/login&register/Register";
import Usuarios from "./pages/usuarios/Usuarios";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/parcelas" element={<Parcelas />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
