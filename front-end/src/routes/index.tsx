import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Roleta from "../pages/Roleta";
import Formulario from "../pages/Formulario";


export function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/roleta" element={<Roleta />} />
    </Routes>
  );
}