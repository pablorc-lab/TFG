import React, { useState, useEffect } from 'react';
import Viajeros_header from './viajeros_header';
import Viajeros_header_mobile from './viajeros_mobile_header';

export default function Viajeros_Viviendas({ defaultActiveSection = "alojamientos" }) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const [activeSection, setActiveSection] = useState(defaultActiveSection);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 770);
    };
    window.addEventListener('resize', handleResize);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {window.removeEventListener('resize', handleResize);};
  }, [isLargeScreen]);

  return(
    <>
      {isLargeScreen 
        ? <Viajeros_header/> 
        : <Viajeros_header_mobile  activeSection={activeSection} setActiveSection={setActiveSection}/>
      }
    </>
  )
}