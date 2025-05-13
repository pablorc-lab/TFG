import { useState, useEffect, lazy, Suspense } from "react";
const AnfProfilesGallery = lazy(() => import('../../../components/viajeros/alojamientos/AnfProfilesGallery'));
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';
import AnfitrionService from "../../../services/users/AnfitrionService";

export default function AlojamientosPage() {
  const [anfitriones, setAnfitriones] = useState([]);
  const [anfitrionesFiltrados, setAnfitrionesFiltrados] = useState([]);

  const [anfitrionesObtenidos, setAnfitrionesObtenidos] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Comprueba si hay mas anfitriones por buscar

  const [hasMoreFiltrados, setHasMoreFiltrados] = useState(true); // Comprueba si hay mas anfitriones por buscar filtrados
  const [filtradosObtenidos, setFiltradosObtenidos] = useState(0);

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
    ciudad: "",
    provincia: "",
  });

  useEffect(() => {
    if (hasMore && !buscarFiltrado && !buscarUsuario) {
      if (anfitriones.length == 0) {
        setLoading(true);
      }

      AnfitrionService.getAllPaginacion(anfitrionesObtenidos, 6)
        .then(response => {
          setAnfitriones(prev => [...prev, ...response.data.data])
          setHasMore(response.data.hasMore);
        })
        .catch(error => console.error("Error al listar los anfitriones : ", error))
        .finally(() => setLoading(false));
    }
  }, [anfitrionesObtenidos, buscarFiltrado, buscarUsuario]);

  // Si se activa un nuevo filtro llamar desde 0
  useEffect(() => {
    if (buscarFiltrado && hasMoreFiltrados) {
      // Limpiar los usuarios anteriores buscados
      if (anfitriones.length > 0) {
        setAnfitriones([]);
        setAnfitrionesObtenidos(0);
        setHasMore(true);
      } else {
        setLoading(true);
      }
      
      setBuscarUsuario(false);

      AnfitrionService.getAnfitrionesFiltrados(filterOptions, filtradosObtenidos, 6)
        .then(response => {
          if (anfitrionesFiltrados.length === 0) {
            setAnfitrionesFiltrados(response.data.data)
          } else {
            setAnfitrionesFiltrados(prev => [...prev, ...response.data.data])
          }
          setHasMoreFiltrados(response.data.hasMore);
        })
        .catch(error => console.error("Error al obtener los usuarios ", error))
        .finally(() => setLoading(false));
    }
  }, [buscarFiltrado, filtradosObtenidos, filterOptions]);


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
        setHasMoreFiltrados={setHasMoreFiltrados}
        setFiltradosObtenidos={setFiltradosObtenidos}
      />}

      {/* PERFILES DE ANFITRIONES*/}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}>

        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}
        {!loading &&
          <AnfProfilesGallery
            anfitriones={anfitriones}
            anfitrionesFiltrados={anfitrionesFiltrados}
            buscarFiltrado={buscarFiltrado}
            buscarUsuario={buscarUsuario}
            setAnfitrionesObtenidos={setAnfitrionesObtenidos}
            setFiltradosObtenidos={setFiltradosObtenidos}
            hasMore={hasMore}
            hasMoreFiltrados={hasMoreFiltrados}
          />}
      </Suspense>

      {/*Pie de pagina*/}
      <Footer />
    </>
  )
}