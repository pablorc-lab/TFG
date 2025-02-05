import './App.css';
import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom"
import HomePage from './pages/home/homePage';
import AlojamientosPage from './pages/viajeros/alojamientos/AlojamientosPage';
import RegistrarUsuarioPage from './pages/registro_usuario/RegistrarUsuarioPage';
import InicioSesionPage from './pages/registro_usuario/InicioSesionPage';
import FaqPage from './pages/faq/FaqPage';
import ListUsuariosPage from './pages/admin_panel/listado_clientes/ListUsuariosPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas para INICIO*/}
        <Route path="/" element={<Navigate to="/inicio" />}/>
        <Route path="/inicio" element={<HomePage/>}/>
        <Route path="/inicio/faq" element={<FaqPage/>}/>

        {/* Rutas para VIAJEROS*/}
        <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
        <Route path="/viajeros/alojamientos" element={<AlojamientosPage/>}/>

        {/* Rutas para REGISTRO o ACCESO*/}
        <Route path="/registro" element={<RegistrarUsuarioPage />} />
        <Route path="/iniciar-sesion" element={<InicioSesionPage />} />

        {/* Rutas para PANEL ADMIN con rutas anidadas */}
        <Route path="/admin-panel" element={<ListUsuariosPage />}/>

      </Routes>
    </BrowserRouter>
  );
}

