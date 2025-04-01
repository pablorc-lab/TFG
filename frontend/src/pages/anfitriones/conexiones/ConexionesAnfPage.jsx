import { lazy, Suspense } from "react";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));
import ViajData from "../../../data/viajeros/viaj_data.json";

const ConexionesAnfPage = () => {
  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader activeSectionDefecto={"conexiones"}/>

      <h1 style={{ fontFamily: "Nunito", fontSize: "clamp(16px, 6vw, 43px)", textAlign: "center", margin: "80px 20px 20px 20px" }}>  
        {ViajData.length} conexiones establecidas
      </h1>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery viajeros={ViajData} />
      </Suspense>
    </>
  )
}

export default ConexionesAnfPage;
