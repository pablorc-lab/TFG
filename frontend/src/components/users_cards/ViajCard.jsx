import { useState } from "react";
import { Link } from "react-router-dom";
import LikesService from "../../services/matches/LikesService";

export default function Inq_card({
  styles,
  viaj_ID,
  Perfil_img,
  Nombre = "-",
  Valoracion = "/",
  Num_viajes = "/",
  Edad = "/",
  Profesion = "-",
  Descripcion = "-",
  Gustos_imgs,
  tiempo_estancia,
  enlace = true,
  conectado = false,
  anfitrion_ID = null
}) {

  const [changeConectado, setChangeConectado] = useState(conectado);

  function handleLike(anfitrion_ID) {
    setChangeConectado(true);
    LikesService.crearLike("anfitriones", anfitrion_ID, viaj_ID);
  }

  function returnTiempoValue(tiempo_estancia) {
    switch (tiempo_estancia) {
      case "< 1 mes": return 20;
      case "1 - 3 meses": return 35;
      case "3 - 6 meses": return 55;
      case "6 - 12 meses": return 75;
      case "> 1 año": return 95;
    }
  }

  return (
    <article className={`${styles.general_prof} ${styles.viaj_prof}`}>
      <div className={styles.personal_info}>
        <Link to="/anfitriones/perfil-viajero" state={{ id: viaj_ID, emisorID: anfitrion_ID }} className={styles.anf_link} style={{ pointerEvents: !enlace ? 'none' : 'auto' }}>
          <img className={`${styles.profile_img} ${styles.viaj_img}`} src={Perfil_img} alt="Imagen viajero" width={250} />
        </Link>
        <div className={styles.text_column_viaj}>
          <h3>{Nombre}</h3>
          <p>{Num_viajes} viajes</p>
          <div className={`${styles.score} ${styles.score_viajero}`}>
            <p>{parseInt(Valoracion).toFixed(1)}</p>
            <img src="/images/usuarios/estrella.webp" alt="Logo estrella" />
          </div>
        </div>
      </div>

      {/*?Edad y descripcion*/}
      <div>
        <p className={styles.age}>{Edad} años, {Profesion}</p>
        <p className={styles.description}>{Descripcion}</p>
      </div>

      {/*?Gustos*/}
      <div className={styles.viaj_likes}>
        {Gustos_imgs.map((gusto, index) => (
          <img
            key={index}
            src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
            alt={`Logo gusto ${index + 1}`}
            onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
            width={100}
          />
        ))}
      </div>

      {/*? Tiempo estancia y Conectar*/}
      <section className={styles.conectar_section}>
        <article className={styles.estancia_viaj}>
          <div>
            <progress max="100" value={returnTiempoValue(tiempo_estancia)} />
          </div>
          <p>{tiempo_estancia}</p>
        </article>

        {!changeConectado ? (
          <button className={styles.btn_conectar} onClick={() => enlace && !conectado && handleLike(anfitrion_ID)}>
            Conectar
          </button>
        ) : (
          <img src="/images/usuarios/heart.svg" className={styles.conectado} alt="Conectado" />
        )}
      </section>
    </article>
  );
}
