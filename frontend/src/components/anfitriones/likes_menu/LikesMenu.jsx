import styles from "./LikesMenu.module.css"
import LikesService from "../../../services/matches/LikesService"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function LikesMenu({ SetOpenLikesMenu, anfitrionID }) {
  const [viajeros, SetViajeros] = useState([]);

  useEffect(() => {
    LikesService.getAllViajerosRecibidos(anfitrionID)
      .then(response => SetViajeros(response.data))
      .catch(error => "Error al listar la lista de likes de los viajeros " + error);
  }, []);

  return (
    <dialog className={styles.dialog} ref={(el) => el && el.showModal()}>
      <section className={styles.titulo}>
        <img src="/images/usuarios/close_menu.svg" alt="Cerrar" className={styles.cerra_menu} onClick={() => SetOpenLikesMenu(false)} />
        <h1>Likes recibidos</h1>
      </section>

      <section className={styles.viaj_prof}>
        {viajeros.length === 0 ? (
          <img
            src="/images/loading_gif.gif"
            alt="Cargando..."
            style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }}
          />
        ) : (
          viajeros.sort((v1, v2) => new Date(v2.fecha) - new Date(v1.fecha)).map((viajero, index) => (
            <Link to="/anfitriones/perfil-viajero" state={{ id: viajero.id }}>
              <article key={index}>
                <p className={styles.fecha}>{viajero.fecha}</p>
                <div className={styles.info_profile}>
                  <img src={viajero.profileImage} alt="Imagen perfil" className={styles.profile_image} />
                  <div className={styles.gustos}>
                    <p>{viajero.nombre}</p>
                    {[viajero.gusto1, viajero.gusto2, viajero.gusto3].map((gusto, i) => (
                      <img
                        key={i}
                        src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
                        alt={`Logo gusto ${i + 1}`}
                        onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
                        width={100}
                      />
                    ))}
                  </div>
                </div>
                <p className={styles.descripcion}>{viajero.descripcion}</p>
              </article>
            </Link>
          ))
        )}
      </section>
    </dialog>
  )
}
