import { useEffect, useState } from "react";
import ScoreMiCuenta from "../Score";
import styles from "./Opiniones.module.css"
import Comentarios from "./Comentarios";
import ShowAllComentarios from "./ShowAllComentarios";

const OpinionesMiCuenta = ({ showSize = false, nota_media = 0.1, valoraciones = [], MiCuenta = false, userService, setEditedData}) => {
  const [estadisticas_valoraciones, setEstadisticas_valoraciones] = useState([0, 0, 0, 0, 0]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeShowMore, setActiveShowMore] = useState(false);
  // Almancenar cuantas valoraciones de ese valor hay
  useEffect(() => {
    if (valoraciones.length > 0) {
      const estadisticas = [0, 0, 0, 0, 0];

      for (const valoracion of valoraciones) {
        estadisticas[valoracion.num_valoracion - 1] += 1;
      }
      setEstadisticas_valoraciones(estadisticas);
    }

  }, [valoraciones]);


  return (
    <main className={styles.valoraciones_main}>
      <section className={`${styles.valoraciones_container} ${valoraciones ? styles.valoraciones_container_show : undefined} ${MiCuenta ? styles.valoraciones_statistics_cuenta : ""}`}>
        <article className={styles.valoraciones_info}>
          <div>
            <h2>Opiniones recibidas</h2>
          </div>
          <ScoreMiCuenta miCuenta={true} nota_media={nota_media} valoraciones={valoraciones} />
        </article>

        <article className={styles.valoraciones_statistics}>
          {estadisticas_valoraciones.slice().reverse().map((aparicion_valoracion, index) => (
            <div key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <p>{estadisticas_valoraciones.length - index}</p>
              <progress
                max="100"
                value={(aparicion_valoracion / Math.max(...estadisticas_valoraciones)) * 100}
              />
              {hoveredIndex === index && (
                <span>{aparicion_valoracion} valoraciones</span>
              )}
            </div>
          ))}
        </article>
      </section>

      <section className={`${styles.comentarios_section} ${activeShowMore && styles.show_more}`}>
        {valoraciones.slice(0, 3).map(valoracion => (
          <Comentarios
            key={valoracion.id}
            profileImg={valoracion.emisor_profile_img}
            nombre={`${valoracion.emisor_nombre}`}
            fecha={valoracion.fecha}
            nota={valoracion.num_valoracion}
            descripcion={valoracion.descripcion}
          />
        ))}
      </section>
      
      {activeShowMore && <ShowAllComentarios styles={styles} valoraciones={valoraciones} setActiveShowMore={setActiveShowMore}/>}

      {showSize && valoraciones.length > 0 && 
        <div className={styles.show_size}>
          <p onClick={() => setActiveShowMore(true)}>
            {activeShowMore ? `Ocultar` : `Ver ${valoraciones.length}`}  opiniones
          </p>
        </div>
      }

    </main>
  );
}

export default OpinionesMiCuenta;
