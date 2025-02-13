import { useState } from "react";
import styles from "./Vivienda.module.css";
import EditarMiCuenta from "../editar_datos/Editar";

const ViviendaMiCuenta = () => {
  const [isOpen, setIsOpen] = useState(null);

  return (
    <>
      <article className={styles.vivienda_title}>
        <h1>Vivienda Personal</h1>

        <button onClick={() => setIsOpen(true)}>
          <img src="/images/usuarios/account/pen_edit.webp" alt="Editar vivienda" />
          <p>Editar</p>
        </button>
        
        {isOpen && <EditarMiCuenta setIsOpen={setIsOpen}/>}
      </article>

      <article>
        <div className={styles.vivienda_data}>
          <img src="/images/usuarios/account/vivienda_img.svg" alt="Imagen vivienda" />
          <p>IMÁGENES</p>
        </div>
        <div className={styles.vivienda_images}>
          <img src="\images\landing_page\casa_1.webp" alt="Imagen de casa" />
          <img src="\images\landing_page\casa_2.webp" alt="Imagen de casa" />
        </div>
      </article>

      <article>
        <div className={styles.vivienda_data}>
          <img src="/images/usuarios/account/vivienda_info.svg" alt="Info vivienda" />
          <p>DETALLES</p>
        </div>
        <ul className={styles.vivienda_info}>
          <li>
            <h2>Habitaciones</h2>
            <p>2</p>
          </li>
          <li>
            <h2>Baños</h2>
            <p>1</p>
          </li>
        </ul>
      </article>

      <article>
        <div className={styles.vivienda_data}>
          <img src="/images/usuarios/account/vivienda_location.svg" alt="Localización vivienda" />
          <p>UBICACIÓN</p>
        </div>
        <ul className={styles.vivienda_info}>
          <li>
            <h2>Provincia</h2>
            <p>Granada</p>
          </li>
          <li>
            <h2>Ciudad</h2>
            <p>Armilla</p>
          </li>
          <li>
            <h2>Precio &euro; / noche</h2>
            <p>300 </p>
          </li>
        </ul>
      </article>
    </>
  );
}

export default ViviendaMiCuenta;
