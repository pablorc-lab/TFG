import { useEffect, useState } from "react"
import AnfitrionHeader from "./AnfitrionHeader"
import AnfitrionMobileHeader from "./AnfitrionMobileHeader";
import { useNavigate } from "react-router-dom";
import LikesMenu from "../likes_menu/LikesMenu";
import { jwtDecode } from "jwt-decode";
import AuthService from "../../../services/authentication/AuthService";

export default function AnfitrionFinalHeader({ activeSectionDefecto = "inquilinos" }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);
  const [userID, setUserID] = useState(null);
  const [activeSection, setActiveSection] = useState(activeSectionDefecto);
  const [OpenLikesMenu, SetOpenLikesMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Obtener el ID
  useEffect(() => {
    if (userID === null) {
      // Obtener el ID del usuario
      const token = localStorage.getItem("acces_token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserID(decoded.jti);
      }
    }
  });

  const handleLogout = () => {
    navigate("/inicio");
    AuthService.logout();
  }

  const menuLinks = [
    { path: "/anfitriones/mi-cuenta", label: <strong>Mi Cuenta</strong> },
    { path: "/inicio/faq", label: "FAQ" },
    { path: "/inicio/soporte", label: "Soporte" },
    { label: <div onClick={handleLogout}>Cerrar sesión</div> }
  ];

  return (
    <>
      {isMobile
        ? <AnfitrionMobileHeader activeSection={activeSection} setActiveSection={setActiveSection} SetOpenLikesMenu={SetOpenLikesMenu} />
        : <AnfitrionHeader activeSection={activeSection} setActiveSection={setActiveSection} menuLinks={menuLinks} SetOpenLikesMenu={SetOpenLikesMenu} />
      }

      {OpenLikesMenu &&
        <LikesMenu SetOpenLikesMenu={SetOpenLikesMenu} anfitrionID={OpenLikesMenu ? userID : null} />
      }
    </>
  )

}
