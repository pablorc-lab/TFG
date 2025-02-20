import { useState } from "react";
import styles from "./accesos.module.css"
import { Link } from "react-router-dom";

export default function InicioSesionPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <title>Iniciar sesión | Bearfrens</title>
      <section className={styles.acceso_section}>
        <header className={styles.acceso_header}>
          <figure>
            <Link to="/inicio">
              <img src="/images/logos/logo_blanco.png" alt="logo blanco" />
              <figcaption>Bearfrens</figcaption>
            </Link>
          </figure>
        </header>

        <article className={styles.acceso_container}>
          <h1>Inicio de sesión</h1>

          <form action="pagina.jar" >
            <fieldset className={styles.input_container}>
              <label htmlFor="email">Correo electrónico</label>
              <input type="email" id="email" name="email" spellCheck="false" autoComplete="email" />
            </fieldset>
            <fieldset className={styles.input_container}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.input_password}>
                <img
                  src={`/images/registro/${showPassword ? "reveal" : "hide"}_password.svg`}
                  alt="Reveal password"
                  onClick={() => setShowPassword(!showPassword)}
                />
                <input type={showPassword ? "text" : "password"} id="password" name="password" />
              </div>
              <Link style={{ textAlign: "right" }} to="/">¿Contraseña olvidada?</Link>
            </fieldset>
            <input className={styles.submit_input} type="submit" value="Iniciar sesión" />
          </form>

          <div className={styles.acceso_enlace_registro}>
            <h2>¿No tienes cuenta?</h2>
            <Link to="/registro">Registrarse ahora</Link>
          </div>
        </article>
      </section>
    </>

  )
}