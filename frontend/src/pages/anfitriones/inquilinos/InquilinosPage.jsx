import { lazy, Suspense, useEffect, useState } from "react";
import ViajeroService from "../../../services/users/ViajeroService";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));

export default function InquilinosPage() {
  const [viajeros, SetViajeros] = useState([]);

  // Obtener los viajeros
  useEffect(() => {
    // Obtener anfitriones
    ViajeroService.getAll().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      SetViajeros(response.data);
      //console.log(response.data)
    }).catch(error => console.error("Error al listar los usuarios : ", error));
  }, []);


  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader />

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery viajeros={viajeros} />
      </Suspense>
    </>
  )
}
