import styles from "./accesos.module.css"

export default function Iniciar_sesion(){
  return (
    <section className={styles.acceso_section}>
      <header className={styles.acceso_header}>
        <figure>
          <img src="images/logos/logo_blanco.png"/>
          <figcaption>Bearfrens</figcaption>
        </figure>
      </header>

      <article className={styles.acceso_container}>
        <h1>Inicio de sesión</h1>

        <form action="pagina.jar">
          <div>
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" spellCheck="false"/>
          </div>
          <div>
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password"/>
            <a href="/">¿Contraseña olvidada?</a>
          </div>
          
          <input className={styles.submit_input} type="submit" value="Iniciar sesión"/>
        </form>

        <div className={styles.acceso_enlace_registro}>
          <h2>¿No tienes cuenta?</h2>
          <a href="/">Registrarse ahora</a>
        </div>
      </article>
    </section>
  )
}