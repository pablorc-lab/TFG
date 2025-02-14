import { useState, useEffect, useRef } from 'react';

import React from 'react';
import ViajerosHeader from './ViajerosHeader';
import ViajerosMobileHeader from './ViajerosMobileHeader';

export default function ViajerosFinalHeader() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const inputRef = useRef(null);
  const filteredListRef = useRef(null);

  const [headerStates, setHeaderStates] = useState({
    activeSection: "alojamientos",
    locationFocus: false,
    location: ""
  })
  // Actualizar objeto de estado
  const updateHeaderStates = (newState) => setHeaderStates(prev => ({...prev, ...newState })); 

  useEffect(() => {
    updateHeaderStates({activeSection : "alojamientos"});

    // Controlar click fuera del input para cerrar el menú de listas filtradas
    const handleClickOutside = (event) => {
      if ( (!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))){
        updateHeaderStates({locationFocus : false});
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 770);
    handleResize();
    window.addEventListener('resize', handleResize);
    // Limpiar el event listener cuando el componente se desmonta
    return () => { window.removeEventListener('resize', handleResize); };
  }, [isLargeScreen]);

  return (
    <>
      {isLargeScreen
        ? <ViajerosHeader inputRef={inputRef} filteredListRef={filteredListRef} headerStates={headerStates} updateHeaderStates={updateHeaderStates}/>
        : <ViajerosMobileHeader inputRef={inputRef} filteredListRef={filteredListRef} headerStates={headerStates} updateHeaderStates={updateHeaderStates}/>
      }
    </>
  );
}
