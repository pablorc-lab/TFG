import { useState } from "react";
import styles from "./Perfil.module.css";
import EditarMiCuenta from "../editar_datos/Editar";

const PerfilMiCuenta = ({ mostrarCuenta = true }) => {
  const [isOpen, setIsOpen] = useState(null);

  const vivienda_imgs = [
    "/images/landing_page/casa_1.webp",
    "/images/landing_page/casa_2.webp"
  ];

  const gustosImages = [
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ];

  // Contenido mostrado al acceder a "Vivienda"
  const contenidoVivienda = (
    <section className={styles.miCuenta_section}>
      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/vivienda_img.svg" alt="Imagen vivienda" />
          <p>IMÁGENES</p>
        </div>
        <div className={styles.vivienda_images}>
          {vivienda_imgs.map((path_img, index) => (
            <img key={index} src={path_img} alt={`Imagen ${index}`} />
          ))}
        </div>
      </article>

      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/vivienda_info.svg" alt="Info vivienda" />
          <p>DETALLES</p>
        </div>
        <ul className={styles.miCuenta_info}>
          <li>
            <h2>Viajeros</h2>
            <p>3</p>
          </li>
          <li>
            <h2>Habitaciones</h2>
            <p>1</p>
          </li>
          <li>
            <h2>Camas</h2>
            <p>2</p>
          </li>
          <li>
            <h2>Baños</h2>
            <p>1</p>
          </li>
        </ul>
      </article>

      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/vivienda_location.svg" alt="Localización vivienda" />
          <p>UBICACIÓN</p>
        </div>
        <ul className={styles.miCuenta_info}>
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
    </section>
  )

  // Contenido mostrado al acceder a "Datos personales"
  const contenidoCuenta = (
    <section className={styles.miCuenta_section}>
      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/informacion_perfil.svg" alt="Info vivienda" />
          <p>INFORMACIÓN</p>
        </div>
        <ul className={styles.miCuenta_info} >
          <li>
            <h2>Nombre</h2>
            <p>Pablo</p>
          </li>
          <li>
            <h2>Apellido</h2>
            <p>Ramblado</p>
          </li>
          <li>
            <h2>ID privado</h2>
            <p>PabloID123</p>
          </li>
          <li>
            <h2>Fecha de nacimiento</h2>
            <p>23-11-1998</p>
          </li>
        </ul>
      </article>

      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/contacto.svg" alt="Localización vivienda" />
          <p>CONTACTO</p>
        </div>
        <ul className={`${styles.miCuenta_info} ${styles.miCuenta_contacto}`}>
          <li>
            <h2>Email</h2>
            <p>pabloramblado@correo.example.es</p>
          </li>
          <li>
            <h2>Teléfono</h2>
            <p>666777999</p>
          </li>
        </ul>
      </article>

      <article>
        <div className={styles.miCuenta_data}>
          <img src="/images/usuarios/account/gustos.svg" alt="Localización vivienda" />
          <p>INTERESES</p>
        </div>
        <ul className={`${styles.miCuenta_info} ${styles.miCuenta_biografia}`}>
          <li>
            <h2>Biografía</h2>
            <p>Amante de la aventura y los viajes hacia lugares muy bonitos, ademas me gusto apasiona ir de pesca con mis hijos</p>
          </li>
          <li>
            <h2>Gustos :</h2>
            <div className={`${styles.miCuenta_info} ${styles.miCuenta_gustos}`}>
              {gustosImages.map((path, index) => (
                <img key={index} src={path} alt="Imagen gusto" />
              ))}
            </div>
          </li>
        </ul>
      </article>
    </section>
  )


  return (
    <>
      <article className={styles.miCuenta_title}>
        <h1>{mostrarCuenta ? "Información privada" : "Vivienda personal"}</h1>

        <button onClick={() => setIsOpen(true)}>
          <img src="/images/usuarios/account/pen_edit.webp" alt="Editar vivienda" />
          <p>Editar</p>
        </button>

        {isOpen && <EditarMiCuenta setIsOpen={setIsOpen} mostrarCuenta={mostrarCuenta} />}
      </article>

      {/* Mostrar datos de "mi cuenta" o "vivienda"*/}
      {mostrarCuenta ? contenidoCuenta : contenidoVivienda}
    </>
  );
}

export default PerfilMiCuenta;
