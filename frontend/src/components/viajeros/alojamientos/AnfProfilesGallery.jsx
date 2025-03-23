import { useState, useEffect } from "react";
import AnfitrionService from "../../../services/users/AnfitrionService";
import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";


export default function Anf_Profiles_Gallery() {
  const [anfitriones, setAnfitriones] = useState([]);

  // Obtener los anfitriones
  useEffect(() => {
    // Obtener anfitriones
    AnfitrionService.getAllConDatos().then(response => {
      // Obtener el id de cada anfitrion y su vivienda
      setAnfitriones(response.data);
      console.log(response.data)
    }).catch(error => console.error("Error al listar los usuarios : ", error));
  }, []);

  return (
    <section className={styles.card_users}>
      {anfitriones.map(anfitrion => (
        <article key={anfitrion.usuario.id}>
          <AnfCard
            styles={anf_card_styles}
            Casa_img={anfitrion.usuario.vivienda?.imagen1 || "/images/not_found/vivienda.webp"}
            Perfil_img={anfitrion.usuario.profileImage}
            Nombre={anfitrion.usuario.nombre}
            Gustos_imgs={[]}
            Valoracion={0}
            Ubicacion={`${anfitrion.usuario.vivienda?.ciudad || ""}, ${anfitrion.usuario.vivienda?.provincia || ""}`}
            Precio={anfitrion.usuario.vivienda?.precio_noche || "-"}
            Descripcion={anfitrion.biografia?.sobreMi ||"Texto"}
          />
        </article>
      ))}
    </section>
  )
}