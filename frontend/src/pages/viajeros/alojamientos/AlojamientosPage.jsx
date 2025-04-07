import { useState, useEffect, lazy } from "react";
const AnfProfilesGallery = lazy(() => import('../../../components/viajeros/alojamientos/AnfProfilesGallery'));
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';
import AnfitrionService from "../../../services/users/AnfitrionService";
import LikesService from "../../../services/matches/LikesService";
import { Suspense } from "react";

export default function AlojamientosPage() {
  const [anfitriones, setAnfitriones] = useState([]);
  const [anfitrionesEspecificos, setAnfitrionesEspecificos] = useState([]);
  const [anfitrionesFiltrados, setAnfitrionesFiltrados] = useState([]);
  const [biografias, setBiografias] = useState([]);

  const [buscarUsuario, setBuscarUsuario] = useState(false);
  const [conectados_ID, SetConectados_ID] = useState([]);

  const [buscarFiltrado, setBuscarFiltrado] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    gustos: [],
    max: 0,
    min: 0,
    viajeros: -1,
    habitaciones: -1,
    camas: -1,
    banios: -1,
    idiomas: [],
  });

  /**
   * Comprueba si el anfitrion pasado cumple los requisitos del filtrado
   * @param anfitrion Objeto del anfitrion con su información
   * @returns True si cumple el filtrado
   */
  function AnfitrionFiltradoCorrecto(anfitrion, biografia) {
    let opcionesCumplidas = true; // Indica si el anfitrion cumple todo

    // Verificamos si `filterOptions.gustos` no está vacío
    if (filterOptions.gustos.length > 0) {
      const gustosAnfitrion = [anfitrion.gusto1.toLowerCase(), , anfitrion.gusto2.toLowerCase(), anfitrion.gusto3.toLowerCase()];
      opcionesCumplidas &= gustosAnfitrion.some(gusto => filterOptions.gustos.includes(gusto));
    }

    // Verificamos si el rango de precio está modificado
    if (filterOptions.max > 0) {
      let precio_en_rango = anfitrion.vivienda.precio_noche >= filterOptions.min
      precio_en_rango &= anfitrion.vivienda.precio_noche <= filterOptions.max;
      opcionesCumplidas &= precio_en_rango;
    }

    // Filtrar por número de viajeros
    if (filterOptions.viajeros !== -1) opcionesCumplidas &= anfitrion.vivienda.viajeros === filterOptions.viajeros;

    // Filtrar por número de habitaciones
    if (filterOptions.habitaciones !== -1) opcionesCumplidas &= anfitrion.vivienda.habitaciones === filterOptions.habitaciones;

    // Filtrar por número de camas
    if (filterOptions.camas !== -1) opcionesCumplidas &= anfitrion.vivienda.camas === filterOptions.camas;

    // Filtrar por número de baños
    if (filterOptions.banios !== -1) opcionesCumplidas &= anfitrion.vivienda.banios === filterOptions.banios;

    // Si `filterOptions.idiomas` no está vacío
    if (filterOptions.idiomas.length > 0) {
      if (biografia == null) return false;
      const idiomas = biografia.idiomas.split(",");
      opcionesCumplidas &= idiomas.some(idioma => filterOptions.idiomas.some(filtro => filtro === idioma))
    }

    return opcionesCumplidas;
  }

  // Obtener los anfitriones
  useEffect(() => {
    // Obtener anfitriones y sus biografias
    if (anfitriones.length === 0) {
      AnfitrionService.getAllConDatos().then(response => {
        setAnfitriones(response.data.map(item => item.usuario));
        setBiografias(response.data.map(item => item.biografia));
        //console.log(response.data)
      }).catch(error => console.error("Error al listar los usuarios : ", error));
    }

    // Si se hace un buscado por filtrado
    if (buscarFiltrado && biografias.length > 0) {
      const UsuarioAMapear = buscarUsuario && anfitrionesEspecificos.length > 0 ? anfitrionesEspecificos : anfitriones;

      // Obtener las biografias y pasarle a cada anfitrión la suya
      const anfitrionesFiltrados = UsuarioAMapear.map(anfitrion => {
        const biografia = biografias.find(bio => bio.usuarioID === anfitrion.id) || null;
        return AnfitrionFiltradoCorrecto(anfitrion, biografia) && anfitrion;
      }).filter(Boolean)
      
      setAnfitrionesFiltrados(anfitrionesFiltrados);
    }

    else if(!buscarFiltrado && anfitrionesFiltrados.length > 0){
      setAnfitrionesFiltrados([]);
    }

    // Obtener usuarios a los que se ha enviado el like
    if (conectados_ID.length === 0) {
      LikesService.getAllEnviados("viajeros", 1).then(response => {
        SetConectados_ID(response.data.map(usuario => usuario.usuarioID));
      }).catch(error => "Error al obtener los likes " + error)
    }
  }, [filterOptions, buscarUsuario, buscarFiltrado]);


  const eliminarBuscados = () => {
    setAnfitrionesEspecificos([]);
    setAnfitrionesFiltrados([]);
  } 

  
  return (
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader
        buscarUsuario={buscarUsuario}
        setBuscarUsuario={setBuscarUsuario}
        setAnfitrionesEspecificos={setAnfitrionesEspecificos}
        setAnfitrionesFiltrados={setAnfitrionesFiltrados}
        setBuscarFiltrado={setBuscarFiltrado}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />}

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <AnfProfilesGallery
          anfitriones={anfitriones}
          anfitrionesEspecificos={anfitrionesEspecificos}
          anfitrionesFiltrados={anfitrionesFiltrados}
          buscarFiltrado={buscarFiltrado}
          buscarUsuario={buscarUsuario}
          conectados_ID={conectados_ID}
          eliminarBuscados={eliminarBuscados}
        />
      </Suspense>

      {/*Pie de pagina*/}
      <Footer />
    </>
  )
}