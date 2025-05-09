import { useState, useEffect, useRef } from 'react';
import ViajerosHeader from './ViajerosHeader';
import ViajerosMobileHeader from './ViajerosMobileHeader';
import AnfitrionService from '../../../services/users/AnfitrionService';
import FilteredCitiesList from '../../utilities/filteresCities/FilteredList';
import FilterMenu from '../filter_menu/FilterMenu';

export default function ViajerosFinalHeader({
  buscarFiltrado = false,
  defaultActive = "alojamientos",
  setBuscarUsuario = null,
  setBuscarFiltrado,
  filterOptions,
  setFilterOptions,
  setAnfitrionesFiltrados,
  setHasMoreFiltrados,
  setFiltradosObtenidos,
}) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const inputRef = useRef(null);
  const filteredCitiesListRef = useRef(null);

  const [filtrosActivos, setFiltrosActivos] = useState(0);
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
      if ((!inputRef.current || !inputRef.current.contains(event.target))&& (!filteredCitiesListRef.current || !filteredCitiesListRef.current.contains(event.target))) {
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
    // Si no hay nada escrito
    if (headerStates.location.length === 0 && setBuscarUsuario) {
      setBuscarUsuario(false);
      setBuscarFiltrado(false);
      setFilterOptions(prev => ({
        ...prev,
        ciudad: "",
        provincia: ""
      }));
    }

    else if (realizarBusqueda) {
      // Comprobamos si se está buscando por identificador
      if (headerStates.location.startsWith("@")) {
        AnfitrionService.getByPrivateID(headerStates.location.slice(1))
          .then(response => {
            setFilterOptions(prev => ({
              ...prev,
              gustos: [],
              max: 0,
              min: 0,
              viajeros: null,
              habitaciones: null,
              camas: null,
              banios: null,
              idiomas: [],
            }));
            setAnfitrionesFiltrados([response.data.usuario]);
            setHasMoreFiltrados(false);
            setFiltrosActivos(0);
          })
          .catch(error => {
            console.error("Error obteniendo anfitriones:", error)
          })
          .finally(setBuscarUsuario(true));
      }

      // Se busca por ciudad
      else {
        const [ciudad, provincia] = headerStates.location
          .split(",")
          .map(word => word.replace(/\s*\(.*?\)\s*/g, "").trim().charAt(0).toLowerCase() + word.replace(/\s*\(.*?\)\s*/g, "").trim().slice(1));

        setFilterOptions(prev => ({
          ...prev,
          ciudad: ciudad,
          provincia: provincia
        }));
        setBuscarFiltrado(true);
      }
    }

    setRealizarBusqueda(false);
  }, [realizarBusqueda, headerStates.location, buscarFiltrado])


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
          filtrosActivos={filtrosActivos}
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
          filtrosActivos={filtrosActivos}
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
          setFiltrosActivos={setFiltrosActivos}
          setHasMoreFiltrados={setHasMoreFiltrados}
          setFiltradosObtenidos={setFiltradosObtenidos}
        />
      }
    </>
  );
}
