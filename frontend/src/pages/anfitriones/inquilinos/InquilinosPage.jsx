import { lazy, Suspense, useEffect, useState } from "react";
import ViajeroService from "../../../services/users/ViajeroService";
import styles from "./Filter.module.css"

import FilterMenu from "../../../components/anfitriones/filter_menu/FilterMenu";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));

export default function InquilinosPage() {

  const [viajeros, SetViajeros] = useState([]);
  const [viajerosFiltrados, setViajerosFiltrados] = useState([]);

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
    if (viajeros.length === 0) {
      setLoading(true);
      // Obtener viajeros
      ViajeroService.getAll()
        .then(response => SetViajeros(response.data))
        .catch(error => console.error("Error al listar los usuarios : ", error))
        .finally(setLoading(false));
    }

    if (buscarFiltrado) {
      setLoading(true);
      ViajeroService.getViajerosFiltrados(filterOptions)
        .then(response => setViajerosFiltrados(response.data))
        .catch(error => "Error al obtener los usuarios " + error)
        .finally(setLoading(false));
    }

    else if (!buscarFiltrado && viajerosFiltrados.length > 0) {
      setViajerosFiltrados([]);
    }


  }, [buscarFiltrado, filterOptions]);


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
        />
      }

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}>
        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)", margin: "25vh auto" }} />}

        {!loading &&
          <ViajProfilesGallery
            viajeros={viajeros}
            viajerosFiltrados={viajerosFiltrados}
            conectados_ID={true}
            buscarFiltrado={buscarFiltrado}
          />
        }
      </Suspense>
    </>
  )
}
