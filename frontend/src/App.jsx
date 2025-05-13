import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"

// Se mantiene con un import normal porque es la primera vista y se carga inmediatamente,
import HomePage from './pages/inicio/home/HomePage';
import ScrollToTop from './components/utilities/ScrollToTop';

const LoginAdmin = lazy(() => import('./pages/admin_panel/LoginAdmin'));
const ForosViajPage = lazy(() => import('./pages/viajeros/foros/ForosViajPage'));
const ForosAnfPage = lazy(() => import('./pages/anfitriones/foros/ForosAnfPage'));
const Soporte = lazy(() => import("./pages/inicio/soporte/Soporte"));
const PoliticasPrivacidad = lazy(() => import("./pages/inicio/politicas_privacidad/PoliticasPrivacidad"));
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

  // Outlet : Reenderiza las rutas hijas si hay token anfitrión
  const PrivateAnfitrionRoute = () => {
    const token = localStorage.getItem("acces_token");
    const user = localStorage.getItem("user");

    return token && user === "Anfitrion (1)" ? <Outlet /> : <Navigate to="/login" replace/>;
  };

  // Outlet : Reenderiza las rutas hijas si hay token anfitrión
  const PrivateViajeroRoute = () => {
    const token = localStorage.getItem("acces_token");
    const user = localStorage.getItem("user");

    return token && user === "Viajero (2)" ? <Outlet /> : <Navigate to="/login" replace/>;
  };

  // Outlet : Reenderiza las rutas hijas si hay token anfitrión
  const PrivateAdminRoute = () => {
    const token = localStorage.getItem("acces_token");
    const user = localStorage.getItem("user");

    return token && user === "Admin (0)" ? <Outlet /> : <Navigate to="/admin-panel/login" replace/>;
  };

  const InicioSesionRedirect = () => {
    const token = localStorage.getItem("acces_token");
    const user = localStorage.getItem("user");

    if (token && user === "Anfitrion (1)") {
      return <Navigate to="/anfitriones" replace/>;
    }

    else if (token && user === "Viajero (2)") {
      return <Navigate to="/viajeros" replace/>;
    }

    return <InicioSesionPage />;
  };


  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />}>
        <Routes>
          {/* Rutas para INICIO*/}
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/inicio/faq" element={<FaqPage />} />
          <Route path="/inicio/politicas-privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/inicio/soporte" element={<Soporte />} />

          {/* Rutas para VIAJEROS*/}
          <Route element={<PrivateViajeroRoute />}>
            <Route path="/viajeros" element={<Navigate to="/viajeros/alojamientos" />} />
            <Route path="/viajeros/foros" element={<ForosViajPage />} />
            <Route path="/viajeros/alojamientos" element={<AlojamientosPage />} />
            <Route path="/viajeros/conexiones" element={<ConexionesViajPage />} />
            <Route path="/viajeros/mi-cuenta" element={<MiCuenta />} />
            <Route path="/viajeros/perfil-anfitrion" element={<AnfProfilePage />} />
          </Route>

          {/* Rutas para ANFITRIONES*/}
          <Route element={<PrivateAnfitrionRoute />}>
            <Route path="/anfitriones" element={<Navigate to="/anfitriones/inquilinos" />} />
            <Route path="/anfitriones/foros" element={<ForosAnfPage />} />
            <Route path="/anfitriones/inquilinos" element={<InquilinosPage />} />
            <Route path="/anfitriones/conexiones" element={<ConexionesAnfPage />} />
            <Route path="/anfitriones/mi-cuenta" element={<MiCuenta esViajero={false} />} />
            <Route path="/anfitriones/perfil-viajero" element={<InqProfilePage />} />
          </Route>

          {/* Rutas para REGISTRO o ACCESO*/}
          <Route path="/registro" element={<RegistrarUsuarioPage />} />
          <Route path="/login" element={<InicioSesionRedirect />} />

          {/* Rutas para PANEL ADMIN con rutas anidadas */}
          <Route path="/admin-panel/login" element={<LoginAdmin />} />
          <Route element={<PrivateAdminRoute />}>
            <Route path="/admin-panel" element={<Navigate to="/admin-panel/anfitrion" />} />
            <Route path="/admin-panel/:userType" element={<ListTablasPage />} />
            <Route path="/admin-panel/:userType/crear" element={<FormComponent />} />
            <Route path="/admin-panel/:userType/editar/:userID" element={<FormComponent />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
