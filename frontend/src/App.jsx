import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Se mantiene con un import normal porque es la primera vista y se carga inmediatamente,
import HomePage from './pages/inicio/home/HomePage';
import ScrollToTop from './components/utilities/ScrollToTop';

const AlojamientosPage = lazy(() => import("./pages/viajeros/alojamientos/AlojamientosPage"));
const RegistrarUsuarioPage = lazy(() => import("./pages/registro_usuario/RegistrarUsuarioPage"));
const InicioSesionPage = lazy(() => import("./pages/registro_usuario/InicioSesionPage"));
const FaqPage = lazy(() => import("./pages/inicio/faq/FaqPage"));
const ListUsuariosPage = lazy(() => import("./pages/admin_panel/listado_clientes/ListUsuariosPage"));
const MiCuenta = lazy(() => import("./pages/usuarios/mi_cuenta/MiCuenta"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Suspense fallback={<h1 style={{textAlign:"center"}}>Cargando...</h1>}>
        <Routes>
          {/* Rutas para INICIO*/}
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/inicio/faq" element={<FaqPage />} />

          {/* Rutas para VIAJEROS*/}
          <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
          <Route path="/viajeros/alojamientos" element={<AlojamientosPage/>} />
          <Route path="/viajeros/mi-cuenta" element={<MiCuenta />} />

          {/* Rutas para REGISTRO o ACCESO*/}
          <Route path="/registro" element={<RegistrarUsuarioPage />} />
          <Route path="/iniciar-sesion" element={<InicioSesionPage />} />

          {/* Rutas para PANEL ADMIN con rutas anidadas */}
          <Route path="/admin-panel" element={<Navigate to="/admin-panel/anfitrion" />} />
          <Route path="/admin-panel/:userType" element={<ListUsuariosPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
