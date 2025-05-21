import { lazy, Suspense, useEffect, useState } from "react";
import ViajeroService from "../../../services/users/ViajeroService";
import styles from "./Filter.module.css"

import FilterMenu from "../../../components/anfitriones/filter_menu/FilterMenu";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));

export default function InquilinosPage() {
  const [viajeros, SetViajeros] = useState([]);
  const [viajerosFiltrados, setViajerosFiltrados] = useState([]);
  const [privateID, setPrivateID] = useState("");

  const [viajerosObtenidos, setViajerosObtenidos] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Comprueba si hay mas viajeros por buscar

  const [hasMoreFiltrados, setHasMoreFiltrados] = useState(true); // Comprueba si hay mas viajeros por buscar filtrados
  const [filtradosObtenidos, setFiltradosObtenidos] = useState(0);

  const [loading, setLoading] = useState(true);

  const [filtrosActivos, setFiltrosActivos] = useState(0);
  const [openFilterMenu, setOpenFilterMenu] = useState(null)
  const [buscarFiltrado, setBuscarFiltrado] = useState(false);
  const [buscarUsuario, setBuscarUsuario] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    gustos: [],
    idiomas: [],
    tiempo_estancia: []
  });

  // Obtener los viajeros
  useEffect(() => {
    if (hasMore && !buscarFiltrado) {
      if (viajeros.length == 0) {
        setLoading(true);
      }

      // Obtener viajeros
      ViajeroService.getAllPaginacion(viajerosObtenidos, 6)
        .then(response => {
          console.log(response);
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
      if (viajeros.length > 0) {
        SetViajeros([]);
        setViajerosObtenidos(0);
        setHasMore(true);
      } else {
        setLoading(true);
      }

      ViajeroService.getViajerosFiltrados(filterOptions, filtradosObtenidos, 6)
        .then(response => {
          if (viajerosFiltrados.length === 0) {
            setViajerosFiltrados(response.data.data)
          } else {
            setViajerosFiltrados(prev => [...prev, ...response.data.data])
          }
          setHasMoreFiltrados(response.data.hasMore);
        })
        .catch(error => "Error al obtener los usuarios " + error)
        .finally(setLoading(false));
    }
  }, [buscarFiltrado, filtradosObtenidos, filterOptions]);

  // Buscar un usuario dado un ID privado
  const buscarIDPrivado = () => {
    ViajeroService.getByPrivateID(privateID.trim())
      .then(response => {
        setViajerosFiltrados([response.data.usuario]);
        setBuscarUsuario(true);

        // Borrar filtros
        setFiltrosActivos(0);
        setFilterOptions({
          gustos: [],
          idiomas: [],
          tiempo_estancia: []
        });
        setHasMoreFiltrados(true);
        setBuscarFiltrado(false);
      })
      .catch(error => "Error al buscar el usuario " + error);
  }

  useEffect(() => {
    if (buscarUsuario && privateID == "") {
      setBuscarUsuario(false);
      setViajerosFiltrados([]);
    }
  }, [privateID]);
  
  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader />

      <article className={styles.filters_container}>
        <form className={styles.search_form}>
          <img src="/images/viajeros/lupa.webp" width="50" alt='icono lupa' onClick={() => buscarIDPrivado()} />
          <input
            type="text"
            className={styles.searcher}
            name="buscador"
            placeholder="@usuario"
            spellCheck="false"
            value={privateID === "" ? "" : "@" + privateID}
            onChange={(e) => setPrivateID(e.target.value.replace(/^@/, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                buscarIDPrivado();
              }
            }}
          />
        </form>
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
            buscarUsuario={buscarUsuario}
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
