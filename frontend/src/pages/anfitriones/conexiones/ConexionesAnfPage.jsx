import { lazy, Suspense, useEffect, useState } from "react";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
const ViajProfilesGallery = lazy(() => import("../../../components/anfitriones/inquilinos/ViajProfilesGallery"));
import Footer from "../../../components/footer/footer";
import MatchesService from "../../../services/matches/MatchesService";
import { jwtDecode } from "jwt-decode";
import styles from "./Conexiones.module.css";

const ConexionesAnfPage = () => {
  const [viajeros, setViajeros] = useState([]);

  const [userID, setUserID] = useState(null);
  const [afinidad, setAfinidad] = useState(0.0);

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

  // Cargar viajeros
  useEffect(() => {
    if (!userID) return;
    MatchesService.getAllViajeros(userID)
      .then(response => setViajeros(response.data))
      .catch(error => "Error al listar los viajeros " + error);

    MatchesService.getAfinidad("anfitriones", userID)
      .then(response => setAfinidad(response.data))
      .catch(error => "Error al obtener la afinidad " + error);

  }, [userID])

  const obtenerColor = (porcentaje) => {
    if (porcentaje < 50.0) return styles.rojo;
    else if (porcentaje < 70.0) return styles.naranja;
    return styles.verde;
  };

  const [contador, setContador] = useState(0);

  useEffect(() => {
    let inicio = 0;
    const fin = Math.round(afinidad);

    const animar = setInterval(() => {
      inicio += 1;
      if (inicio >= fin) {
        inicio = fin;
        clearInterval(animar);
      }
      setContador(inicio);
    }, 12);

    return () => clearInterval(animar);
  }, [afinidad]);

  return (
    <>
      <title>Conexiones con Viajeros</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader activeSectionDefecto={"matches"} />

      <section className={styles.conexionSection}>
        <h1 className={styles.titulo}>
          {viajeros.length} {viajeros.length === 1 ? "conexión establecida" : "conexiones establecidas"}
        </h1>

        <article className={`${styles.barraContainer} ${obtenerColor(afinidad)}`}>
          <h1>Tasa de matches : {String(contador).padStart(2, '0')} %</h1>
          <div className={styles.barraFondo}>
            <div className={styles.barraProgreso} style={{ width: `${afinidad}%` }} />
          </div>
        </article>
      </section>

      {/* PERFILES DE VIAJEROS  */}
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "300px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        <ViajProfilesGallery viajeros={viajeros} match={true} />
      </Suspense>

      {viajeros.length === 0 &&
        <h1 style={{ marginBottom: "45vh", marginTop: "15vh", fontFamily: "Nunito", textAlign: "center", fontSize: "40px", padding: "30px" }}>
          Aun no has hecho ningun match
        </h1>
      }
      <Footer />
    </>
  )
}

export default ConexionesAnfPage;
