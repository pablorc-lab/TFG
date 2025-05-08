import styles from "./LikesMenu.module.css"
import LikesService from "../../../services/matches/LikesService"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function LikesMenu({ SetOpenLikesMenu, anfitrionID }) {
  const [viajeros, setViajeros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (anfitrionID != null) {
      setLoading(true);
      LikesService.getAllViajerosRecibidos(anfitrionID)
        .then(response => setViajeros(response.data))
        .catch(error => console.error("Error al listar los likes: " + error))
        .finally(() => setLoading(false));
    }
  }, [anfitrionID]);


  return (
    <dialog className={styles.dialog} ref={(el) => el && el.showModal()}>
      <section className={styles.titulo}>
        <img src="/images/usuarios/close_menu.svg" alt="Cerrar" className={styles.cerra_menu} onClick={() => SetOpenLikesMenu(false)} />
        <h1>Likes recibidos</h1>
      </section>

      <section className={styles.viaj_prof}>
        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}
        {!loading &&
          viajeros.map(viajero => (
            <Link to="/anfitriones/perfil-viajero" state={{ emisorID: anfitrionID, id: viajero.id }} key={viajero.id}>
              <article >
                <p className={styles.fecha}>{new Date(viajero.fecha).toLocaleDateString('es-ES')}</p>
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
        }
        {!loading && viajeros.length === 0 && <h2 style={{textAlign : "center"}}>No tienes aún ningun like</h2>}
      </section>
    </dialog>
  )
}
