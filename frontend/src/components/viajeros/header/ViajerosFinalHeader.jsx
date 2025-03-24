import { useState, useEffect, useRef } from 'react';

import React from 'react';
import ViajerosHeader from './ViajerosHeader';
import ViajerosMobileHeader from './ViajerosMobileHeader';
import AnfitrionService from '../../../services/users/AnfitrionService';

export default function ViajerosFinalHeader({ buscarUsuario, setBuscarUsuario, setAnfitrionesEspecificos,}) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const inputRef = useRef(null);
  const filteredListRef = useRef(null);
  const [activeSection, setActiveSection] = useState("alojamientos");
  const [realizarBusqueda, setRealizarBusqueda] = useState(false);
  const [headerStates, setHeaderStates] = useState({
    locationFocus: false,
    location: ""
  })
  // Actualizar objeto de estado
  const updateHeaderStates = (newState) => setHeaderStates(prev => ({...prev, ...newState })); 

  useEffect(() => {
    // Controlar click fuera del input para cerrar el menú de listas filtradas
    const handleClickOutside = (event) => {
      if ( (!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))){
        updateHeaderStates({locationFocus : false});
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  // Controlar el cambnio de pantalla
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 770);
    handleResize();
    window.addEventListener('resize', handleResize);
    // Limpiar el event listener cuando el componente se desmonta
    return () => { window.removeEventListener('resize', handleResize); };
  }, [isLargeScreen]);


  // Realizar busuqeda de usuario
  useEffect(() => {
    if(headerStates.location.length === 0) {
      setBuscarUsuario(false);
      setAnfitrionesEspecificos([]);
    }

    if (realizarBusqueda) {
      const [ciudad, provincia] = headerStates.location
        .split(",")
        .map(word => word.replace(/\s*\(.*?\)\s*/g, "").trim().charAt(0).toLowerCase() + word.replace(/\s*\(.*?\)\s*/g, "").trim().slice(1));

      AnfitrionService.getViviendasPorUbicacion(ciudad, provincia)
        .then(response => {
          setAnfitrionesEspecificos(response.data);
        })
        .catch(error => {
          console.error("Error obteniendo anfitriones:", error);
        })
        .finally(() => {
          setBuscarUsuario(true);
          setRealizarBusqueda(false);
        });      
    }
  }, [realizarBusqueda, headerStates.location])


  return (
    <>
      {isLargeScreen
        ? <ViajerosHeader 
            inputRef={inputRef} 
            filteredListRef={filteredListRef} 
            headerStates={headerStates} 
            updateHeaderStates={updateHeaderStates} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setRealizarBusqueda={setRealizarBusqueda}
          />
        : <ViajerosMobileHeader 
            inputRef={inputRef} 
            filteredListRef={filteredListRef} 
            headerStates={headerStates} 
            updateHeaderStates={updateHeaderStates} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setAnfitrionesEspecificos={setAnfitrionesEspecificos}
            setBuscarUsuario={setBuscarUsuario}
            buscarUsuario={buscarUsuario}
          />
      }
    </>
  );
}
