import styles from "./Editar.module.css"

export default function EditarMiCuenta({ setIsOpen }) {

  return (
    <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
      <h2>EDITAR VIVIENDA</h2>

      <article className={styles.modal_articles}>
        <h3>IMÁGENES</h3>
      </article>

      <article className={styles.modal_articles}>
        <h3>DETALLES</h3>
        <div className={styles.input_container}>
          <div className={styles.input_detalles}>
            <p>Habitaciones</p>
            <input type="number" placeholder="1 - 16" min="1" max="16" />
          </div>
          <div className={styles.input_detalles}>
            <p>Baños</p>
            <input type="number" placeholder="1 - 16" />
          </div>
        </div>
      </article>

      <article className={styles.modal_articles}>
        <h3>UBICACIÓN</h3>
        <div className={styles.input_container}>
          <div className={`${styles.input_detalles} ${styles.input_text}`}>
            <p>Provincia</p>
            <input type="text" placeholder="Granada" />
          </div>
          <div className={`${styles.input_detalles} ${styles.input_text}`}>
            <p>Ciudad</p>
            <input type="text" placeholder="Motril" />
          </div>
          <div className={styles.input_detalles}>
            <p>Precio (&euro; / noche)</p>
            <input type="number" placeholder="45" />
          </div>
        </div>
      </article>

      <div className={styles.modal_buttons}>
        <button onClick={() => setIsOpen(false)}>CANCELAR</button>
        <button onClick={() => setIsOpen(false)}>GUARDAR</button>
      </div>
    </dialog>
  );
}
