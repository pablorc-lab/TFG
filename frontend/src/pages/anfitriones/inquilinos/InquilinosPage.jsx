import { lazy, Suspense, useEffect, useState } from "react";
import ViajeroService from "../../../services/users/ViajeroService";
import styles from "./Filter.module.css"

import FilterMenu from "../../../components/anfitriones/filter_menu/FilterMenu";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));

export default function InquilinosPage() {

  const [viajeros, SetViajeros] = useState([]);
  const [viajerosFiltrados, setViajerosFiltrados] = useState([]);

  const [viajerosObtenidos, setViajerosObtenidos] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Comprueba si hay mas viajeros por buscar

  const [hasMoreFiltrados, setHasMoreFiltrados] = useState(true); // Comprueba si hay mas viajeros por buscar filtrados
  const [filtradosObtenidos, setFiltradosObtenidos] = useState(0);

  const [loading, setLoading] = useState(true);

  const [filtrosActivos, setFiltrosActivos] = useState(0);
  const [openFilterMenu, setOpenFilterMenu] = useState(null)
  const [buscarFiltrado, setBuscarFiltrado] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    gustos: [],
    idiomas: [],
    tiempo_estancia: []
  });

  // Obtener los viajeros
  useEffect(() => {
    if (hasMore && !buscarFiltrado) {
      setLoading(true);
      // Obtener viajeros
      ViajeroService.getAllPaginacion(viajerosObtenidos, 6)
        .then(response => {
          SetViajeros(prev => [...prev, ...response.data.data])
          setHasMore(response.data.hasMore);
        })        
        .catch(error => console.error("Error al listar los usuarios : ", error))
        .finally(setLoading(false));
    }
  }, [viajerosObtenidos, buscarFiltrado]);

  // Obtener los filtrados
  useEffect(() => {
    if (buscarFiltrado) {
       // Limpiar los usuarios anteriores buscados
       if(viajeros.length > 0){
        SetViajeros([]);
        setViajerosObtenidos(0);
        setHasMore(true);
      }

      setLoading(true);
      ViajeroService.getViajerosFiltrados(filterOptions, filtradosObtenidos, 3)
        .then(response => {
          if(viajerosFiltrados.length === 0){
            setViajerosFiltrados(response.data.data)
          } else{
            setViajerosFiltrados(prev => [...prev, ...response.data.data])
          }
          setHasMoreFiltrados(response.data.hasMore);
        })
        .catch(error => "Error al obtener los usuarios " + error)
        .finally(setLoading(false));
    }
  }, [buscarFiltrado, filtradosObtenidos, filterOptions]);


  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader />

      <article className={styles.filters_container}>
        <div className={`${styles.filters} ${filtrosActivos > 0 ? styles.filters_active : ""}`} onClick={() => setOpenFilterMenu(true)}>
          <img src="/images/viajeros/filtros.webp" width="50" alt="icono filtro" />
          <span>Filtros</span>
          {filtrosActivos > 0 && <p>{filtrosActivos}</p>}
        </div>
      </article>

      {openFilterMenu &&
        <FilterMenu
          setOpenFilterMenu={setOpenFilterMenu}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          setBuscarFiltrado={setBuscarFiltrado}
          setViajerosFiltrados={setViajerosFiltrados}
          setFiltrosActivos={setFiltrosActivos}
          setFiltradosObtenidos={setFiltradosObtenidos}
          setHasMoreFiltrados={setHasMoreFiltrados}
        />
      }

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}>
        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}

        {!loading &&
          <ViajProfilesGallery
            viajeros={viajeros}
            viajerosFiltrados={viajerosFiltrados}
            buscarFiltrado={buscarFiltrado}
            hasMore={hasMore}
            hasMoreFiltrados={hasMoreFiltrados}
            setViajerosObtenidos={setViajerosObtenidos}
            setFiltradosObtenidos={setFiltradosObtenidos}
          />
        }
      </Suspense>
    </>
  )
}
