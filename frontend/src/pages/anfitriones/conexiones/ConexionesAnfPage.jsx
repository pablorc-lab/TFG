import { lazy, Suspense, useEffect, useState } from "react";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));
import MatchesService from "../../../services/matches/MatchesService";
import styles from "./ConexionesAnfPage.module.css";

const ConexionesAnfPage = () => {
  const [anfitriones, setAnfitriones] = useState([]);

  // Cargar viajeros
  useEffect(() => {
    MatchesService.getAllViajeros(1)
    .then(response => setAnfitriones(response.data))
    .catch(error => "Error al listar los viajeros " + error)
  }, [])

  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader activeSectionDefecto={"conexiones"}/>

      <h1 className={styles.titulo}>  
        {anfitriones.length} conexiones establecidas
      </h1>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery viajeros={anfitriones} conectado={true}/>
      </Suspense>
    </>
  )
}

export default ConexionesAnfPage;
