import { useState} from 'react';
import styles from "./ViajerosHeader.module.css"

export default function Viajeros_header({filteredList, handleInputChange, setLocationFocus, location}){
  const [username, setUsername] = useState("");

 
  return(
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <h1>Bearfrens</h1>
        <h2>Viajeros</h2>
      </div>

      <section className={styles.search_container}>
        <nav className={styles.search_nav}>
          <a href='/inicio'>Inicio</a>
          <a>Alojamientos</a>
          <a>Comunidades</a>
        </nav>

        <article className={styles.search_form_container}>
          <form className={styles.search_form}>
            <img src="/images/viajeros/lupa.webp" width="50" alt='icono lupa' />
            <input 
                type="text" 
                className={styles.searcher} 
                name="buscador" 
                placeholder="Destino" 
                spellCheck="false"
                value={location}
                onChange={handleInputChange}
                onFocus={() => setLocationFocus(true)}
                onBlur={() => {setTimeout(() => setLocationFocus(false), 200);}}
              />
            {filteredList}
          </form>

          <div className={styles.filters}>
            <img src="/images/viajeros/filtros.webp" width="50" alt="icono filtro"/>
            <span>Filtros</span>
          </div>
        </article>

      </section>


      <section className={styles.header_user_section}>
        <div className={styles.header_prof_user}>
          <img src="/images/logos/icono_user.webp" width="35" alt="icono user"/>
          <img src="/images/logos/logo_user_vacio.webp" width="40" alt="logo user vacio"/>
        </div>

        <form className={styles.user_search_form}>
          <img src="/images/logos/search_user.webp" width="40" alt="search user logo"/>
          <span>@</span>
          <input 
            type="text" 
            className={styles.user_search} 
            name="encontrar user" 
            placeholder="username" 
            spellCheck="false"
            value={username}
            onBlur={() => setUsername("")}
            maxLength={10}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </section>
    </header>
  )
}