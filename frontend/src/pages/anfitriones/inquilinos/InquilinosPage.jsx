import { lazy, Suspense, useEffect, useState } from "react";
import ViajeroService from "../../../services/users/ViajeroService";
import styles from "./Filter.module.css"
import LikesService from "../../../services/matches/LikesService";

import FilterMenu from "../../../components/anfitriones/filter_menu/FilterMenu";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));

export default function InquilinosPage() {
  const [viajeros, SetViajeros] = useState([]);
  const [viajerosFiltrados, setViajerosFiltrados] = useState([]);
  const [biografias, setBiografias] = useState([]);

  const [conectados_ID, SetConectados_ID] = useState([]);

  const [openFilterMenu, setOpenFilterMenu] = useState(null)
  const [buscarFiltrado, setBuscarFiltrado] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    gustos: [],
    idiomas: [],
    tiempo_estancia : []
  });

  /**
   * Comprueba si el vajero pasado cumple los requisitos del filtrado
   * @param viajero Objeto del viajero con su información
   * @returns True si cumple el filtrado
   */
  function ViajeroFiltradoCorrecto(viajero, biografia) {
    let opcionesCumplidas = true; // Indica si el anfitrion cumple todo

    // Verificamos si `filterOptions.gustos` no está vacío
    if (filterOptions.gustos.length > 0) {
      const gustosViajeros = [viajero.gusto1.toLowerCase(), , viajero.gusto2.toLowerCase(), viajero.gusto3.toLowerCase()];
      opcionesCumplidas &= gustosViajeros.some(gusto => filterOptions.gustos.includes(gusto));
    }

    if(filterOptions.tiempo_estancia !== ""){
      opcionesCumplidas &= filterOptions.tiempo_estancia.includes(viajero.tiempo_estancia);
    }
    // Si `filterOptions.idiomas` no está vacío
    if (filterOptions.idiomas.length > 0) {
      if (biografia == null) return false;
      const idiomas = biografia.idiomas.split(",");
      opcionesCumplidas &= idiomas.some(idioma => filterOptions.idiomas.some(filtro => filtro === idioma))
    }

    return opcionesCumplidas;
  }

  // Obtener los viajeros
  useEffect(() => {
    if (viajeros.length === 0) {
      // Obtener anfitriones
      ViajeroService.getAllConDatos().then(response => {
        // Obtener el id de cada anfitrion y su vivienda
        SetViajeros(response.data.map(item => item.usuario));
        setBiografias(response.data.map(item => item.biografia));
        //console.log(response.data)
      }).catch(error => console.error("Error al listar los usuarios : ", error));
    }
  
    if (buscarFiltrado && biografias.length > 0){
      const viajerosFiltrados = viajeros.map(viajero => {
        const biografia = biografias.find(bio => bio.usuarioID === viajero.id) || null;
        return ViajeroFiltradoCorrecto(viajero, biografia) && viajero;
      }).filter(Boolean)
      setViajerosFiltrados(viajerosFiltrados);
      //console.log(viajerosFiltrados);
    }

    else if(!buscarFiltrado && viajerosFiltrados.length > 0){
      setViajerosFiltrados([]);
    }

    if (conectados_ID.length === 0) {
      // Obtener usuarios a los que se ha enviado el ike
      LikesService.getAllEnviados("anfitriones", 1).then(response => {
        SetConectados_ID(response.data.map(usuario => usuario.usuarioID));
      }).catch(error => "Error al obtener los likes " + error)
    }
  }, [buscarFiltrado, filterOptions]);


  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader />

      <article className={styles.filters_container}>
        <div className={styles.filters} onClick={() => setOpenFilterMenu(true)}>
          <img src="/images/viajeros/filtros.webp" width="50" alt="icono filtro" />
          <span>Filtros</span>
        </div>
      </article>

      {openFilterMenu &&
        <FilterMenu
          setOpenFilterMenu={setOpenFilterMenu}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          setBuscarFiltrado={setBuscarFiltrado}
          setViajerosFiltrados={setViajerosFiltrados}
        />
      }

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery 
          viajeros={viajeros} 
          viajerosFiltrados={viajerosFiltrados} 
          conectados_ID={conectados_ID} 
          buscarFiltrado={buscarFiltrado}
        />
      </Suspense>
    </>
  )
}
