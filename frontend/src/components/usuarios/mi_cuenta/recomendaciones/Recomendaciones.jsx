import { Suspense, useState } from "react";
import styles from "./Recomendaciones.module.css";
import EditarPerfil from "../editar_datos/Editar";

const RecomendacionesMiCuenta = ({esViajero}) => {
  const [isOpen, setIsOpen] = useState(null);

  return (
    <section className={styles.recomendaciones_main}>
      <h1>{esViajero ? "Experiencias" : "Recomendaciones"} - 2</h1>

      {isOpen &&
        <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "200px", position: "relative", left: "50%", transform: "translateX(-50%)" }} />}>
          <EditarPerfil setIsOpen={setIsOpen} showValue={3} esViajero={esViajero}/>
        </Suspense>
      }

      <ul className={styles.recomendaciones_container}>
        <li className={styles.add_recomendacion} onClick={() => setIsOpen(true)}>
          <img src="/images/usuarios/account/aniadir_recomendacion.svg" alt="Aniadir recomendacion" />
          <p>Añadir {esViajero ? "experiencia" : "recomendacion"}</p>
        </li>
        <li>
          <h3>Restaurante favorito en la ciudad</h3>
          <p>
            Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’. Su especialidad es el pescado fresco y los platos tradicionales. Además, si vas los viernes, hay música en vivo. ¡Te encantará!
          </p>
          <div className={styles.logos_recomendations}>
            <img src="/images/profiles/recomendaciones/location.svg" alt="Aniadir recomendacion" />
            <p><strong>Ubicación: </strong>Calle Mayor, 23, 18028.</p>
          </div>
        </li>

        <li>
          <h3>Restaurante favorito en la ciudad</h3>
          <p>
            Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’. Su especialidad es el pescado fresco y los platos tradicionales. Además, si vas los viernes, hay música en vivo. ¡Te encantará!
          </p>
          <div className={styles.logos_recomendations}>
            <img src="/images/profiles/recomendaciones/location.svg" alt="Aniadir recomendacion" />
            <p><strong>Ubicación: </strong>Calle Mayor, 23, 18028.</p>
          </div>
          <div className={styles.logos_recomendations}>
            <img src="/images/profiles/recomendaciones/backpack.svg" alt="Aniadir recomendacion" />
            <p><strong>Recomendacion: </strong>Si decides ir a este restaurante, te recomiendo que vayas acompañado, ya que las porciones de los platos son bastante grandes. La cantidad de comida en cada plato es más que suficiente para satisfacer a varias personas.</p>
          </div>
        </li>
      </ul>
    </section>
  )
};

export default RecomendacionesMiCuenta;