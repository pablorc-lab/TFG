import { Link } from "react-router-dom";
import styles from "./AnfitrionHeader.module.css"
import { useEffect, useRef, useState } from "react";
import DropDownMenu from "../../dropdown_menu/DropDownMenu";


export default function AnfitrionHeader({ activeSection, setActiveSection, menuLinks, SetOpenLikesMenu }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeaderNav, setShowHeaderNav] = useState(window.innerWidth > 1050);
  const userRef = useRef(null);

  // Añadimos al menu de anfitriones los nuevos de navegación para escritorio
  const anfMenuLinks = [
    { path: "/inicio/", label: "Foros", hiddenWhenNavVisible: true },
    { path: "/anfitriones/inquilinos", label: "Inquilinos", hiddenWhenNavVisible: true },
    { path: "/anfitriones/conexiones", label: "Conexiones", hiddenWhenNavVisible: true },
  ].concat(menuLinks);

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles.active_section : undefined;
  }

  useEffect(() => {
    const handleResize = () => setShowHeaderNav(window.innerWidth > 1050);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showHeaderNav]);

  return (
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <div>
          <h1>Bearfrens</h1>
          <h2>Anfitriones</h2>
        </div>
      </div>

      {showHeaderNav && (
        <section className={styles.search_container}>
          <nav className={styles.search_nav}>
            <Link to="/anfitriones/foros" className={getClassName('foros')} onClick={() => setActiveSection("foros")}>Foros</Link>
            <Link to="/anfitriones/inquilinos" className={getClassName('inquilinos')} onClick={() => setActiveSection("inquilinos")}> Inquilinos </Link>
            <Link to="/anfitriones/conexiones" className={getClassName('conexiones')} onClick={() => setActiveSection("conexiones")}>Conexiones</Link>
          </nav>
        </section>
      )}

      <section className={styles.user_section}>
        <div className={styles.conectado_container} onClick={() => SetOpenLikesMenu(true)}>
          <img src="/images/usuarios/heart_green.svg" className={styles.conectado} alt="likes"/>
        </div>

        <div className={styles.header_user_section}>
          <button className={`${styles.header_prof_user}  ${isMenuOpen && styles.open}`} onClick={() => setIsMenuOpen(!isMenuOpen)} ref={userRef}>
            <img src="/images/logos/logo_usuario_blanco.png" width="40" alt="logo user vacio" />
            <article>
              <div></div>
              <div></div>
              <div></div>
            </article>
          </button>
          {isMenuOpen && (
            <DropDownMenu
              userRef={userRef}
              setIsMenuOpen={setIsMenuOpen}
              menuLinks={anfMenuLinks}
              visibleWidth={1050}
              activeSection={activeSection}
            />
          )}
        </div>
      </section>



    </header>
  )
}
