import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";

export default function Anf_Profiles_Gallery({anfitriones, anfitrionesEspecificos}) {
  const listaAnfitriones = anfitrionesEspecificos.length > 0 ? anfitrionesEspecificos : anfitriones;

  return (
    <section className={styles.card_users}>
      {listaAnfitriones.map(anfitrion => (
        <article key={anfitrion.usuario.id}>
          <AnfCard
            styles={anf_card_styles}
            Casa_img={anfitrion.usuario.vivienda?.imagen1 || "/images/not_found/vivienda.webp"}
            Perfil_img={anfitrion.usuario.profileImage}
            Nombre={anfitrion.usuario.nombre}
            Gustos_imgs={[anfitrion.usuario?.gusto1, anfitrion.usuario?.gusto2, anfitrion.usuario?.gusto3].filter(gusto => gusto != null)}
            Valoracion={0.3}
            Ubicacion={`${anfitrion.usuario.vivienda?.ciudad || ""}, ${anfitrion.usuario.vivienda?.provincia || ""}`}
            Precio={anfitrion.usuario.vivienda?.precio_noche || "-"}
            Descripcion={anfitrion.biografia?.sobreMi ||"Texto"}
          />
        </article>
      ))}
    </section>
  )
}