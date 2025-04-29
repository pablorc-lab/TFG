import styles from "./UserPage.module.css"
import OpinionesMiCuenta from "../../../components/usuarios/mi_cuenta/opiniones/Opiniones";
import LikesService from "../../../services/matches/LikesService";
import { useEffect, useRef, useState } from "react";

export default function UserPage({
  usuarioData,
  valoraciones,
  Gustos_imgs,
  idiomasUser,
  ViviendaInfo,
  isColumns,
  recomendaciones = [],
  conectado = false,
  setConectado,
  match = true,
  esAnfitrion = false,
  userID = null,
  emisorID = null
}) {

  const [llegada, setLlegada] = useState(new Date().toISOString().split("T")[0]);
  const [salida, setSalida] = useState(() => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split("T")[0];
  });

  const [fechasReservas, setFechasReservadas] = useState([[]]);
  useEffect(() => { // Obtener fechas de reservas
    if (esAnfitrion && match) {
      const cargarReservas = async () => {
        const ReservasService = (await import("../../../services/reservas/ReservasService.jsx")).default;
        ReservasService.getReservasViajero(userID)
          .then(response => {
            let fechasReserva = [];
            response.data.map(reserva =>
              fechasReserva.push([reserva.fechaInicio, reserva.fechaFin])
            )
            setFechasReservadas(fechasReserva);
          })
          .catch(error => "Error al obtener las reservas " + error);
      };
      cargarReservas();
    }
  }, [esAnfitrion, match]);

  const [errorFecha, setErrorFecha] = useState(false);
  const [diasReserva, SetDiasReserva] = useState(1);
  const inputLlegadaRef = useRef(null);
  const inputSalidaRef = useRef(null);

  const handleLabelClick = () => {
    if (inputLlegadaRef.current && typeof inputLlegadaRef.current.showPicker === 'function') {
      inputLlegadaRef.current.showPicker();
    }
  };

  const handleSalidaLabelClick = () => {
    if (inputSalidaRef.current && typeof inputSalidaRef.current.showPicker === 'function') {
      inputSalidaRef.current.showPicker();
    }
  };

  const [mensajeReserva, setMensajeReserva] = useState(false);
  const handleReserva = async () => {
    if (salida <= llegada) return;

    // Si la fecha indicada ya se encuentra en el rango de las anteriores reservas, error
    const reservaExistente = fechasReservas.some(fechas => {
      const reservaLlegada = new Date(fechas[0]).toISOString().split('T')[0];
      const reservaSalida = new Date(fechas[1]).toISOString().split('T')[0];

      return (llegada >= reservaLlegada && llegada <= reservaSalida)
        || (salida >= reservaLlegada && salida <= reservaSalida)
        || (llegada <= reservaLlegada && salida >= reservaSalida);
    });

    setErrorFecha(reservaExistente);
    if(reservaExistente) return;
    
    const ReservasService = (await import("../../../services/reservas/ReservasService.jsx")).default;
    ReservasService.crearReserva(emisorID, userID, llegada, salida)
      .then(response => {
        console.log(response.data);
        setMensajeReserva(true);
      })
      .catch(error => console.error(error));
  }


  function handleLike() {
    if (!emisorID || !userID) {
      console.error("No se puede dar like sin IDs válidos");
      return;
    }

    // Si se puede dar like es porque aún no se ha dado, mostrado como tal una vez dado
    setConectado(true);

    esAnfitrion
      ? LikesService.crearLike("viajeros", emisorID, userID)
      : LikesService.crearLike("anfitriones", emisorID, userID);
  }

  const datos_recomendaciones = [
    { key: "recomendacion", label: "Sugerencia", icon: "backpack" },
    { key: "ayuda", label: "Importante", icon: "help" },
    { key: "ubicacion", label: "Ubicación", icon: "location" },
    { key: "horarios", label: "Horarios", icon: "clock" },
    { key: "telefono", label: "Teléfono", icon: "phone" },
  ];

  const PerfilUsuario = (
    <section className={styles.user_info}>
      <article className={styles.user_article}>
        <img className={styles.user_img} src={usuarioData.usuario?.profileImage || "/images/not_found/user_img.png"} alt="Imagen de perfil" width={50} />
        <div>
          <h2>{esAnfitrion ? "Anfitrión" : "Viajero"} : {usuarioData.usuario?.nombre || "-"}</h2>
          <div className={styles.user_reservas}>
            <p>{usuarioData.usuario?.reservas_realizadas || 0} reservas</p>
            <div className={styles.user_score}>
              <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
              <h3>{usuarioData.usuario?.valoracion_media || 0.1}</h3>
            </div>
          </div>
        </div>
      </article>

      <p>{usuarioData.usuario?.descripcion || "Este anfitrión aún no se ha descrito."}</p>

      <article className={styles.user_conectar}>
        <div className={styles.user_likes}>
          {Gustos_imgs.map((gusto, index) => (
            <img
              key={index}
              src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
              alt={`Logo gusto ${index + 1}`}
              width={100}
              onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
            />
          ))}
        </div>

        {!conectado
          ? <button className={styles.btn_conectar} onClick={() => handleLike()}> Conectar </button>
          : <img src="/images/usuarios/heart.svg" className={styles.conectado} />
        }

      </article>

      {match && esAnfitrion && (
        <section className={styles.reserva_section}>
          <h2>{diasReserva * usuarioData.usuario?.vivienda?.precio_noche} &euro; - ({diasReserva} {diasReserva > 1 ? "noches" : "noche"})</h2>
          <div className={styles.reserva_div}>
            <label onClick={handleLabelClick}>
              Llegada
              <input
                ref={inputLlegadaRef}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={llegada}
                onChange={(e) => {
                  setLlegada(e.target.value);
                  if (e.target.value >= salida) {
                    const nuevaFecha = new Date(e.target.value);
                    nuevaFecha.setDate(nuevaFecha.getDate() + 1);
                    setSalida(nuevaFecha.toISOString().split('T')[0]);
                    SetDiasReserva(1); // Solo se adelanta 1 día si es menor o igual
                  }
                }}
              />
            </label>
            <div className={styles.border_label}></div>
            <label onClick={handleSalidaLabelClick}>
              Salida
              <input
                ref={inputSalidaRef}
                type="date"
                min={llegada}
                value={salida}
                onChange={(e) => {
                  setSalida(e.target.value);
                  SetDiasReserva((new Date(e.target.value) - new Date(llegada)) / (1000 * 60 * 60 * 24));
                }}
              />
            </label>
          </div>

          {!mensajeReserva && errorFecha &&
            <p style={{ textAlign: "center", color: "red", backgroundColor: "#ff000048", padding: "5px 0", marginBottom: "15px" }}>
              <strong>Ya tienes una reserva entre esas dos fechas</strong>
            </p>
          }

          {!mensajeReserva
            ? <button onClick={handleReserva}>Reservar</button>
            : <p style={{ color: "black", textAlign: "center", maxWidth : "550px" }}>
              <strong>
                Reserva del {llegada} al {salida}, creada con éxito.
                Puede ver el seguimiento de la misma en <a href="/viajeros/mi-cuenta" style={{ color: "blue" }}>su perfil</a>.
              </strong>
            </p>
          }
        </section>
      )}

    </section>
  );

  const Biografia = (
    <section className={styles.user_biografia}>
      <div className={styles.user_title}>
        <img src="/images/profiles/biografia.svg" alt="Biografia logo" />
        <h1>Biografía</h1>
      </div>

      <article className={styles.user_descripcion}>
        <h2>Sobre mí</h2>
        <p>{usuarioData.biografia?.sobreMi || "Aun no existe una descripción del usuario"}</p>

        <h2>Idiomas que hablo</h2>
        <ul>
          {idiomasUser?.map((idioma, index) => (
            <li key={index}>{idioma}</li>
          ))}
        </ul>

        <h2>Sobre {esAnfitrion ? "el alojamiento" : "mis intereses"}</h2>
        <p>{usuarioData.biografia?.descripcionExtra || "Aun no existe una descripción proporcionada"}</p>
      </article>
    </section>
  );

  const Recomendaciones = (
    <section className={styles.user_recomendations_section}>
      <div className={`${styles.user_title} ${styles.user_title2}`}>
        <img src="/images/profiles/recomendaciones.svg" alt="Recomendaciones logo" />
        <h1>Mis {esAnfitrion ? "recomendaciones" : "experiencias"}</h1>
      </div>

      {recomendaciones.length > 0
        ? (
          recomendaciones.map((recomendacion, index) => (
            <article key={index} className={styles.user_recomendations}>
              <h3>{recomendacion.titulo}</h3>
              <p>{recomendacion.descripcion}</p>

              {datos_recomendaciones.map(({ key, label, icon }) =>
                recomendacion[key] ? (
                  <div className={styles.logos_recomendations} key={key}>
                    <img src={`/images/profiles/recomendaciones/${icon}.svg`} alt={`Imagen ${label}`} />
                    <p><strong>{label}:</strong> {recomendacion[key]}</p>
                  </div>
                ) : null
              )}
            </article>
          ))
        ) : <p className={styles.recomendacion_not_found}>Aún no existen recomendaciones proporcionadas por el anfitrión</p>
      }
    </section>
  );

  const Valoraciones = (
    <section className={styles.valoraciones}>
      <OpinionesMiCuenta
        showSize={true}
        nota_media={usuarioData.usuario?.valoracion_media}
        valoraciones={valoraciones}
      />
    </section>
  );

  return (
    <>
      <main className={styles.main}>
        {isColumns ? (
          <>
            {ViviendaInfo}
            {PerfilUsuario /* PERFIL DEL USUARIO*/}
            {Biografia /* BIOGRAFÍA*/}
            {Recomendaciones /* RECOMENDACIONES*/}
            {Valoraciones}
          </>
        ) : (
          <>
            <div className={styles.columna_izquierda}>
              {ViviendaInfo}
              {Biografia /* BIOGRAFÍA*/}
              {Recomendaciones /* RECOMENDACIONES*/}
            </div>

            <div className={styles.columna_derecha}>
              {PerfilUsuario /* PERFIL DEL USUARIO*/}
              {Valoraciones}
            </div>
          </>
        )}
      </main>
    </>

  )
}
