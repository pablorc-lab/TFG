import styles from "./Recomendaciones.module.css";

const RecomendacionesMiCuenta = () => {

  return (
    <section className={styles.recomendaciones_main}>
      <h1>Recomendaciones - 2</h1>

      <ul className={styles.recomendaciones_container}>
        <li className={styles.add_recomendacion}>
          <img src="/images/usuarios/account/aniadir_recomendacion.svg" alt="Aniadir recomendacion" />
          <p>Añadir recomendacion</p>
        </li>

        <li>
          <h3>Restaurante favorito en la ciudad</h3>
          <p>
            Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’. Su especialidad es el pescado fresco y los platos tradicionales. Además, si vas los viernes, hay música en vivo. ¡Te encantará!
          </p>
          <div className={styles.logos_recomendations}>
            <img src="/images/usuarios/account/aniadir_recomendacion.svg" alt="Aniadir recomendacion" />
            <p><strong>Ubicación: </strong>Calle Mayor, 23, 18028.</p>
          </div>
        </li>

        <li>
          <h3>Restaurante favorito en la ciudad</h3>
          <p>
            Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’. Su especialidad es el pescado fresco y los platos tradicionales. Además, si vas los viernes, hay música en vivo. ¡Te encantará!
          </p>
          <div className={styles.logos_recomendations}>
            <img src="/images/usuarios/account/aniadir_recomendacion.svg" alt="Aniadir recomendacion" />
            <p><strong>Ubicación: </strong>Calle Mayor, 23, 18028.</p>
          </div>
        </li>
      </ul>
    </section>
  )
};

export default RecomendacionesMiCuenta;