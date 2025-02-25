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
const FormUser = lazy(() => import('./components/admin_panel/form_user/FormUser'));
const MiCuenta = lazy(() => import("./pages/usuarios/mi_cuenta/MiCuenta"));
const InquilinosPage = lazy(() => import('./pages/anfitriones/inquilinos/InquilinosPage'));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{width:"350px", position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
      <Routes>
          {/* Rutas para INICIO*/}
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/inicio/faq" element={<FaqPage />} />

          {/* Rutas para VIAJEROS*/}
          <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
          <Route path="/viajeros/alojamientos" element={<AlojamientosPage/>} />
          <Route path="/viajeros/mi-cuenta" element={<MiCuenta/>} />

          {/* Rutas para ANFITRIONES*/}
          <Route path="/anfitriones" element={<Navigate to="/anfitriones/inquilinos" />} />
          <Route path="/anfitriones/inquilinos" element={<InquilinosPage/>} />
          <Route path="/anfitriones/mi-cuenta" element={<MiCuenta esViajero={false}/>} />

          {/* Rutas para REGISTRO o ACCESO*/}
          <Route path="/registro" element={<RegistrarUsuarioPage />} />
          <Route path="/iniciar-sesion" element={<InicioSesionPage />} />

          {/* Rutas para PANEL ADMIN con rutas anidadas */}
          <Route path="/admin-panel" element={<Navigate to="/admin-panel/anfitrion" />} />
          <Route path="/admin-panel/:userType" element={<ListUsuariosPage />} />
          <Route path="/admin-panel/:userType/crear" element={<FormUser />} />
          <Route path="/admin-panel/:userType/editar/:userID" element={<FormUser />} />
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
