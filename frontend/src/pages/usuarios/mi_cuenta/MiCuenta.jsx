import { lazy, Suspense, useEffect, useState } from "react";
import styles from "./MiCuenta.module.css"
import ScoreMiCuenta from "../../../components/usuarios/mi_cuenta/Score";
import { Link } from "react-router-dom";
const OpinionesMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/opiniones/Opiniones"));
const PerfilMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/perfil/Perfil"));
const SeguridadMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/seguridad/Seguridad"));
const HistorialReservasMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/historial_reservas/HistorialReservas"));
const ViajerosMobileHeader = lazy(() => import("../../../components/viajeros/header/ViajerosMobileHeader"));
const RecomendacionesMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/recomendaciones/Recomendaciones"));

export default function MiCuenta({ activeSection = "perfil", esViajero = true }) {
  const [activeMenu, setActiveMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [perfilImage, setPerfilImage] = useState(null);

  // Controlar cuando es pantalla pequeña
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Gustos_imgs = [
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ];

  const userNavItems = [
    { src: "/images/usuarios/account/edit.svg", alt: "Datos personales", text: "Datos personales" },
    { src: "/images/usuarios/account/biografia.svg", alt: "Biografía", text: "Biografía" },
    { src: "/images/usuarios/account/house.svg", alt: "Vivienda", text: "Vivienda" },
    { src: "/images/usuarios/account/recomendaciones.svg", alt: "Recomendaciones", text: esViajero ? "Experiencias" : "Recomendaciones" },
    { src: "/images/usuarios/account/security.svg", alt: "Seguridad", text: "Seguridad" },
    { src: "/images/usuarios/account/star.svg", alt: "Opiniones", text: "Opiniones" },
    { src: "/images/usuarios/account/history.svg", alt: "Historial de reservas", text: "Historial de reservas" }
  ];

  const styleSuspense = {
    width: "80%",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "50px",
    backgroundColor: "white",
    boxShadow: "0 0 5px rgba(65, 65, 65, 0.3)",
  };

  return (
    <>
      <title>Mi cuenta | Viajeros</title>
      <header className={styles.header}>
        <figure>
          <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
          <figcaption>
            <h1>Bearfrens</h1>
            <h2>Mi cuenta</h2>
          </figcaption>
        </figure>
        <nav>
          {!isMobile ? (
            <>
              <Link to="/viajeros/alojamientos">Alojamientos</Link>
              <Link to="/viajeros/alojamientos">Comunidades</Link>
              <Link to="/viajeros/alojamientos">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          ) : (
            <>
              <Link to="/viajeros/alojamientos">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          )}
        </nav>
      </header>

      {isMobile && <ViajerosMobileHeader activeSection={activeSection} />}

      <main className={styles.main}>
        <article className={styles.main_containers}>

          {/* Menú de nav*/}
          <nav className={styles.user_nav}>
            <ul className={styles.user_nav_ul}>
              {userNavItems.map((item, index) => {
                if (index == 2 && esViajero) return null;

                return (
                  <li key={index} className={activeMenu === index ? styles.active : undefined} onClick={() => setActiveMenu(index)}>
                    <img src={item.src} alt={item.text} />
                    <h2>{item.text}</h2>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Perfil de usuario*/}
          <section className={styles.user_container}>
            <article className={styles.user_profile}>
              <div >
                <label className={styles.file_input_label}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }}
                    onChange={(e) => {setPerfilImage(URL.createObjectURL(e.target.files[0]))}} 
                  />
                  <img className={styles.user_img} src={perfilImage || "/images/not_found/user_img.png"} alt="Imagen de perfil" width={50}/>
                </label>

                <div className={styles.profile_img} >
                  <img src="/images/usuarios/account/edit_img.svg" alt="Editar imagen" />
                </div>
              </div>

              <div className={styles.user_general_info}>
                <div className={styles.user_name}>
                  <h2>Eduardo G</h2>
                  <p>(36 años)</p>
                </div>
                <ScoreMiCuenta />
                <div className={styles.user_likes}>
                  {Gustos_imgs.map((gusto, index) => (
                    <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
                  ))}
                </div>
              </div>
            </article>

            <div className={styles.user_bubble}>
              <h4>Barcelona (300&euro; / noche)</h4>
              <p>Amante de la aventura y los viajes hacia lugares muy bonitos</p>
            </div>
          </section>
        </article>

        {/* Componente de los menús*/}
        <div className={styles.user_component}>
          <Suspense fallback={<div style={styleSuspense}><img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "200px", position: "relative", left: "50%", transform: "translateX(-50%)" }} /></div>}>
            {activeMenu === 0 && <PerfilMiCuenta showValue={0} />}
            {activeMenu === 1 && <PerfilMiCuenta showValue={1} esViajero={esViajero} />}
            {activeMenu === 2 && !esViajero && <PerfilMiCuenta showValue={2} />}
            {activeMenu === 3 && <RecomendacionesMiCuenta esViajero={esViajero}/>}
            {activeMenu === 4 && <SeguridadMiCuenta />}
            {activeMenu === 5 && <OpinionesMiCuenta />}
            {activeMenu === 6 && <HistorialReservasMiCuenta />}
          </Suspense>
        </div>
      </main>
    </>
  )
}