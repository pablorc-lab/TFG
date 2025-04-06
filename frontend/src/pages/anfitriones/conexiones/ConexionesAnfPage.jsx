import { lazy, Suspense, useEffect, useState } from "react";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));
import MatchesService from "../../../services/matches/MatchesService";

const ConexionesAnfPage = () => {
  const [viajeros, setViajeros] = useState([]);

  // Cargar viajeros
  useEffect(() => {
    MatchesService.getAllViajeros(1).then(response => setViajeros(response.data))
      .catch(error => "Error al listar los viajeros " + error);
  }, [])

  return (
    <>
      <title>Conexiones con Viajeros</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader activeSectionDefecto={"conexiones"} />

      <h1 style={{
        fontFamily: "Nunito",
        fontSize: "clamp(16px, 6vw, 43px)",
        color: "#0a7273",
        textAlign: "center",
        margin: "50px 50px 0px 50px",
        paddingBottom: "50px",
        borderBottom: "2px solid rgba(160, 160, 160, 0.5)"
      }}>
        {viajeros.length} conexiones establecidas
      </h1>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery viajeros={viajeros} match={true} />
      </Suspense>
    </>
  )
}

export default ConexionesAnfPage;
