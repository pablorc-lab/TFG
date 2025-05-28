import styles from "./UserPage.module.css"
import OpinionesMiCuenta from "../../../components/usuarios/mi_cuenta/opiniones/Opiniones";
import LikesService from "../../../services/matches/LikesService";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { es } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import MatchesService from "../../../services/matches/MatchesService.jsx";

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
  match = false,
  esAnfitrion = false,
  userID = null,
  emisorID = null
}) {

  const [matches, setMatches] = useState("");
  const [llegada, setLlegada] = useState(new Date());

  const fechaSalida = new Date();
  fechaSalida.setDate(fechaSalida.getDate() + 1);
  const [salida, setSalida] = useState(fechaSalida);

  const [loadingFechas, setLoadingFechas] = useState(true);
  const [fechasExcluidas, setFechasExcluidas] = useState(["2025-05-08"]);
  const [openModal, setOpenModal] = useState(false);

  // Obtener numero de matches
  useEffect(() => {
  if (matches === "") {
    const llamadaFuncion = esAnfitrion
      ? MatchesService.getCantidadAnfitrion(userID)
      : MatchesService.getCantidadViajero(userID);

    llamadaFuncion
      .then(response => setMatches(response.data))
      .catch(err => console.log("Error al obtener cantidad de matches:", err));
  }
}, [usuarioData]);

  
  // Obtener fechas de reservas excluidas
  useEffect(() => {
    if (esAnfitrion && match) {
      const cargarReservas = async () => {
        // Fechas del usuario
        const ReservasService = (await import("../../../services/reservas/ReservasService.jsx")).default;

        ReservasService.getFechasReservadasViajero(emisorID)
          .then(response => setFechasExcluidas(prev => [...prev, ...response.data]))
          .catch(error => "Error al obtener las reservas " + error);

        // Fechas del anfitrión
        ReservasService.getFechasYaReservadasAnfitrion(userID)
          .then(response => setFechasExcluidas(prev => [...prev, ...response.data]))
          .catch(error => "Error al obtener las fechas ya reservas " + error)
          .finally(() => setLoadingFechas(false));
      };

      // Del usuarios y yá excluidas
      cargarReservas();
    }
  }, [esAnfitrion, match]);

  // Actualizar fecha inicio y final
  useEffect(() => {
    if (fechasExcluidas.length === 0) return;

    let hoy = new Date();

    while (fechasExcluidas.some(f => new Date(f).toDateString() === hoy.toDateString()) ||
      fechasExcluidas.some(f => new Date(f).toDateString() === new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toDateString())
    ) {
      hoy.setDate(hoy.getDate() + 1);
    }

    let maniana = new Date(hoy);
    maniana.setDate(maniana.getDate() + 1);

    setLlegada(hoy.toISOString().split("T")[0]);
    setSalida(maniana.toISOString().split("T")[0]);
  }, [fechasExcluidas]);


  const [diasReserva, setDiasReserva] = useState(1);

  const [mensajeReserva, setMensajeReserva] = useState(false);

  const handleReserva = async () => {
    if (salida < llegada) return;
    // Convertir las fechas de llegada y salida al formato esperado : yyyy-MM-dd
    const llegadaFormatted = new Date(llegada).toISOString().split('T')[0];
    const salidaFormatted = new Date(salida).toISOString().split('T')[0];

    // Enviar las fechas ya en formato yyyy-MM-dd
    const ReservasService = (await import("../../../services/reservas/ReservasService.jsx")).default;
    setMensajeReserva(true);

    ReservasService.crearReserva(userID, emisorID, llegadaFormatted, salidaFormatted)
      .then(response => {
        console.log(response.data);
        setMensajeReserva(true);
        setOpenModal(false);
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


  const changeFechaLlegada = (date) => {
    let nuevaLlegada = new Date(date);
    let nuevaSalida = new Date(salida);

    // Si la salida es antes o igual que llegada, ajustamos salida a llegada +1
    if (nuevaSalida <= nuevaLlegada) {
      nuevaSalida = new Date(nuevaLlegada);
      nuevaSalida.setDate(nuevaSalida.getDate() + 1);
    }

    // Mientras haya alguna fecha excluida en el rango [llegada, salida)
    while (fechasExcluidas.some(f => {
      const fecha = new Date(f);
      return fecha >= nuevaLlegada && fecha <= nuevaSalida;
    })) {
      nuevaLlegada.setDate(nuevaLlegada.getDate() + 1);
      nuevaSalida = new Date(nuevaLlegada);
      nuevaSalida.setDate(nuevaSalida.getDate() + 1);
    }

    setLlegada(nuevaLlegada);
    setSalida(nuevaSalida);

    setDiasReserva(Math.round((new Date(nuevaSalida) - new Date(nuevaLlegada)) / (1000 * 60 * 60 * 24)));
  };

  const changeFechaSalida = (date) => {
    let nuevaSalida = new Date(date);
    let nuevaLlegada = new Date(llegada);

    while (fechasExcluidas.some(f => {
      const fecha = new Date(f);
      return fecha >= nuevaLlegada && fecha <= nuevaSalida;
    })) {
      nuevaLlegada.setDate(nuevaSalida.getDate() + 1);
      nuevaSalida = new Date(nuevaLlegada);
      nuevaSalida.setDate(nuevaSalida.getDate() + 1);
    }

    setLlegada(nuevaLlegada);
    setSalida(nuevaSalida);
    setDiasReserva(Math.round((new Date(nuevaSalida) - new Date(nuevaLlegada)) / (1000 * 60 * 60 * 24)));
  }

  const PerfilUsuario = (
    <section className={styles.user_info}>
      <article className={styles.user_article}>
        <img className={styles.user_img} src={usuarioData.usuario?.profileImage || "/images/not_found/user_img.png"} alt="Imagen de perfil" width={50} />
        <div>
          <h2>{esAnfitrion ? "Anfitrión" : "Viajero"} : {usuarioData.usuario?.nombre || "-"}</h2>

          <div className={styles.user_reservas}>
            <p style={{ margin: "0" }}>{usuarioData.usuario?.reservas_realizadas || 0} reservas</p>
            <div className={styles.user_score}>
              <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
              <h3>{usuarioData.usuario?.valoracion_media || "0.0"}</h3>
            </div>
          </div>
        </div>
      </article>

      <p style={{ margin: "0", marginBottom: "10px"}}><strong >ID : </strong>@{usuarioData.usuario?.privateID || ""}</p>
      <p style={{ margin: "0", marginBottom: "10px"}}><strong >Matches : </strong>{matches}</p>
      {match && <p style={{ margin: "0", marginBottom: "10px"}}><strong>Teléfono : </strong>{usuarioData.usuario.telefono}</p>}
      <p className={styles.userDescripcion} style={{ hyphens: "auto", textAlign: "justify" }}>{usuarioData.usuario?.descripcion || "Este anfitrión aún no se ha descrito."}</p>

      <article className={styles.user_conectar}>
        <div className={styles.user_likes}>
          {Gustos_imgs.map((gusto) => (
            <img
              key={gusto}
              src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
              alt={`Logo gusto ${gusto}`}
              width={100}
              onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
            />
          ))}
        </div>

        {!conectado
          ? <button className={styles.btn_conectar} onClick={() => handleLike()}> Conectar </button>
          : <img src="/images/usuarios/heart.svg" className={styles.conectado} alt="heart" />
        }

      </article>

      {match && esAnfitrion && !loadingFechas && (
        <>
          {openModal &&
            <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
              <h1>¿Crear una reserva?</h1>
              <div>
                <img src={usuarioData.usuario?.profileImage || "/images/not_found/user_img.png"} alt="Imagen perfil" className={styles.user_profile_img}/>
              </div>

              <p style={{ textAlign: "start", marginBottom: "10px", marginTop: "25px", fontWeight: "600" }}><strong>Nombre :</strong> {usuarioData.usuario?.nombre || "-"}</p>
              <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600" }}><strong>Ubicación : </strong> {usuarioData.usuario?.vivienda?.ciudad || <i>Ciudad</i>}, {usuarioData.usuario?.vivienda?.provincia || <i>Provincia</i>} </p>
              <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600" }}><strong>Precio : </strong>{diasReserva * usuarioData.usuario?.vivienda?.precio_noche} &euro; </p>
              <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600"}}><strong>Fecha : </strong>  {new Date(llegada).toLocaleDateString()} - {new Date(salida).toLocaleDateString()}</p>
              <p style={{ textAlign: "start", marginBottom: "25px", fontWeight: "600" }}><strong>{diasReserva} noches</strong> ({usuarioData.usuario?.vivienda?.precio_noche} &euro; / noche)</p>

              <div>
                <button onClick={() => setOpenModal(false)}>CANCELAR</button>
                <button onClick={handleReserva}>RESERVAR</button>
              </div>
            </dialog>
          }

          <section className={styles.reserva_section}>
            <h2 className={styles.titulo_reserva}>{diasReserva * usuarioData.usuario?.vivienda?.precio_noche} &euro; - ({diasReserva} {diasReserva > 1 ? "noches" : "noche"})</h2>
            <div className={styles.reserva_div}>
              <label>
                Llegada
                <DatePicker
                  readOnly={mensajeReserva}
                  name="llegada"
                  minDate={new Date().toISOString().split('T')[0]}
                  selected={llegada}
                  locale={es}
                  excludeDates={fechasExcluidas.map(fecha => new Date(fecha))} // Deshabilita las fechas reservadas
                  dateFormat="dd-MM-yyyy"
                  onChange={date => changeFechaLlegada(date)}
                />
              </label>
              <div className={styles.border_label}></div>
              <label>
                Salida
                <DatePicker
                  readOnly={mensajeReserva}
                  name="salida"
                  selected={salida}
                  locale={es}
                  minDate={llegada} // No permite fechas anteriores al de llegada
                  excludeDates={fechasExcluidas.map(fecha => new Date(fecha))} // Deshabilita las fechas reservadas
                  dateFormat="dd-MM-yyyy"
                  onChange={date => changeFechaSalida(date)}
                />
              </label>
            </div>

            {!mensajeReserva
              ? <button className={styles.reservar_btn} onClick={() => setOpenModal(true)}>Reservar</button>
              : <p style={{ color: "black", textAlign: "center", maxWidth: "550px" }}>
                <strong>
                  Reserva del {new Date(llegada).toLocaleDateString()} al {new Date(salida).toLocaleDateString()}, creada con éxito.
                  Puede ver el seguimiento de la misma en <a href="/viajeros/mi-cuenta" style={{ color: "blue" }}>su perfil</a>.
                </strong>
              </p>
            }
          </section>
        </>

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
          {idiomasUser?.map((idioma) => (
            <li key={idioma}>{idioma}</li>
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
          recomendaciones.map((recomendacion) => (
            <article key={recomendacion.titulo} className={styles.user_recomendations}>
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
        nota_media={usuarioData.usuario?.valoracion_media || 0.0}
        valoraciones={valoraciones}
      />
    </section>
  );

  return (
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
  )
}
