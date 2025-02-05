import styles from "./accesos.module.css"
import { Link } from "react-router-dom";

export default function InicioSesionPage(){
  return (
    <section className={styles.acceso_section}>
      <header className={styles.acceso_header}>
        <Link to="/inicio">
          <figure>
            <img src="/images/logos/logo_blanco.png" alt="logo blanco" />
            <figcaption>Bearfrens</figcaption>
          </figure>
        </Link>
      </header>

      <article className={styles.acceso_container}>
        <h1>Inicio de sesión</h1>

        <form action="pagina.jar" >
          <div className={styles.input_container}>
            <label for="email">Correo electrónico</label>
            <input type="email" id="email" name="email" spellCheck="false"/>
          </div>
          <div className={styles.input_container}>
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password"/>
            <Link to="/">¿Contraseña olvidada?</Link>
          </div>
          <input className={styles.submit_input} type="submit" value="Iniciar sesión"/>
        </form>

        <div className={styles.acceso_enlace_registro}>
          <h2>¿No tienes cuenta?</h2>
          <Link to="/registro">Registrarse ahora</Link>        </div>
      </article>
    </section>
  )
}