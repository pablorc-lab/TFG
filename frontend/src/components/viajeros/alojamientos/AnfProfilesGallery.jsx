import { useEffect, useState } from 'react';
import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";
import LikesService from '../../../services/matches/LikesService';
import { jwtDecode } from 'jwt-decode';

export default function AnfProfilesGallery({
  anfitriones = [],
  buscarUsuario = false,
  anfitrionesFiltrados = [],
  buscarFiltrado = false,
  match = false,
  setAnfitrionesObtenidos = null,
  hasMore = false,
  hasMoreFiltrados = false,
  setFiltradosObtenidos = null
}) {
  const [viajeroID, setViajeroID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conexionesID, setConexionesID] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("acces_token");
    if (token) {
      const decoded = jwtDecode(token);
      const id_viajero = decoded.jti;
      setViajeroID(id_viajero);
    }
  }, []);

  useEffect(() => {
    if (viajeroID != null && conexionesID.length == 0) {
      LikesService.getAllEnviados("viajeros", viajeroID)
        .then(response => setConexionesID(response.data.map(usuario => usuario.usuarioID)))
        .catch(error => console.error("Error al obtener los likes", error))
        .finally(() => setLoading(false));
    }
  }, [viajeroID]);

  // Comprueba si se dio like
  function likeDado(AnfitrionID) {
    let contiene_id = conexionesID.length > 0 && conexionesID.find(id => Number(id) === Number(AnfitrionID));
    return contiene_id || match;
  }

  return (
    <section className={styles.card_users_container}>
      <article className={styles.card_users}>
        {!loading && viajeroID != null && (buscarFiltrado || buscarUsuario ? anfitrionesFiltrados : anfitriones).map(anfitrion => (
          <div key={anfitrion.id} className={styles.user_card}>
            <AnfCard
              styles={anf_card_styles}
              anf_id={anfitrion.id}
              Casa_img={anfitrion.vivienda?.imagen1 || "/images/not_found/vivienda.webp"}
              Perfil_img={anfitrion.profileImage || "/images/not_found/user_img.png"}
              Nombre={anfitrion.nombre}
              Gustos_imgs={[anfitrion.gusto1, anfitrion.gusto2, anfitrion.gusto3]}
              Valoracion={anfitrion.valoracion_media || 0}
              Ubicacion={`${anfitrion.vivienda?.ciudad || "No disponible"}, ${anfitrion.vivienda?.provincia || "No disponible"}`}
              Precio={anfitrion.vivienda?.precio_noche || "0"}
              Descripcion={anfitrion.descripcion || "Este anfitrión aún no se ha descrito."}
              conectado={likeDado(anfitrion.id)}
              viajero_ID={viajeroID}
            />
          </div>
        ))}

        {((hasMore && !buscarFiltrado) || (buscarFiltrado && hasMoreFiltrados)) && !buscarUsuario &&
          <div className={styles.ver_mas}>
            <button onClick={() => buscarFiltrado ? setFiltradosObtenidos(prev => prev + 1) : setAnfitrionesObtenidos(prev => prev + 1)}>
              Ver más
            </button>
          </div>
        }

        {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "50%", left: "0%", margin: "150px 0", transform: "translateY(-50%)" }} />}
        
        {buscarFiltrado && anfitrionesFiltrados.length === 0 && <h1 className={styles.not_found}>No existen anfitriones con esos filtros.</h1>}
      </article>
    </section>
  )
}