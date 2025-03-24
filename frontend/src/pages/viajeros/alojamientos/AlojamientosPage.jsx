import { useState, useEffect, lazy } from "react";
const AnfProfilesGallery = lazy(() => import('../../../components/viajeros/alojamientos/AnfProfilesGallery'));
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';
import AnfitrionService from "../../../services/users/AnfitrionService";
import { Suspense } from "react";

export default function AlojamientosPage() {
  const [anfitriones, setAnfitriones] = useState([]);
  const [anfitrionesEspecificos, setAnfitrionesEspecificos] = useState([]);

  // Obtener los anfitriones
  useEffect(() => {
    // Obtener anfitriones
    AnfitrionService.getAllConDatos().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      setAnfitriones(response.data);
      //console.log(response.data)
    }).catch(error => console.error("Error al listar los usuarios : ", error));
  }, []);

  return (
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader setAnfitrionesEspecificos={setAnfitrionesEspecificos} />}

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{width:"350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <AnfProfilesGallery anfitriones={anfitriones} anfitrionesEspecificos={anfitrionesEspecificos} />
      </Suspense>

      {/*Pie de pagina*/}
      <Footer />
    </>
  )
}