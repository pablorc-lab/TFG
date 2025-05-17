import { Link } from "react-router-dom";
import styles_mobile from "./AnfitrionMobileHeader.module.css"

export default function AnfitrionMobileHeader({ activeSection, setActiveSection, SetOpenLikesMenu }) {

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles_mobile.active_section : undefined;
  }

  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <Link to="/anfitriones/foros">
            <div className={getClassName('foros')} onClick={() => setActiveSection("foros")}>
              <img src="/images/viajeros/comunidades_header.webp" width="50" alt='icono comunidades' />
              <span>Foros</span>
            </div>
          </Link>

          <Link to="/anfitriones/inquilinos">
            <div className={getClassName('inquilinos')} onClick={() => setActiveSection("inquilinos")}>
              <img src="/images/viajeros/inquilinos.svg" width="50" alt='icono inquilinos' />
              <span>Inquilinos</span>
            </div>
          </Link>

          <Link to="/anfitriones/conexiones">
            <div className={getClassName('conexiones')} onClick={() => setActiveSection("conexiones")}>
              <img src="/images/viajeros/conexiones.svg" width="50" alt='icono conexiones' />
              <span>Conexiones</span>
            </div>
          </Link>
          
          <Link to="/anfitriones/mi-cuenta">
            <img
              className={getClassName('perfil')}
              src="/images/viajeros/user_header.webp"
              width="55"
              alt='icono user'
              onClick={() => setActiveSection("perfil")}
            />
          </Link>
        </nav>
      </header>

      {/*Sección del usuario*/}
      <div className={styles_mobile.conectado_container} onClick={() => SetOpenLikesMenu(true)}>
        <img src="/images/usuarios/heart_green.svg" className={styles_mobile.conectado} />
      </div>
    </>
  )
}
