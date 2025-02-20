import React, { useState, useRef } from "react";
import styles from "./headerHome.module.css"
import DropDownMenu from "../../components/dropdown_menu/DropDownMenu"
import { Link } from "react-router-dom";

export default function HeaderHome({ isHome = false }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  const menuLinks = [
    { path: "/viajeros/alojamientos", label: "Alojamientos", hiddenWhenNavVisible: true },
    { path: "/", label: "Inquilinos", hiddenWhenNavVisible: true },
    { path: "/inicio/faq", label: "FAQ", hiddenWhenNavVisible: true },
    { path: "/iniciar-sesion", label: "Iniciar sesión" },
    { path: "/registro", label: "Registrarse" },
    { path: "/", label: "Soporte" }
  ];

  return (
    <header className={`${styles.header} ${isHome && styles.isHome}`}>
      <Link to="/inicio">
        <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" style={{ cursor: "pointer" }} />
      </Link>

      <section className={styles.header_menu}>
        <nav className={styles.header_nav}>
          <Link to="/inicio">Inicio</Link>
          <Link to="/viajeros/alojamientos">Alojamientos</Link>
          <Link to="/anfitriones/inquilinos">Inquilinos</Link>
          <Link to="/inicio/faq">FAQ</Link>
        </nav>

        <article className={`${styles.header_user} ${isMenuOpen && styles.open}`}>
          <div className={styles.user_button} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
            <img src="/images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50" />
            <img className={styles.client_acces} src="/images/landing_page/menu_user.png" alt="logo menu user" />
          </div>
          {isMenuOpen && (
            <DropDownMenu
              userRef={userRef}
              setMenuOpen={setMenuOpen}
              menuLinks={menuLinks}
            />
          )}
        </article>
      </section>
    </header>
  )
}