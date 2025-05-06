import { Suspense, useEffect, useState } from "react";
import MatchesService from "../../../services/matches/MatchesService";
import ViajerosFinalHeader from "../../../components/viajeros/header/ViajerosFinalHeader";
import AnfProfilesGallery from "../../../components/viajeros/alojamientos/AnfProfilesGallery";
import Footer from "../../../components/footer/footer";

const ConexionesViajPage = () => {
  const [anfitriones, setAnfitriones] = useState([]);

  // Cargar viajeros
  useEffect(() => {
    MatchesService.getAllAnfitriones(1).then(response => setAnfitriones(response.data))
      .catch(error => "Error al listar los viajeros " + error);
  }, [])

  return (
    <>
      <title>Conexiones con Anfitriones</title>

      {/* CABECERA */}
      <ViajerosFinalHeader defaultActive={"conexiones"} />

      <h1 style={{
        fontFamily: "Nunito",
        fontSize: "clamp(16px, 6vw, 43px)",
        color: "#0a7273",
        textAlign: "center",
        margin: "50px 50px 0px 50px",
        paddingBottom: "50px",
        borderBottom: "2px solid rgba(160, 160, 160, 0.5)"
      }}>
        {anfitriones.length} {anfitriones.length === 1 ? "conexión establecida" : "conexiones establecidas"} 
      </h1>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <AnfProfilesGallery anfitriones={anfitriones} match={true} />
      </Suspense>

      <Footer />
    </>
  )
}

export default ConexionesViajPage;
