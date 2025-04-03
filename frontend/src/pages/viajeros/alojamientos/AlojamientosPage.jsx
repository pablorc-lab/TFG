import { useState, useEffect, lazy } from "react";
const AnfProfilesGallery = lazy(() => import('../../../components/viajeros/alojamientos/AnfProfilesGallery'));
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';
import AnfitrionService from "../../../services/users/AnfitrionService";
import LikesService from "../../../services/matches/LikesService";
import { Suspense } from "react";

export default function AlojamientosPage() {
  const [anfitriones, setAnfitriones] = useState([]);
  const [anfitrionesEspecificos, setAnfitrionesEspecificos] = useState([]);
  const [buscarUsuario, setBuscarUsuario] = useState(false);
  const [conectados_ID, SetConectados_ID] = useState([]);

  // Obtener los anfitriones
  useEffect(() => {
    // Obtener anfitriones
    AnfitrionService.getAll().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      setAnfitriones(response.data);
      //console.log(response.data)
    }).catch(error => console.error("Error al listar los usuarios : ", error));

    // Obtener usuarios a los que se ha enviado el like
    LikesService.getAllEnviados("viajeros", 1).then(response => {
      SetConectados_ID(response.data.map(usuario => usuario.usuarioID));
    }).catch(error => "Error al obtener los likes " + error)
  }, []);

  return (
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader buscarUsuario={buscarUsuario} setBuscarUsuario={setBuscarUsuario} setAnfitrionesEspecificos={setAnfitrionesEspecificos} />}

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <AnfProfilesGallery
          anfitriones={anfitriones}
          anfitrionesEspecificos={anfitrionesEspecificos}
          buscarUsuario={buscarUsuario}
          conectados_ID={conectados_ID}
        />
      </Suspense>

      {/*Pie de pagina*/}
      <Footer />
    </>
  )
}