import { lazy } from "react";
import styles_mobile from "./ViajerosMobileHeader.module.css"
import { Link } from 'react-router-dom';
const SearchAlojamiento = lazy(() => import("../alojamientos/SearchAlojamiento"));

export default function ViajerosMobileHeader({ inputRef = null, filteredListRef = null, FilteredList, headerStates = null, updateHeaderStates = null, activeSection = "alojamientos", setActiveSection }) {
  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles_mobile.active_section : undefined;
  }

  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <Link to="/viajeros/alojamientos">
            <div className={getClassName('alojamientos')} onClick={() => setActiveSection("alojamientos")}>
              <img src={`/images/viajeros/house_header.webp`} width="50" alt='icono casa' />
              <span>Alojamientos</span>
            </div>
          </Link>

          <Link to="/viajeros/alojamientos">
          <div className={getClassName('comunidades')} onClick={() => setActiveSection("comunidades")}>
            <img
              src={`/images/viajeros/comunidades_header.webp`}
              width="50"
              alt='icono comunidades'
            />
            <span>Grupos</span>
            </div>
          </Link>

          <Link to="/viajeros/conexiones">
            <div className={getClassName('conexiones')} onClick={() => setActiveSection("conexiones")}>
              <img src="/images/viajeros/conexiones.svg" width="50" alt='icono conexiones' />
              <span>Conexiones</span>
            </div>
          </Link>

          <Link to="/viajeros/mi-cuenta">
            <img
              className={getClassName('perfil')}
              src={`/images/viajeros/user_header.webp`}
              width="55"
              alt='icono user'
            />
          </Link>
        </nav>
      </header>

      {/*Buscador siempre que estemos en alojamientos*/}
      {activeSection === 'alojamientos' && 
        <SearchAlojamiento 
          inputRef={inputRef} 
          filteredListRef={filteredListRef}
          FilteredList={FilteredList}
          headerStates={headerStates}
          updateHeaderStates={updateHeaderStates}
        />
      }

    </>
  )
}

