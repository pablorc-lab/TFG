import { useState, useEffect, lazy } from "react";
const AnfProfilesGallery = lazy(() => import('../../../components/viajeros/alojamientos/AnfProfilesGallery'));
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';
import AnfitrionService from "../../../services/users/AnfitrionService";
import { Suspense } from "react";

export default function AlojamientosPage() {
  const [anfitriones, setAnfitriones] = useState([]);
  const [anfitrionesFiltrados, setAnfitrionesFiltrados] = useState([]);

  const [loading, setLoading] = useState(true);

  const [buscarUsuario, setBuscarUsuario] = useState(false);

  const [buscarFiltrado, setBuscarFiltrado] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    gustos: [],
    max: 0,
    min: 0,
    viajeros: null,
    habitaciones: null,
    camas: null,
    banios: null,
    idiomas: [],
    ciudad : "",
    provincia : "",
  });

  // Obtener los anfitriones
  useEffect(() => {
    // Obtener anfitriones 
    if (!buscarFiltrado && anfitriones.length === 0) {
      setLoading(true);
      AnfitrionService.getAll()
        .then(response => setAnfitriones(response.data))
        .catch(error => console.error("Error al listar los anfitriones : ", error))
        .finally(setLoading(false));
    }

    // Si se hace un buscado por filtrado
    else if (buscarFiltrado) {
      setLoading(true);
      setBuscarUsuario(false);
      
      AnfitrionService.getAnfitrionesFiltrados(filterOptions)
        .then(response => setAnfitrionesFiltrados(response.data))
        .catch(error => "Error al obtener los usuarios " + error)
        .finally(setLoading(false));
    }

  }, [filterOptions,buscarFiltrado]);


  const eliminarBuscados = () => {
    setAnfitrionesFiltrados([]);
  }


  return (
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader
        buscarFiltrado={buscarFiltrado}
        setBuscarUsuario={setBuscarUsuario}
        setAnfitrionesFiltrados={setAnfitrionesFiltrados}
        setBuscarFiltrado={setBuscarFiltrado}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />}

      {/* PERFILES DE ANFITRIONES*/}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto"}} />}>

        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}
        {!loading &&
          <AnfProfilesGallery
            anfitriones={anfitriones}
            anfitrionesFiltrados={anfitrionesFiltrados}
            buscarFiltrado={buscarFiltrado}
            buscarUsuario={buscarUsuario}
            conectados_ID={true}
            eliminarBuscados={eliminarBuscados}
          />}
      </Suspense>

      {/*Pie de pagina*/}
      <Footer />
    </>
  )
}