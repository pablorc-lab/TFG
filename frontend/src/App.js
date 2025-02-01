import './App.css';
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom"
import Home from './pages/home/home';
import ViajerosAlojamientos from './pages/viajeros/alojamientos/alojamientos';
import RegistrarUsuario from './pages/registro_usuario/registrar_usuario';
import IniciarSesion from './pages/registro_usuario/iniciar_sesion';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />}/>
        <Route exact path="/inicio" element={<Home/>}/>
        
        <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
        <Route exact path="/viajeros/alojamientos" element={<ViajerosAlojamientos/>}/>

        <Route exact path="/registro" element={<RegistrarUsuario />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
      </Routes>
    </BrowserRouter>
  );
}

