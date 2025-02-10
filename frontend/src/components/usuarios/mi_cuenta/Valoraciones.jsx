import { useState } from "react";
import ScoreMiCuenta from "./Score";
import styles from "./Valoraciones.module.css"

const ValoracionesMiCuenta = () => {

  const estadisticas_valoraciones = [90, 67, 23, 1, 7];
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className={styles.valoraciones_container}>
      <article className={styles.valoraciones_info}>
        <div>
          <h2>Opiniones recibidas</h2>
        </div>
        <ScoreMiCuenta />
      </article>

      <article className={styles.valoraciones_statistics}>
        {estadisticas_valoraciones.map((puntuacion, index) => (
          <div onMouseEnter={() => setHoveredIndex(index)}  onMouseLeave={() => setHoveredIndex(null)}>
            <p>{estadisticas_valoraciones.length - index}</p>
            <progress max="100" value={puntuacion > 0 ? Math.max(puntuacion, 10) : 0} key={index} />
            {hoveredIndex === index && (
              <span>{puntuacion} valoraciones</span>
            )}
          </div>
        ))}
      </article>
    </section>
  );
}

export default ValoracionesMiCuenta;
