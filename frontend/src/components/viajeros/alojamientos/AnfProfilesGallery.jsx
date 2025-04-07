import { useEffect, useState } from 'react';
import AnfCard from '../../users_cards/AnfCard';
import anf_card_styles from "../../users_cards/UserCard.module.css";
import styles from "./AnfProfilesGallery.module.css";

export default function Anf_Profiles_Gallery({ anfitriones = [], anfitrionesEspecificos = [], buscarUsuario = false, anfitrionesFiltrados = [], buscarFiltrado = false, match = false, conectados_ID = [], eliminarBuscados}) {
  const [ListaAnfitriones, setListaAnfitriones] = useState([]);
  
  useEffect(() => {
    if(buscarFiltrado){
      setListaAnfitriones(anfitrionesFiltrados);
    }

    else if(anfitrionesEspecificos.length > 0 || buscarUsuario){
      setListaAnfitriones(anfitrionesEspecificos);
    }

    else if(ListaAnfitriones !== anfitriones){
      setListaAnfitriones(anfitriones);
      if (anfitrionesEspecificos.length > 0 || anfitrionesFiltrados.length > 0) {
        eliminarBuscados();
      }
    }
  },[anfitrionesEspecificos, anfitrionesFiltrados, anfitriones, buscarFiltrado, buscarUsuario])
  
  // Comprueba si se dio like
  function likeDado(AnfitrionID) {
    return conectados_ID.find(id => Number(id) === Number(AnfitrionID)) || match;
  }

  return (
    <section className={styles.card_users_container}>
      <article className={styles.card_users}>
        {ListaAnfitriones.map((anfitrion, index) => (
          <div key={index} className={styles.user_card}>
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

        
        {ListaAnfitriones.length === 0 && ListaAnfitriones === anfitrionesEspecificos && <h1 className={styles.not_found}>No hay anfitriones para esa ubicación o identificador.</h1>}
        {ListaAnfitriones.length === 0 && ListaAnfitriones === anfitrionesFiltrados && <h1 className={styles.not_found}>No existen anfitriones con esos filtros.</h1>}

      </article>
    </section>
  )
}