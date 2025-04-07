import { useState, useEffect, useRef } from 'react';
import ViajerosHeader from './ViajerosHeader';
import ViajerosMobileHeader from './ViajerosMobileHeader';
import AnfitrionService from '../../../services/users/AnfitrionService';
import FilteredCitiesList from '../../utilities/filteresCities/FilteredList';
import FilterMenu from '../filter_menu/FilterMenu';

export default function ViajerosFinalHeader({
  defaultActive = "alojamientos",
  setBuscarUsuario = null,
  buscarUsuario = false,
  setAnfitrionesEspecificos,
  setBuscarFiltrado,
  filterOptions,
  setFilterOptions,
  setAnfitrionesFiltrados
}) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const inputRef = useRef(null);
  const filteredCitiesListRef = useRef(null);

  const [openFilterMenu, setOpenFilterMenu] = useState(null)

  const [activeSection, setActiveSection] = useState(defaultActive);
  const [realizarBusqueda, setRealizarBusqueda] = useState(false);
  const [headerStates, setHeaderStates] = useState({
    locationFocus: false,
    location: ""
  })

  // Actualizar objeto de estado
  const updateHeaderStates = (newState) => setHeaderStates(prev => ({ ...prev, ...newState }));

  /**
   * Controlar click fuera del input para cerrar el menú de ciudades filtradas
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((!inputRef.current || !inputRef.current.contains(event.target))
        && (!filteredCitiesListRef.current || !filteredCitiesListRef.current.contains(event.target))) {
        updateHeaderStates({ locationFocus: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  /**
   * Controlar el cambio de pantalla
   */
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 770);
    handleResize();
    window.addEventListener('resize', handleResize);
    // Limpiar el event listener cuando el componente se desmonta
    return () => { window.removeEventListener('resize', handleResize); };
  }, [isLargeScreen]);


  /**
   * Realizar búsqueda de usuario por ciudad o identificador
   */
  useEffect(() => {
    if (headerStates.location.length === 0 && setBuscarUsuario != null) {
      setBuscarUsuario(false);
      setAnfitrionesEspecificos([]);
    }

    else if (realizarBusqueda) {
      // Comprobamos si se está buscando por identificador
      if (headerStates.location.charAt(0) === "@") {
        AnfitrionService.getByPrivateID(headerStates.location.slice(1))
          .then(response => setAnfitrionesEspecificos([response.data.usuario]))
          .catch(error => {
            console.error("Error obteniendo anfitriones:", error);
            setAnfitrionesEspecificos([]);
          })
          .finally(() => {
            setBuscarUsuario(true);
          });
      }

      // Se busca por ciudad
      else {
        const [ciudad, provincia] = headerStates.location
          .split(",")
          .map(word => word.replace(/\s*\(.*?\)\s*/g, "").trim().charAt(0).toLowerCase() + word.replace(/\s*\(.*?\)\s*/g, "").trim().slice(1));

        AnfitrionService.getViviendasPorUbicacion(ciudad, provincia)
          .then(response => setAnfitrionesEspecificos(response.data))
          .catch(error => console.error("Error obteniendo anfitriones:", error))
          .finally(() => {
            setBuscarUsuario(true);
          });
      }
    }

    setRealizarBusqueda(false);
  }, [realizarBusqueda, headerStates.location])


  return (
    <>
      {isLargeScreen
        ? <ViajerosHeader
          inputRef={inputRef}
          filteredCitiesListRef={filteredCitiesListRef}
          FilteredCitiesList={FilteredCitiesList}
          setOpenFilterMenu={setOpenFilterMenu}
          headerStates={headerStates}
          updateHeaderStates={updateHeaderStates}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setRealizarBusqueda={setRealizarBusqueda}
        />
        : <ViajerosMobileHeader
          inputRef={inputRef}
          filteredCitiesListRef={filteredCitiesListRef}
          FilteredCitiesList={FilteredCitiesList}
          setOpenFilterMenu={setOpenFilterMenu}
          headerStates={headerStates}
          updateHeaderStates={updateHeaderStates}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setRealizarBusqueda={setRealizarBusqueda}
        />
      }

      {/* Abrir menú de filtrado*/}
      {openFilterMenu &&
        <FilterMenu
          setOpenFilterMenu={setOpenFilterMenu}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          setBuscarFiltrado={setBuscarFiltrado}
          setAnfitrionesFiltrados={setAnfitrionesFiltrados}
        />
      }
    </>
  );
}
