import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css"
import styles from "./AnfProfilesGallery.module.css"
import Anf_data from "../../../data/viajeros/viaj_data.json"

export default function Anf_Profiles_Gallery(){
  return (
    <section className={styles.card_users}>
      {Anf_data.map((item, index) => (
        <article key={index}>
          <AnfCard
            styles={anf_card_styles}
            Casa_img={item.Casa_img}
            Perfil_img={item.Perfil_img}
            Nombre={item.Nombre}
            Gustos_imgs={item.Gustos_imgs}
            Valoracion={item.Valoracion}
            Ubicacion={item.Ubicacion}
            Precio={item.Precio}
            Descripcion={item.Descripcion}
          />
        </article>
      ))}
    </section>
  )
}