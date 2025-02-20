import { Link } from "react-router-dom";
import styles from "./AnfitrionHeader.module.css"
import { useRef, useState } from "react";

export default function AnfitrionHeader({ headerStates, updateHeaderStates }) {
  const [activeSection, setActiveSection] = useState("inquilinos");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles.active_section : undefined;
  }

  return (
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <div>
          <h1>Bearfrens</h1>
          <h2>Anfitriones</h2>
        </div>
      </div>

      <section className={styles.search_container}>
        <nav className={styles.search_nav}>
          <Link to="/inicio">Inicio</Link>
          <Link to="/viajeros/alojamientos" className={getClassName('inquilinos')} onClick={() => updateHeaderStates({ activeSection: "alojamientos" })}> Inquilinos </Link>
          <Link to="/viajeros/alojamientos" className={getClassName('comunidades')} onClick={() => updateHeaderStates({ activeSection: "comunidades" })}>Comunidades</Link>
        </nav>
      </section>

      <section className={styles.header_user_section}>
        <button className={`${styles.header_prof_user}  ${isMenuOpen && styles.open}`} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
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
            setMenuOpen={setMenuOpen}
            menuLinks={menuLinks}
          />
        )}
      </section>
    </header>
  )
}
