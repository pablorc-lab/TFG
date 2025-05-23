import { useEffect, useRef, useState } from 'react';
import styles from "./ViajerosHeader.module.css"
import { Link, useNavigate } from "react-router-dom";
import DropDownMenu from '../../dropdown_menu/DropDownMenu';
import AuthService from '../../../services/authentication/AuthService';

export default function ViajerosHeader({
  inputRef,
  filteredCitiesListRef,
  FilteredCitiesList,
  setOpenFilterMenu,
  headerStates,
  updateHeaderStates,
  activeSection,
  setActiveSection,
  setRealizarBusqueda,
  filtrosActivos
}) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const userRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/inicio");
    AuthService.logout();
  }

  const menuLinks = [
    { path: "/viajeros/mi-cuenta", label: <strong>Mi Cuenta</strong> },
    { path: "/inicio/faq", label: "FAQ" },
    { path: "/inicio/soporte", label: "Soporte" },
    { label: <div onClick={handleLogout}>Cerrar sesión</div> }
  ];

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (activeSection === nameSection) ? styles.active_section : undefined;
  }

  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY === 0); // solo muestra cuando esté en top
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${!showNav ? styles.headerNav : ""} ${activeSection !== "alojamientos" ? styles.sinInqulinos : ""}`}>
      <div className={styles.header_logo}>
        <img src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <div>
          <h1>Bearfrens</h1>
          <h2>Viajeros</h2>
        </div>
      </div>

      <section className={styles.search_container}>
        {(showNav || activeSection !== "alojamientos") && (
          <nav className={styles.search_nav}>
            <Link to="/viajeros/foros" className={getClassName('foros')} onClick={() => setActiveSection("foros")}>Foros</Link>
            <Link to="/viajeros/alojamientos" className={getClassName('alojamientos')} onClick={() => setActiveSection("alojamientos")}> Alojamientos </Link>
            <Link to="/viajeros/conexiones" className={getClassName('conexiones')} onClick={() => setActiveSection("conexiones")}>Matches</Link>
          </nav>
        )}
        {/* Barra de bússqueda para ALOJAMIENTOS*/}
        {activeSection === "alojamientos" &&
          <article className={`${styles.search_form_container} ${activeSection !== "alojamientos" ? styles.inactive_form : undefined}`}>
            <form className={styles.search_form}>
              <img src="/images/viajeros/lupa.webp" width="50" alt='icono lupa' onClick={() => setRealizarBusqueda(true)} />
              <input
                ref={inputRef}
                type="text"
                className={styles.searcher}
                name="buscador"
                placeholder="Destino o @usuario"
                spellCheck="false"
                value={headerStates.location}
                onChange={(e) => updateHeaderStates({ location: e.currentTarget.value })}
                onFocus={() => updateHeaderStates({ locationFocus: true })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Evita que el formulario se envíe
                    setRealizarBusqueda(true);
                  }
                }}
              />
              {headerStates.locationFocus && headerStates.location &&
                <FilteredCitiesList
                  filteredListRef={filteredCitiesListRef}
                  listStates={headerStates}
                  updateListStates={updateHeaderStates}
                  setRealizarBusqueda={setRealizarBusqueda}
                  scrollDesktop={!showNav}
                />}
            </form>

            <div className={`${styles.filters} ${filtrosActivos > 0 ? styles.filters_active : ""}`} onClick={() => setOpenFilterMenu(true)}>
              <img src="/images/viajeros/filtros.webp" width="50" alt="icono filtro" />
              <span>Filtros</span>
              {filtrosActivos > 0 && <p>{filtrosActivos}</p>}
            </div>
          </article>
        }
      </section>

      <section className={styles.header_user_section}>
        <button className={`${styles.header_prof_user}  ${isMenuOpen && styles.open}`} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
          <img src="/images/logos/logo_usuario_blanco.png" width="40" alt="logo user vacio" />
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
            activeSection={activeSection}
          />
        )}
      </section>
    </header>
  )
}