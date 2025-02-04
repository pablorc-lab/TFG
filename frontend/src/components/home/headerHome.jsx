import { useEffect, useState, useRef } from "react";
import styles from "./headerHome.module.css"
import { Link } from "react-router-dom";

export default function HeaderHome({ isHome = false }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNavVisible, setNavVisible] = useState(true);
  const userRef = useRef(null);
  const menu_user_Ref = useRef(null);

  // Manejar el clic fuera del menú y fuera del botón de usuario
  const handleClickOutside_Menu = (event) => {
    if (menu_user_Ref.current && !menu_user_Ref.current.contains(event.target) && !userRef.current.contains(event.target))
      setMenuOpen(false); // Cierra el menú
  };

   // Establecer navVisible a true si el ancho de la ventana es menor o igual a 769px
    const checkNavVisibility = () => {
      setNavVisible(window.innerWidth > 769);
    };
  
    useEffect(() => {
      // Cambia el título solo al montar el componente
      document.title = "Inicio | Beafrens";
  
      // Escuchar clics en todo el documento
      document.addEventListener("mousedown", handleClickOutside_Menu);
     
      checkNavVisibility();
      window.addEventListener("resize", checkNavVisibility); // Cada vez que cambie el tamaño de la ventana se evalua
  
      // Función de limpieza (esto se ejecutará cuando el componente se desmonta o antes de que se ejecute de nuevo el efecto).
      // Asegura que se elimine el evento cuando el componente ya no esté en la página.
      return () => {
        //Eliminar los evento cuando el componente se desmonta.
        // Evita que el manejador de eventos siga activo cuando el componente ya no esté visible.
        document.removeEventListener("mousedown", handleClickOutside_Menu);
        window.removeEventListener("resize", checkNavVisibility);
      };
    }, []);

  return (
    <header className={`${styles.header} ${isHome && styles.isHome}`}>
      <Link to="/inicio">
        <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" style={{ cursor: "pointer" }} />
      </Link>

      <section className={styles.header_menu}>
        <nav className={styles.header_nav}>
        <Link to="/inicio">Inicio</Link>
        <Link to="/viajeros/alojamientos">Alojamientos</Link>
        <Link to="/">Inquilinos</Link>
        <Link to="/inicio/faq">FAQ</Link>
        </nav>

        <article className={`${styles.header_user} ${isMenuOpen && styles.open}`}>
          <div className={styles.user_button} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
            <img src="/images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50" />
            <img className={styles.client_acces} src="/images/landing_page/menu_user.png" alt="logo menu user" />
          </div>

          <div className={styles.dropdown_menu} ref={menu_user_Ref}>
            <ul>
              {!isNavVisible && (
                <>
                  <li><Link to="/viajeros/alojamientos"><span>Alojamientos</span></Link></li>
                  <li><Link to="/"><span>Inquilinos</span></Link></li>
                  <li className={styles.guia_menu_header}><Link to="/inicio/faq"><span>FAQ</span></Link></li>
                </>
              )}
              <li><Link to="/iniciar-sesion"><span>Iniciar sesión</span></Link></li>
              <li className={styles.li_registrate}><Link to="/registro"><span>Registrarse</span></Link></li>
              <li><Link to="/"><span>Soporte</span></Link></li>
            </ul>
          </div>
        </article>
      </section>
    </header>
  )
}