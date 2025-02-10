import { useState } from "react";
import ScoreMiCuenta from "./Score";
import styles from "./Valoraciones.module.css"
import Comentarios from "./Comentarios";

const ValoracionesMiCuenta = () => {

  const estadisticas_valoraciones = [90, 67, 23, 1, 7];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className={styles.comentarios_container}>
      <section className={styles.valoraciones_container}>
        <article className={styles.valoraciones_info}>
          <div>
            <h2>Opiniones recibidas</h2>
          </div>
          <ScoreMiCuenta miCuenta={true} />
        </article>

        <article className={styles.valoraciones_statistics}>
          {estadisticas_valoraciones.map((puntuacion, index) => (
            <div key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <p>{estadisticas_valoraciones.length - index}</p>
              <progress max="100" value={puntuacion > 0 ? Math.max(puntuacion, 10) : 0} key={index} />
              {hoveredIndex === index && (
                <span>{puntuacion} valoraciones</span>
              )}
            </div>
          ))}
        </article>
      </section>

      <section className={styles.comentarios_section}>
        <Comentarios />
        <Comentarios />
      </section>
    </div>
  );
}

export default ValoracionesMiCuenta;
