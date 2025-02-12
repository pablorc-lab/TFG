import styles from "./Vivienda.module.css";

const ViviendaMiCuenta = () => {
  return (
    <>
      <div className={styles.vivienda_title}>
        <h1>Vivienda Personal</h1>
        <button>
          <img src="/images/usuarios/account/pen_edit.webp" alt="Editar vivienda" />
          <p>Editar</p>
        </button>
      </div>
    </>
  );
}

export default ViviendaMiCuenta;
