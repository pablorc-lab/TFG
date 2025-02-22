import styles_mobile from "./AnfitrionMobileHeader.module.css"

export default function AnfitrionMobileHeader({activeSection, setActiveSection}) {

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles_mobile.active_section : undefined;
  }

  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <div className={getClassName('alojamientos')} onClick={() => setActiveSection("alojamientos")}>
            <img src="/images/viajeros/inquilinos.svg" width="50" alt='icono inquilinos'/>
            <span>Inquilinos</span>
          </div>
          <div className={getClassName('comunidades')} onClick={() => setActiveSection("comunidades")}>
            <img src="/images/viajeros/comunidades_header.webp" width="50" alt='icono comunidades'/>
            <span>Comunidades</span>
          </div>
          <img
            className={getClassName('perfil')}
            src="/images/viajeros/user_header.webp"
            width="55"
            alt='icono user'
            onClick={() => setActiveSection("perfil")}
          />
        </nav>
      </header>
    </>
  )
}
