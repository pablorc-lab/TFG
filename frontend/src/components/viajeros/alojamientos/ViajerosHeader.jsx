import { useRef, useState} from 'react';
import styles from "./ViajerosHeader.module.css"
import { Link } from "react-router-dom";
import DropDownMenu from '../../dropdown_menu/DropDownMenu';

export default function ViajerosHeader({filteredList, handleInputChange, setLocationFocus, location}){
  const [username, setUsername] = useState("");
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
  
  return(
    <header className={styles.header}>
      <div className={styles.header_logo}>
        <img src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <div>
          <h1>Bearfrens</h1>
          <h2>Viajeros</h2>
        </div>
      </div>

      <section className={styles.search_container}>
        <nav className={styles.search_nav}>
          <Link to="/inicio">Inicio</Link>
          <Link to="/viajeros/alojamientos">Alojamientos</Link>
          <Link to="/">Comunidades</Link>
        </nav>

        <article className={styles.search_form_container}>
          <form className={styles.search_form}>
            <img src="/images/viajeros/lupa.webp" width="50" alt='icono lupa' />
            <input 
                type="text" 
                className={styles.searcher} 
                name="buscador" 
                placeholder="Destino o @usuario" 
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


      <section className={`${styles.header_user_section}`}>
        <button className={`${styles.header_prof_user}  ${isMenuOpen && styles.open}`} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
          
          <img src="/images/logos/logo_usuario_blanco.png" width="40" alt="logo user vacio"/>
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