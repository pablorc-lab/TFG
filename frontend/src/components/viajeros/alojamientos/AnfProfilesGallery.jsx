import { useEffect, useState } from 'react';
import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";
import LikesService from '../../../services/matches/LikesService';
import { jwtDecode } from 'jwt-decode';

export default function Anf_Profiles_Gallery({ anfitriones = [], buscarUsuario = false, anfitrionesFiltrados = [], buscarFiltrado = false, match = false, conectados_ID = false, eliminarBuscados }) {
  const [viajeroID, setViajeroID] = useState(null);
  const [loading, SetLoading] = useState(true);
  const [conexionesID, setConexionesID] = useState([]);

  console.log(anfitriones);
  useEffect(() => {
    // Obtener el id del viajero
    if (viajeroID == null) {
      // Obtener el correo decodificado del localstorage
      const token = localStorage.getItem("acces_token");
      const decoded = jwtDecode(token);
      const id_viajero = decoded.jti;
      setViajeroID(id_viajero); // JTI : Id del token (almacena el id del usuario viajero)

      if (conectados_ID && conexionesID.length === 0) {
        LikesService.getAllEnviados("viajeros", id_viajero).then(response => {
          setConexionesID(response.data.map(usuario => usuario.usuarioID));
        }).catch(error => "Error al obtener los likes " + error)
      }
    }
    SetLoading(false);
  }, [anfitrionesFiltrados, anfitriones, buscarFiltrado, buscarUsuario])

  // Comprueba si se dio like
  function likeDado(AnfitrionID) {
    let contiene_id = conexionesID.length > 0 && conexionesID.find(id => Number(id) === Number(AnfitrionID));
    return contiene_id || match;
  }

  return (
    <section className={styles.card_users_container}>
      <article className={styles.card_users}>
        {!loading && viajeroID != null && (buscarFiltrado || buscarUsuario ? anfitrionesFiltrados : anfitriones).map((anfitrion, index) => (
          <div key={index} className={styles.user_card}>
            <AnfCard
              styles={anf_card_styles}
              anf_id={anfitrion.id}
              Casa_img={anfitrion.vivienda?.imagen1 || "/images/not_found/vivienda.webp"}
              Perfil_img={anfitrion.profileImage || "/images/not_found/user_img.png"}
              Nombre={anfitrion.nombre}
              Gustos_imgs={[anfitrion.gusto1, anfitrion.gusto2, anfitrion.gusto3].filter(gusto => gusto != null)}
              Valoracion={anfitrion.valoracion_media || "0.0"}
              Ubicacion={`${anfitrion.vivienda?.ciudad || "No disponible"}, ${anfitrion.vivienda?.provincia || "No disponible"}`}
              Precio={anfitrion.vivienda?.precio_noche || "0"}
              Descripcion={anfitrion.descripcion || "Este anfitrión aún no se ha descrito."}
              conectado={likeDado(anfitrion.id)}
              viajero_ID={viajeroID}
            />
          </div>
        ))}

        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "50%", left: "0%", margin: "150px 0", transform: "translateY(-50%)" }} />}

        {buscarFiltrado && anfitrionesFiltrados.length === 0 && <h1 className={styles.not_found}>No existen anfitriones con esos filtros.</h1>}
      </article>
    </section>
  )
}