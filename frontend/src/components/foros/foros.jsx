import styles from './foros.module.css';
import { useEffect, useState } from 'react';
import ForosService from '../../services/foros/ForosService';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const Foros = ({ tipoUsuario }) => {
  const [loading, setLoading] = useState(true);

  const [userID, setUserID] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const [forosData, setForosData] = useState([]);
  const [lastFecha, setLastFecha] = useState(null);
  const [ordenPaginacion, setOrdenPaginacion] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [foroCreado, setForoCreado] = useState(false);
  
  const [mostrarRespuestas, setMostrarRespuestas] = useState({});
  const [loadingRespuestas, setLoadingRespuestas] = useState({});
  const [respuestaData, setRespuestaData] = useState({});
  const [descripcionRespuesta, setDescripcionRespuesta] = useState({});

  // Función para manejar el clic en "Responder"
  const toggleRespuestas = (foroID) => {
    setMostrarRespuestas(prevState => ({ ...prevState, [foroID]: !prevState[foroID] }));

    // Si las respuestas no están visibles, cargarlas
    if (!mostrarRespuestas[foroID] && !respuestaData[foroID]) {
      setLoadingRespuestas(prevState => ({ ...prevState, [foroID]: true }));

      ForosService.getRespuestas(foroID)
        .then(response => setRespuestaData(prevState => ({ ...prevState, [foroID]: response.data })))
        .catch(error => console.error("Error al obtener los foros:", error))
        .finally(() => setLoadingRespuestas(prevState => ({ ...prevState, [foroID]: false })));
    }
  };

  // Función para obtener los foros con paginación
  const obtenerForos = (fecha) => {
    setLoading(true);
    ForosService.getForosPorCursor(ordenPaginacion , 10, fecha)
      .then(response => {
        console.log(response.data)
        setForosData(prev => [...prev, ...response.data.data]);
        setLastFecha(response.data.lastFecha);
        setHasMore(response.data.hasMore);
        setOrdenPaginacion(prev => prev + 1); 
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
        setUserID(parseInt(decoded.jti));
      }
    }

    if (forosData.length === 0) {
      obtenerForos(null);
    }
  }, []);

  const crearForo = () => {
    ForosService.crearForo(tipoUsuario, userID, descripcion)
      .then(response => {
        setForoCreado(true);
        setDescripcion("");
      }).catch(error => console.error("Error al CREAR el foro:", error))
  }

  const actualizarRespuesta = (foroID) => {
    setLoadingRespuestas(prev => ({ ...prev, [foroID]: true }));
    
    ForosService.getRespuestas(foroID)
      .then(response => setRespuestaData(prev => ({ ...prev, [foroID]: response.data })))
      .catch(error => console.error("Error al actualizar respuestas:", error))
      .finally(() => setLoadingRespuestas(prev => ({ ...prev, [foroID]: false })));
  };


  const crearRespuesta = (foroID) => {
    ForosService.crearRespuesta(foroID, tipoUsuario, userID, descripcionRespuesta[foroID])
      .then(response => {
        actualizarRespuesta(foroID);
        setDescripcionRespuesta(prevState => ({ ...prevState, [foroID]: "" }));

        // Actualizar el contador de respuestas en forosData
        setForosData(prevData =>
          prevData.map(foro => foro.id === foroID ? { ...foro, num_respuestas: foro.num_respuestas + 1 } : foro)
        );

      }).catch(error => console.error("Error al CREAR el foro:", error))
  }

  return (
    <main className={`${styles.forosContainer} ${tipoUsuario === 1 ? styles.foroAnf : styles.foroViaj}`}>
      <section className={styles.add_foro}>
        {foroCreado && <h2 style={{ marginTop: "15px", textAlign: "center", fontSize: "30px" }}>¡Foro creado con éxito!</h2>}

        <textarea
          name='descripcion foro'
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className={styles.textarea}
          placeholder="Comparte algo con la comunidad..."
          rows="4"
          spellCheck="false"
          autoComplete='false'
        />
        <button
          disabled={descripcion === "" && userID === null}
          className={styles.button}
          onClick={() => crearForo()}
        > Publicar </button>
      </section>
      {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "50%", left: "50%", margin: "150px 0", transform: "translate(-50%, -50%)" }} />}

      {!loading && forosData.map(foro => (
        <section key={foro.id} className={styles.foroSection}>
          <article>
            <div className={styles.userDetails}>
              {foro.tipoUsuario !== tipoUsuario ? (
                <Link to={tipoUsuario === 1 ? "/anfitriones/perfil-viajero" : "/viajeros/perfil-anfitrion"} state={{ emisorID: userID, id: foro.usuarioID }} key={foro.id} className={styles.userProfileLink}>
                  <img
                    src={foro.usuario_profile_img}
                    alt={`${foro.usuario_nombre} profile`}
                    className={styles.userProfileImg}
                    onError={(e) => e.target.src = "/images/not_found/user_img.png"}
                  />
                </Link>
              ) : (
                <img
                  src={foro.usuario_profile_img}
                  alt={`${foro.usuario_nombre} profile`}
                  className={styles.userProfileImg}
                  onError={(e) => e.target.src = "/images/not_found/user_img.png"}
                />
              )}
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  <h4>{foro.usuario_nombre}</h4>
                  <p style={{ color: "black" }}>@{foro.usuario_private_id}</p>
                </div>

                <div>
                  <p>{foro.tipoUsuario === 1 ? "Anfitrión" : "Viajero"}</p>
                  <p className={styles.fecha}>{new Date(foro.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>

            <p className={styles.descripcion}>{foro.descripcion}</p>
          </article>

          {
            <div className={`${styles.responder} ${mostrarRespuestas[foro.id] ? styles.activa : ""}`} onClick={() => toggleRespuestas(foro.id)}>
              <img src="/images/usuarios/responder.svg" className={styles.conectado} alt="likes" />
              <p>{!mostrarRespuestas[foro.id] ? "Responder" : "Ocultar"} - {foro.num_respuestas}</p>
            </div>
          }

          {mostrarRespuestas[foro.id] && loadingRespuestas[foro.id] && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}

          {/* Si las respuestas están visibles, mostrar las respuestas y el campo de respuesta */}
          {mostrarRespuestas[foro.id] && respuestaData[foro.id] && (
            <div className={styles.respuestasContainer}>
              <div className={styles.respuestaInput}>
                <textarea
                  value={descripcionRespuesta[foro.id]}
                  onChange={(e) => setDescripcionRespuesta(prevState => ({ ...prevState, [foro.id]: e.target.value }))}
                  placeholder="Escribe tu respuesta..."
                  className={styles.textarea}
                  rows="3"
                  name={`descripcion_respuesta_${foro.id}`}
                  spellCheck="false"
                  autoComplete='false'
                >
                </textarea>
                <button className={styles.button} onClick={() => crearRespuesta(foro.id)}>Responder</button>
              </div>
              <div className={styles.respuestas}>
                {respuestaData[foro.id] && respuestaData[foro.id].map(respuesta => (
                  <article key={respuesta.id}>
                    <div className={styles.userDetails}>
                      {respuesta.tipoUsuario !== tipoUsuario ? (
                        <Link to={tipoUsuario === 1 ? "/anfitriones/perfil-viajero" : "/viajeros/perfil-anfitrion"} state={{ emisorID: userID, id: respuesta.usuarioID }} key={respuesta.id} className={styles.userProfileLink}>
                          <img
                            src={respuesta.usuario_profile_img}
                            alt={`${respuesta.usuario_nombre} profile`}
                            className={styles.userProfileImg}
                            onMouseEnter={() => console.log(respuesta.usuario_id)}
                            onError={(e) => e.target.src = "/images/not_found/user_img.png"}
                          />
                        </Link>
                      ) : (
                        <img
                          src={respuesta.usuario_profile_img}
                          alt={`${respuesta.usuario_nombre} profile`}
                          className={styles.userProfileImg}
                          onError={(e) => e.target.src = "/images/not_found/user_img.png"}
                          onMouseEnter={() => console.log(respuesta.usuario_id)}
                        />
                      )}

                      <div className={styles.userInfo}>
                        <div className={styles.userName}>
                          <h4>{respuesta.usuario_nombre}</h4>
                          <p style={{ color: "black" }}>@{respuesta.usuario_private_id}</p>
                        </div>

                        <div>
                          <p>{respuesta.tipoUsuario === 1 ? "Anfitrión" : "Viajero"}</p>
                          <p className={styles.fecha}>{new Date(respuesta.fecha).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                      </div>
                    </div>

                    <p className={styles.descripcion}>{respuesta.descripcion}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      {hasMore && !loading &&
        <div className={styles.ver_mas} onClick={() => lastFecha != null && obtenerForos(lastFecha)}>
          <button> Ver más </button>
        </div>
      }
    </main >
  );
};

export default Foros;
