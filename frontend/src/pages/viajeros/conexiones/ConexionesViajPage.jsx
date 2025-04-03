import { lazy, Suspense, useEffect, useState } from "react";
import MatchesService from "../../../services/matches/MatchesService";
import ViajerosFinalHeader from "../../../components/viajeros/header/ViajerosFinalHeader";
import Anf_Profiles_Gallery from "../../../components/viajeros/alojamientos/AnfProfilesGallery";

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
      {<ViajerosFinalHeader defaultActive={"conexiones"}/>}

      <h1 style={{
        fontFamily: "Nunito",
        fontSize: "clamp(16px, 6vw, 43px)",
        color: "#0a7273",
        textAlign: "center",
        margin: "clamp(30px,10vw,80px) 50px 10px 50px",
        paddingBottom: "clamp(30px,8vw,50px)",
        borderBottom: "2px solid rgb(160, 160, 160)"
      }}>
        {anfitriones.length} conexiones establecidas
      </h1>

{/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <Anf_Profiles_Gallery anfitriones={anfitriones} match={true}/>
      </Suspense>
    </>
  )
}

export default ConexionesViajPage;
