import { useState } from "react"
import styles from "./accesos.module.css"

export default function Registrar_usuario(){
  const [firstStep, setFirstStep] = useState(true);

  // Acción que se realizará en el primer paso para terminar de crear la cuenta
  // Comprobar correo y contraseñas
  const handleFirstStepClick = (event) => {
    event.preventDefault();
    setFirstStep(false);
  }

  // Accionar que se realiza en el último paso, al crear finalmente la cuenta
  // Comprobar que nombre y apellidos solo tenga strings, y el id no tenga caracteres especiales, fecha con sentido
  const handleSubmit = () => {
    setFirstStep(false);
  }

  return (
    <section className={styles.acceso_section}>
      <header className={styles.acceso_header}>
        <figure>
          <img src="images/logos/logo_blanco.png"/>
          <figcaption>Bearfrens</figcaption>
        </figure>
      </header>

      <article className={styles.acceso_container}>
        <h1>Registrarse</h1>

        <form action="pagina.jar" className={!firstStep && styles.form_registro}>
          {firstStep ? (
            <>
              <div>
                <label for="email">Correo electrónico</label>
                <input type="email" id="email" name="email" spellCheck="false" />
              </div>
              <div>
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" />
              </div>
              <div>
                <label for="confirmPassword">Repetir contraseña</label>
                <input type="password" id="confirmPassword" name="confirmPassword" />
              </div>
              <input className={styles.submit_input} type="submit" value="Siguiente paso" onClick={handleFirstStepClick}/>
            </>
          ) : (
            <>
              <article className={styles.name_input}>
                <div>
                  <label for="nombre">Nombre</label>
                  <input type="text" id="nombre" name="nombre" spellCheck="false"/>
                </div>
                <div>
                  <label for="apellido">Apellido</label>
                  <input type="text" id="apellido" name="apellido" spellCheck="false"/>
                </div> 
              </article>
              <div>
                <label for="id_user">ID de usuario</label>
                <input type="text" id="id_user" name="id_user" placeholder="Nombre privado para identificarte" spellCheck="false"/>
              </div>
              <div>
                <label for="edad">Edad</label>
                <input type="date" id="edad" name="edad"/>
              </div>
              <input className={styles.submit_input} type="submit" value="Crear cuenta" onClick={handleSubmit}/>
            </>
          )}
        </form>
      </article>
    </section>
  )
}