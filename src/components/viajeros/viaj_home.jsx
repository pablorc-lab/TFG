import styles from "./viaj_home.module.css"

export default function Viajeros_Home() {
  return(
    <>
      {/*Cabecera*/}
      <header className={styles.header}>
        <div className={styles.header_logo}>
          <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150"/>
          <h1>Bearfren</h1>
          <h2>Viajeros</h2>
        </div>
        {/*
          <section className="header_menu">
          <nav id="header_nav">
            <a>Alojamientos</a>
            <a>Inquilinos</a>
            <a>Guía</a>
          </nav>

          <article className={`header_user  ${isMenuOpen ? "open" : ""}`}>
            <div className="user_button" onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
              <img src="images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50"/>
              <img src="images/landing_page/menu_user.png" className="client_acces"/>
            </div>
          
            <div className="dropdown_menu" ref={menu_user_Ref}>
              <ul>
                {!isNavVisible && (
                  <>
                    <li className="title_menu_header">Navegar</li>
                    <li id="li_alojamientos"><span>Alojamientos</span></li>
                    <li><span>Inquilinos</span></li>
                    <li id="li_guia"><span>Guía</span></li>
                  </>
                )}
                <li className="title_menu_header">Acceder</li>
                <li id="li_iniciar_sesion"><span>Iniciar sesión</span></li>
                <li id="li_registrate"><span>Registrarse</span></li>
                <li><span>Soporte</span></li>
              </ul>
            </div>
          </article>
        </section>
        */}
      </header>
    </>
  )
}