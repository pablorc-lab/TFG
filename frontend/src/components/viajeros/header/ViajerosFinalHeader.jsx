import { useState, useEffect, useRef } from 'react';

import React from 'react';
import ViajerosHeader from './ViajerosHeader';
import ViajerosMobileHeader from './ViajerosMobileHeader';
import AnfitrionService from '../../../services/users/AnfitrionService';
import FilteredList from '../../utilities/filteresCities/FilteredList';
import FilterMenu from '../filter_menu/FilterMenu';

export default function ViajerosFinalHeader({ defaultActive = "alojamientos", buscarUsuario = false, setBuscarUsuario = null, setAnfitrionesEspecificos = [], filtrado = false}) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const inputRef = useRef(null);
  const filteredListRef = useRef(null);

  const [openFilterMenu, setOpenFilterMenu] = useState(null)

  const [activeSection, setActiveSection] = useState(defaultActive);
  const [realizarBusqueda, setRealizarBusqueda] = useState(false);
  const [headerStates, setHeaderStates] = useState({
    locationFocus: false,
    location: ""
  })

  // Actualizar objeto de estado
  const updateHeaderStates = (newState) => setHeaderStates(prev => ({...prev, ...newState })); 

  /**
   * Controlar click fuera del input para cerrar el menú de ciudades filtradas
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ( (!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))){
        updateHeaderStates({locationFocus : false});
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  /**
   * Controlar el cambnio de pantalla
   */
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 770);
    handleResize();
    window.addEventListener('resize', handleResize);
    // Limpiar el event listener cuando el componente se desmonta
    return () => { window.removeEventListener('resize', handleResize); };
  }, [isLargeScreen]);


  /**
   * Realizar busuqeda de usuario
   */
  useEffect(() => {
    if(headerStates.location.length === 0 && setBuscarUsuario != null) {
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


  //TODO: Realizar búsqueda de usuario segun filtros

  return (
    <>
      {isLargeScreen
        ? <ViajerosHeader 
            inputRef={inputRef} 
            filteredListRef={filteredListRef} 
            FilteredList={FilteredList}
            setOpenFilterMenu={setOpenFilterMenu}
            headerStates={headerStates} 
            updateHeaderStates={updateHeaderStates} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setRealizarBusqueda={setRealizarBusqueda}
          />
        : <ViajerosMobileHeader 
            inputRef={inputRef} 
            filteredListRef={filteredListRef} 
            FilteredList={FilteredList}
            headerStates={headerStates} 
            updateHeaderStates={updateHeaderStates} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setAnfitrionesEspecificos={setAnfitrionesEspecificos}
            setBuscarUsuario={setBuscarUsuario}
            buscarUsuario={buscarUsuario}
          />
      }

      {/* Abrir menú de filtrado*/}
      {openFilterMenu && <FilterMenu setOpenFilterMenu={setOpenFilterMenu}/>}
    </>
  );
}
