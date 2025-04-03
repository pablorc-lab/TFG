import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Se mantiene con un import normal porque es la primera vista y se carga inmediatamente,
import HomePage from './pages/inicio/home/HomePage';
import ScrollToTop from './components/utilities/ScrollToTop';

const InqProfilePage = lazy(() => import("./pages/anfitriones/inq_profiles/InqProfilePage"));
const ConexionesAnfPage = lazy(() => import("./pages/anfitriones/conexiones/ConexionesAnfPage"));
const ConexionesViajPage = lazy(() => import("./pages/viajeros/conexiones/ConexionesViajPage"));
const AlojamientosPage = lazy(() => import("./pages/viajeros/alojamientos/AlojamientosPage"));
const RegistrarUsuarioPage = lazy(() => import("./pages/registro_usuario/RegistrarUsuarioPage"));
const InicioSesionPage = lazy(() => import("./pages/registro_usuario/InicioSesionPage"));
const FaqPage = lazy(() => import("./pages/inicio/faq/FaqPage"));
const ListTablasPage = lazy(() => import("./pages/admin_panel/ListTablasPage"));
const FormComponent = lazy(() => import('./components/admin_panel/form_user/FormComponent'));
const MiCuenta = lazy(() => import("./pages/usuarios/mi_cuenta/MiCuenta"));
const InquilinosPage = lazy(() => import('./pages/anfitriones/inquilinos/InquilinosPage'));
const AnfProfilePage = lazy(() => import('./pages/viajeros/anf_profiles/AnfProfilePage'));

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
          <Route path="/viajeros/conexiones" element={<ConexionesViajPage/>} />
          <Route path="/viajeros/mi-cuenta" element={<MiCuenta/>} />
          <Route path="/viajeros/perfil-anfitrion" element={<AnfProfilePage/>} />

          {/* Rutas para ANFITRIONES*/}
          <Route path="/anfitriones" element={<Navigate to="/anfitriones/inquilinos" />} />
          <Route path="/anfitriones/inquilinos" element={<InquilinosPage/>} />
          <Route path="/anfitriones/conexiones" element={<ConexionesAnfPage/>} />
          <Route path="/anfitriones/mi-cuenta" element={<MiCuenta esViajero={false}/>} />
          <Route path="/anfitriones/perfil-viajero" element={<InqProfilePage/>} />

          {/* Rutas para REGISTRO o ACCESO*/}
          <Route path="/registro" element={<RegistrarUsuarioPage />} />
          <Route path="/iniciar-sesion" element={<InicioSesionPage />} />

          {/* Rutas para PANEL ADMIN con rutas anidadas */}
          <Route path="/admin-panel" element={<Navigate to="/admin-panel/anfitrion" />} />
          <Route path="/admin-panel/:userType" element={<ListTablasPage />} />
          <Route path="/admin-panel/:userType/crear" element={<FormComponent />} />
          <Route path="/admin-panel/:userType/editar/:userID" element={<FormComponent />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
