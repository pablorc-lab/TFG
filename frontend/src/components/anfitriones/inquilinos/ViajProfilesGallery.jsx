import { useEffect, useState } from "react";
import viaj_card_styles from "../../users_cards/UserCard.module.css"
import ViajCard from "../../users_cards/ViajCard";
import styles from "./ViajProfilesGallery.module.css"

export default function ViajProfilesGallery({ viajeros, viajerosFiltrados = [], match = false, conectados_ID = [], buscarFiltrado = false }) {
  const [listaViajeros, setListaViajeros] = useState([]);

  useEffect(() => {
    if (buscarFiltrado) {
      setListaViajeros(viajerosFiltrados);
    }

    else if (listaViajeros !== viajeros) {
      setListaViajeros(viajeros);
    }
  }, [viajerosFiltrados, viajeros, buscarFiltrado])


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

  // Comprueba si se dio like
  function likeDado(ViajeroID) {
    let contiene_id = conectados_ID.length > 0 && conectados_ID.some(id => id === ViajeroID);
    return contiene_id || match;
  }

  return (
    <section className={styles.card_users}>
      {listaViajeros.map((viajero, index) => (
        <article key={index}>
          <ViajCard
            styles={viaj_card_styles}
            viaj_ID={viajero.id}
            Perfil_img={viajero.profileImage || "/images/not_found/user_img.png"}
            Nombre={viajero.nombre}
            Valoracion={viajero.valoracion_media || "0.0"}
            Num_viajes={viajero.viajes_realizados || 0}
            Edad={calcularEdad(viajero.fecha_nacimiento) || 18}
            Profesion={viajero.profesion || "Profesional"}
            Descripcion={viajero.descripcion}
            Gustos_imgs={[viajero.gusto1, viajero.gusto2, viajero.gusto3].filter(gusto => gusto != null)}
            tiempo_estancia={viajero.tiempo_estancia || "Indefinido"}
            conectado={likeDado(viajero.id)}
            anfitrion_ID={1}
          />
        </article>
      ))}

      {listaViajeros.length === 0 && listaViajeros === viajeros && <h1 className={styles.not_found}>No hay viajeros actualmente.</h1>}
      {listaViajeros.length === 0 && listaViajeros === viajerosFiltrados && <h1 className={styles.not_found}>No existen viajeros con esos filtros.</h1>}

    </section>
  )
}
