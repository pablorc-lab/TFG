import viaj_card_styles from "../../users_cards/UserCard.module.css"
import ViajCard from "../../users_cards/ViajCard";
import styles from "./ViajProfilesGallery.module.css"

export default function ViajProfilesGallery({ viajeros }) {
  // Return : edad en años dada la fecha en estilo yyyy-mm-dd
  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  return (
    <section className={styles.card_users}>
      {viajeros.map((viajero, index) => (
        <article key={index}>
          <ViajCard
            styles={viaj_card_styles}
            Perfil_img={viajero.profileImage || "/images/not_found/user_img.png"}
            Nombre={viajero.nombre}
            Valoracion={viajero.valoracion_media || "0.0"}
            Num_viajes={viajero.viajes_realizados || 0}
            Edad={calcularEdad(viajero.fecha_nacimiento) || 18}
            Profesion={viajero.profesion || "Profesional"}
            Descripcion={viajero.descripcion}
            Gustos_imgs={[viajero.gusto1, viajero.gusto2, viajero.gusto3].filter(gusto => gusto != null)}
          />
        </article>
      ))}
    </section>
  )
}
