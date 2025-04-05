import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";

export default function Anf_Profiles_Gallery({ anfitriones, anfitrionesEspecificos = [], buscarUsuario = false, match = false, conectados_ID = [] }) {
  const listaAnfitriones = buscarUsuario ? anfitrionesEspecificos : anfitriones;

  // Comprueba si se dio like
  function likeDado(AnfitrionID) {
    let contiene_id = conectados_ID.length > 0 && conectados_ID.some(id => id === AnfitrionID);
    return contiene_id || match;
  }

  return (
    <section className={styles.card_users_container}>
      <article className={styles.card_users}>
        {listaAnfitriones.map(anfitrion => (
          <div key={anfitrion.id} className={styles.user_card}>
            <AnfCard
              styles={anf_card_styles}
              anf_id={anfitrion.id}
              Casa_img={anfitrion.vivienda?.imagen1 || "/images/not_found/vivienda.webp"}
              Perfil_img={anfitrion.profileImage || "/images/not_found/user_img.png"}
              Nombre={anfitrion.nombre}
              Gustos_imgs={[anfitrion.gusto1, anfitrion.gusto2, anfitrion.gusto3].filter(gusto => gusto != null)}
              Valoracion={anfitrion.valoracion_media || 0.1}
              Ubicacion={`${anfitrion.vivienda?.ciudad || ""}, ${anfitrion.vivienda?.provincia || ""}`}
              Precio={anfitrion.vivienda?.precio_noche || "-"}
              Descripcion={anfitrion.descripcion || "Este anfitrión aún no se ha descrito."}
              conectado={likeDado(anfitrion.id)}
              viajero_ID={1}
            />
          </div>
        ))}

        {listaAnfitriones.length === 0 && listaAnfitriones === anfitrionesEspecificos && <h1 className={styles.not_found}>No hay anfitriones en esa ubicación.</h1>}
        {listaAnfitriones.length === 0 && listaAnfitriones === anfitriones && <h1 className={styles.not_found}>No existen anfitriones con esos filtros.</h1>}

      </article>
    </section>
  )
}