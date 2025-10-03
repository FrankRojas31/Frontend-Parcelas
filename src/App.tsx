import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Parcelas from "./pages/parcelas/Parcelas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/parcelas" element={<Parcelas />} />
    </Routes>
  );
}

export default App;
