import React, { useState, useEffect } from 'react';
import styles from "./viaj_viviendas.module.css"
import styles_mobile from "./viaj_viviendas_mobile.module.css"

export default function Viajeros_Viviendas() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 770);
    };

    // Agregar event listener para el redimensionamiento
    window.addEventListener('resize', handleResize);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLargeScreen]);

  return(
    <>
      {/*Cabecera*/}
      <section style={{ display: !isLargeScreen ? 'none' : 'block' }}>
        <header className={styles.header}>
          <div className={styles.header_logo}>
            <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
            <h1>Bearfrens</h1>
            <h2>Viajeros</h2>
          </div>

          <section className={styles.search_container}>
            <nav className={styles.search_nav}>
              <ul>
                <li>Inicio</li>
                <li>Alojamientos</li>
                <li>Comunidades</li>
              </ul>
            </nav>

            <article className={styles.search_form_container}>
              <form className={styles.search_form}>
                <img src="images/viajeros/lupa.webp" width="50" alt='icono lupa'/>
                <input type="text" className={styles.searcher} name="buscador" placeholder="Destino" />
              </form>

              <div className={styles.filters}>
                <img src="images/viajeros/filtros.webp" width="50" />
                <span>Filtros</span>
              </div>
            </article>

          </section>


          <section className={styles.header_user_section}>
            <div className={styles.header_prof_user}>
              <img src="images/logos/icono_user.webp" width="40" />
              <img src="images/logos/logo_user_vacio.webp" width="50" />
            </div>

            <form className={styles.user_search_form}>
              <img src="images/logos/search_user.webp" width="40" />
              <input type="text" className={styles.user_search} name="encontrar user" placeholder="@username" />
            </form>
          </section>
        </header>
      </section>
      
      <section style={{display: isLargeScreen ? 'none' : 'block' }}>
        <header className={styles_mobile.header}>
          <nav className={styles_mobile.search_nav}>
            <div>
              <img src="images/viajeros/house_header_active.webp" width="50" alt='icono casa' />
              <span>Alojamientos</span>
            </div>

            <div>
              <img src="images/viajeros/comunidades_header.webp" width="50" alt='icono comunidades' />
              <span>Comunidades</span>
            </div>

            <img className={styles_mobile.user_icon} src="images/viajeros/user_header.webp" width="55" alt='icono user' />
          </nav>
        </header>

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

          <img className={styles_mobile.filters} src="images/viajeros/filtros.webp" width="50" alt='icono filtros'/>
          
        </article>
      </section>
    </>
  )
}