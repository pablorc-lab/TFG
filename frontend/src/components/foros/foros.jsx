import styles from './foros.module.css';
import { useEffect, useRef, useState } from 'react';
import ForosService from '../../services/foros/ForosService';
import { jwtDecode } from 'jwt-decode';

const Foros = ({ tipoUsuario }) => {
  const [loading, setLoading] = useState(true);

  const [userID, setUserID] = useState(null);

  const verMasRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [forosData, setForosData] = useState([]);
  const [lastFecha, setLastFecha] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (verMasRef.current && forosData.length > 0) {
      verMasRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [forosData]);

  // Función para obtener los foros con paginación
  const obtenerForos = (fecha) => {
    setLoading(true);
    ForosService.getForosPorCursor(10, fecha)
      .then(response => {
        setForosData(prev => [...prev, ...response.data.data]);
        setLastFecha(response.data.lastFecha);
        setHasMore(response.data.hasMore);
      })
      .catch(error => console.error("Error al obtener los foros:", error))
      .finally(() => setLoading(false));
  };


  // Llamada inicial para obtener los foros con fecha null
  useEffect(() => {
    if (userID === null) {
      // Obtener el ID del usuario
      const token = localStorage.getItem("acces_token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserID(decoded.jti);
      }
    }

    if (forosData.length === 0) {
      obtenerForos(null);
    }
  }, []);

  const crearForo = () => {
    ForosService.crearForo(tipoUsuario, userID, descripcion)
      .then(response => setForosData(prev => [response.data, ...prev]))
      .catch(error => console.error("Error al CREAR el foro:", error))
  }

  return (
    <main className={styles.forosContainer}>
      <section className={styles.add_foro}>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={styles.textarea}
          placeholder="Comparte algo con la comunidad..."
          rows="4"
        />
        <button
          disabled={descripcion === "" && userID !== null}
          className={styles.button}
          onClick={() => crearForo()}
        >
          Publicar
        </button>
      </section>
      {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "50%", left: "0%", margin: "150px 0", transform: "translateY(-50%)" }} />}

      {!loading && forosData.map(foro => (
        <section key={foro.id} className={styles.foroSection}>
          <article>
            <div className={styles.userDetails}>
              <img
                src={foro.usuario_profile_img}
                alt={`${foro.usuario_nombre} profile`}
                className={styles.userProfileImg}
                onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  <h4>{foro.usuario_nombre}</h4>
                  <p style={{color : "black"}}>@{foro.usuario_private_id}</p>
                </div>

                <div>
                  <p>{foro.tipoUsuario === 1 ? "Anfitrión" : "Viajero"}</p>
                  <p className={styles.fecha}>{new Date(foro.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>

            <p className={styles.descripcion}>{foro.descripcion}</p>
          </article>

          <div className={styles.responder}>
            <img src="/images/usuarios/responder.svg" className={styles.conectado} alt="likes" />
            <p>Responder - 2</p>
          </div>

        </section>
      ))}

      {hasMore &&
        <div className={styles.ver_mas} onClick={() => lastFecha != null && obtenerForos(lastFecha)}>
          <button ref={verMasRef}>
            Ver más
          </button>
        </div>
      }
    </main>
  );
};

export default Foros;
