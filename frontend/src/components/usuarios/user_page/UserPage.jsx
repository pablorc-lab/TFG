import styles from "./UserPage.module.css"
import OpinionesMiCuenta from "../../../components/usuarios/mi_cuenta/opiniones/Opiniones";
import { useState } from "react";

export default function UserPage({
  usuarioData,
  valoraciones,
  Gustos_imgs,
  idiomasUser,
  ViviendaInfo,
  isColumns,
  recomendaciones = [],
  conectado = false,
  match = true,
  esAnfitrion = false,
  userID = null
}) {

  const [changeConectado, setChangeConectado] = useState(conectado);

  const [llegada, setLlegada] = useState(new Date().toISOString().split("T")[0]);
  const [salida, setSalida] = useState(new Date().toISOString().split("T")[0]);
  const [diasReserva, SetDiasReserva] = useState(1);

  function handleLike() {
    setChangeConectado(true);

    esAnfitrion
      ? LikesService.crearLike("anfitriones", id_usuario_login, userID)
      : LikesService.crearLike("viajeros", id_usuario_login, userID);
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

        {!changeConectado
          ? <button className={styles.btn_conectar} onClick={() => !conectado && handleLike()}> Conectar </button>
          : <img src="/images/usuarios/heart.svg" className={styles.conectado} />
        }

      </article>

      {match && esAnfitrion && (
        <section className={styles.reserva_section}>
          <h2>{diasReserva * 50} &euro; - ({diasReserva} {diasReserva > 1 ? "noches" : "noche"})</h2>
          <div className={styles.reserva_div}>
            <label>
              Llegada
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={llegada}
                onChange={(e) => {
                  setLlegada(e.target.value);
                  e.target.value > salida && setSalida(e.target.value)
                }}
              />
            </label>
            <div className={styles.border_label}></div>
            <label>
              Salida
              <input
                type="date"
                min={llegada}
                value={salida}
                onChange={(e) => {
                  setSalida(e.target.value);
                  SetDiasReserva((new Date(e.target.value) - new Date(llegada)) /(1000 * 60 * 60 * 24));
                }}
              />
            </label>
          </div>
          <button>Reservar</button>
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
                recomendacion[key] && (
                  <div className={styles.logos_recomendations} key={key}>
                    <img src={`/images/profiles/recomendaciones/${icon}.svg`} alt={`Imagen ${label}`} />
                    <p><strong>{label}:</strong> {recomendacion[key]}</p>
                  </div>
                )
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
