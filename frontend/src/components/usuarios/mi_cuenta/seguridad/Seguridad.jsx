import styles from "./Seguridad.module.css"

export default function SeguridadMiCuenta() {
  return (
    <section className={styles.seguridad_section}>
      <h1>Cambiar contraseña</h1>

      <article>
        <form className={styles.seguridad_form}>
          <div>
            <p>Nueva contraseña</p>
            <input type="password" name="password"/>
          </div>
          <div>
            <p>Repita la contraseña</p>
            <input type="password" name="repeat_password" />
          </div>
        </form>
        <button className={styles.seguridad_save}>Guardar cambios</button>
      </article>

      <div className={styles.seguridad_delete}>
        <button>Eliminar cuenta</button>
      </div>
    </section>
  )
}
