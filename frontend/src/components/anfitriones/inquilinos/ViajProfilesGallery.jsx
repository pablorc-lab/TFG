import viaj_card_styles from "../../users_cards/UserCard.module.css"
import ViajCard from "../../users_cards/ViajCard";
import styles from "./ViajProfilesGallery.module.css"
import Anf_data from "../../../data/viajeros/viaj_data.json"

export default function ViajProfilesGallery() {
  return (
    <section className={styles.card_users}>
      {Anf_data.map((item, index) => (
        <article key={index}>
          <ViajCard
            styles={viaj_card_styles}
            Perfil_img={"/images/landing_page/persona_3.webp"}
            Nombre={item.Nombre}
            Valoracion={item.Valoracion}
            Num_viajes={2}
            Edad={18}
            Profesion={"camionero"}
            Descripcion={item.Descripcion}
            Gustos_imgs={item.Gustos_imgs}
          />
        </article>
      ))}
    </section>
  )
}
