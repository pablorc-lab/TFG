import { lazy } from "react";
import styles_mobile from "./ViajerosMobileHeader.module.css"
import { Link } from 'react-router-dom';
const SearchAlojamiento = lazy(() => import("../alojamientos/SearchAlojamiento"));

export default function ViajerosMobileHeader({
  inputRef = null,
  filteredCitiesListRef = null,
  FilteredCitiesList,
  setOpenFilterMenu,
  headerStates = null,
  updateHeaderStates = null,
  activeSection = "alojamientos",
  setActiveSection,
  setRealizarBusqueda,
  filtrosActivos
}) {
  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles_mobile.active_section : undefined;
  }

  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <Link to="/viajeros/foros">
            <div className={getClassName('foros')} onClick={() => setActiveSection("foros")}>
              <img
                src={`/images/viajeros/comunidades_header.webp`}
                width="50"
                alt='icono foros'
              />
              <span>Foros</span>
            </div>
          </Link>

          <Link to="/viajeros/alojamientos">
            <div className={getClassName('alojamientos')} onClick={() => setActiveSection("alojamientos")}>
              <img src={`/images/viajeros/house_header.webp`} width="50" alt='icono casa' />
              <span>Alojamientos</span>
            </div>
          </Link>

          <Link to="/viajeros/conexiones">
            <div className={getClassName('conexiones')} onClick={() => setActiveSection("conexiones")}>
              <img src="/images/viajeros/conexiones.svg" width="50" alt='icono conexiones' />
              <span>Matches</span>
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
          filteredListRef={filteredCitiesListRef}
          setOpenFilterMenu={setOpenFilterMenu}
          FilteredList={FilteredCitiesList}
          headerStates={headerStates}
          updateHeaderStates={updateHeaderStates}
          setRealizarBusqueda={setRealizarBusqueda}
          filtrosActivos={filtrosActivos}
        />
      }

    </>
  )
}

