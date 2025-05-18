import { Suspense, useEffect, useState } from "react";
import MatchesService from "../../../services/matches/MatchesService";
import ViajerosFinalHeader from "../../../components/viajeros/header/ViajerosFinalHeader";
import AnfProfilesGallery from "../../../components/viajeros/alojamientos/AnfProfilesGallery";
import Footer from "../../../components/footer/footer";
import { jwtDecode } from "jwt-decode";
import styles from "./Conexiones.module.css";

const ConexionesViajPage = () => {
  const [anfitriones, setAnfitriones] = useState([]);

  const [userID, setUserID] = useState(null);
  const [afinidad, setAfinidad] = useState(0);

  // Obtener el ID
  useEffect(() => {
    if (userID === null) {
      // Obtener el ID del usuario
      const token = localStorage.getItem("acces_token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserID(decoded.jti);
      }
    }
  }, []);

  useEffect(() => {
    if (userID) {
      // Obtener los anfitriones
      MatchesService.getAllAnfitriones(userID)
        .then(response => setAnfitriones(response.data))
        .catch(error => "Error al listar los viajeros " + error);

      MatchesService.getAfinidad("viajeros", userID)
        .then(response => setAfinidad(response.data))
        .catch(error => "Error al obtener la afinidad " + error);
    }
  }, [userID])


  const obtenerColor = (porcentaje) => {
    if (porcentaje < 50.0) return styles.rojo;
    else if (porcentaje < 70.0) return styles.naranja;
    return styles.verde;
  };
  return (
    <>
      <title>Conexiones con Anfitriones</title>

      {/* CABECERA */}
      <ViajerosFinalHeader defaultActive={"conexiones"} />

      <section className={styles.conexionSection}>
        <h1 className={styles.titulo}>
          {anfitriones.length} {anfitriones.length === 1 ? "match establecido" : "matches establecidos"}
        </h1>

        <article className={`${styles.barraContainer} ${obtenerColor(afinidad)}`}>
          <h1>Tasa de matches : {afinidad.toFixed(0)} %</h1>
          <div className={styles.barraFondo}>
            <div className={styles.barraProgreso} style={{ width: `${afinidad}%` }} />
          </div>
        </article>
      </section>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <AnfProfilesGallery anfitriones={anfitriones} match={true} />
      </Suspense>

      <Footer />
    </>
  )
}

export default ConexionesViajPage;
