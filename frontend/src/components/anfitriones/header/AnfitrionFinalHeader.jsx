import { lazy, Suspense, useEffect, useState } from "react"
import AnfitrionHeader from "./AnfitrionHeader"
import AnfitrionMobileHeader from "./AnfitrionMobileHeader";
import { useNavigate } from "react-router-dom";
const LikesMenu = lazy(() => import("../likes_menu/LikesMenu"));

export default function AnfitrionFinalHeader({ activeSectionDefecto = "inquilinos", anfitrionID = null }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);
  const [activeSection, setActiveSection] = useState(activeSectionDefecto);
  const [OpenLikesMenu, SetOpenLikesMenu] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const handleLogout = () => {
    localStorage.clear();

    navigate("/inicio");

    //TODO : HACER LLAMADA A LA API EN LOGOUT PARA ELIMINAR ESE TOKEN
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
        ? <AnfitrionMobileHeader activeSection={activeSection} setActiveSection={setActiveSection} SetOpenLikesMenu={SetOpenLikesMenu}/>
        : <AnfitrionHeader activeSection={activeSection} setActiveSection={setActiveSection} menuLinks={menuLinks} SetOpenLikesMenu={SetOpenLikesMenu}/>
      }

      {OpenLikesMenu &&
        <Suspense>
          <LikesMenu SetOpenLikesMenu={SetOpenLikesMenu} anfitrionID={1}/>
        </Suspense>
      }
    </>
  )

}
