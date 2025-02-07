import React, { useEffect, useRef, useState } from 'react';
import styles from "./DropDownMenu.module.css"
import { Link } from "react-router-dom";

const DropDownMenu = ({userRef, setMenuOpen, menuLinks}) => {
  const [isNavVisible, setNavVisible] = useState(true);
  const menu_user_Ref = useRef(null);

  // Manejar el clic fuera del menú y fuera del botón de usuario
  const handleClickOutside_Menu = (event) => {
    if (menu_user_Ref.current && !menu_user_Ref.current.contains(event.target) && !userRef.current.contains(event.target))
      setMenuOpen(false); // Cierra el menú
  };

  // Establecer navVisible a true si el ancho de la ventana es menor o igual a 860px
  const checkNavVisibility = () => {
    setNavVisible(window.innerWidth > 860);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside_Menu);     // Escuchar clics en todo el documento

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
    <div className={styles.dropdown_menu} ref={menu_user_Ref}>
    <ul>
      {menuLinks.map((link, index) => {
        if(link.hiddenWhenNavVisible) {
          return !isNavVisible && (
            <li key={index} className={(index+1 === menuLinks.filter(link => link.hiddenWhenNavVisible).length) ? styles.first_row : undefined}>
              <Link to={link.path}>
                <span>{link.label}</span>
              </Link>
            </li>
          );
        }
        
        return (
          <li key={index} className={(index === menuLinks.length-1) ? styles.last_row : undefined}>
            <Link to={link.path}>
              <span>{link.label}</span>
            </Link>
          </li>
        );
      })}
      {/*
        {!isNavVisible && (
          <>
            <li><Link to="/viajeros/alojamientos"><span>Alojamientos</span></Link></li>
            <li><Link to="/"><span>Inquilinos</span></Link></li>
            <li className={styles.first_row}><Link to="/inicio/faq"><span>FAQ</span></Link></li>
          </>
        )}
        <li><Link to="/iniciar-sesion"><span>Iniciar sesión</span></Link></li>
        <li className={styles.last_row}><Link to="/registro"><span>Registrarse</span></Link></li>
        <li><Link to="/"><span>Soporte</span></Link></li>*/}
      </ul>
    </div>
  );
}

export default DropDownMenu;
