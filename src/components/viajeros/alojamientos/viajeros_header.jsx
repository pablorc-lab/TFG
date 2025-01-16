import { useState} from 'react';
import styles from "./viajeros_header.module.css"

export default function Viajeros_header({children, handleInputChange, setLocationFocus, location}){
  const [username, setUsername] = useState("");

  const handleOnChange_searchUser = (e) => {
    if (e.target.value === '' || e.target.value[0] !== '@') {
      setUsername('@');
    } 
    else 
      setUsername(e.target.value);
  };

  return(
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
            <img src="images/viajeros/lupa.webp" width="50" alt='icono lupa' />
            <input 
                type="text" 
                className={styles.searcher} 
                name="buscador" 
                placeholder="Destino" 
                value={location}
                onChange={handleInputChange}
                onFocus={() => setLocationFocus(true)}
                onBlur={() => {setTimeout(() => setLocationFocus(false), 200);}}
              />
            {children}
          </form>

          <div className={styles.filters}>
            <img src="images/viajeros/filtros.webp" width="50" />
            <span>Filtros</span>
          </div>
        </article>

      </section>


      <section className={styles.header_user_section}>
        <div className={styles.header_prof_user}>
          <img src="images/logos/icono_user.webp" width="35" />
          <img src="images/logos/logo_user_vacio.webp" width="40" />
        </div>

        <form className={styles.user_search_form}>
          <img src="images/logos/search_user.webp" width="40" />
          <input 
            type="text" 
            className={styles.user_search} 
            name="encontrar user" 
            placeholder="@username" 
            value={username}
            onFocus={() => {username === '' && setUsername('@');}}
            onBlur={() => setUsername("")}
            onChange={handleOnChange_searchUser}
          />
        </form>
      </section>
    </header>
  )
}