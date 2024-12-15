import styles_mobile from "./viaj_viviendas_mobile.module.css"

export default function Viajeros_header_mobile({ activeSection, setActiveSection }) {
  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <div onClick={() => setActiveSection('alojamientos')}>
            <img 
              src={`images/viajeros/house_header${activeSection === 'alojamientos' ? '_active' : ''}.webp`} 
              width="50" 
              alt='icono casa' 
            />
            <span className={activeSection === 'alojamientos' ? styles_mobile.active_section : ''}>Alojamientos</span>
          </div>

          <div onClick={() => setActiveSection('comunidades')}>
            <img 
            src={`images/viajeros/comunidades_header${activeSection === 'comunidades' ? '_active' : ''}.webp`} 
            width="50" 
            alt='icono comunidades' 
            />
            <span className={activeSection === 'comunidades' ? styles_mobile.active_section : ''}>Comunidades</span>
          </div>

          <img 
            className={styles_mobile.user_icon} 
            src={`images/viajeros/user_header${activeSection === 'perfil' ? '_active' : ''}.webp`} 
            width="55"
            alt='icono user' 
            onClick={() => setActiveSection('perfil')}
          />
        </nav>
      </header>

      {/*Buscador*/}
      <article className={styles_mobile.search_form_container}>
        <form className={styles_mobile.search_form}>
          <div>
            <img src="images/viajeros/lupa_mobile.webp" width="50" alt='icono lupa' />
            <input type="text" className={styles_mobile.searcher} name="buscador" placeholder="Destino" />
          </div>
          <div>
            <img src="images/logos/search_user_active.webp" width="50" alt='icono usuario lupa' />
            <input type="text" className={styles_mobile.searcher} name="buscador" placeholder="@username" />
          </div>
        </form>

        <img className={styles_mobile.filters} src="images/viajeros/filtros.webp" width="50" alt='icono filtros' />
      </article>
    </>
  )
}

