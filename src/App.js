import './App.css';
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom"
import HomePage from './components/home/home';
import ViajerosAlojamientos from './components/viajeros/alojamientos/alojamientos';
import RegistrarUsuario from './components/registro_usuarios/registrar_usuario';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />}/>
        <Route exact path="/inicio" element={<HomePage/>}/>
        <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
        <Route exact path="/viajeros/alojamientos" element={<ViajerosAlojamientos/>}/>
        <Route exact path="/registro-user" element={<RegistrarUsuario/>}/>
      </Routes>
    </BrowserRouter>
  );
}

