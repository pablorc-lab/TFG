import { useEffect, useState } from "react"
import AnfitrionHeader from "./AnfitrionHeader"
import AnfitrionMobileHeader from "./AnfitrionMobileHeader";

export default function AnfitrionFinalHeader() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770);
  const [activeSection, setActiveSection] = useState("alojamientos")

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const menuLinks = [
    { path: "/viajeros/mi-cuenta", label: <strong>Mi Cuenta</strong>},
    { path: "/inicio/faq", label: "FAQ"},
    { path: "/", label: "Soporte" }
  ];

  return  (
    <>
      {isMobile 
        ? <AnfitrionMobileHeader activeSection={activeSection} setActiveSection={setActiveSection}/> 
        : <AnfitrionHeader activeSection={activeSection} setActiveSection={setActiveSection} menuLinks={menuLinks}/>
      }
    </>
  )
  
}
