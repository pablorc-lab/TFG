import { useState } from "react"
import styles from "./accesos.module.css"
import { validateEmail } from "./validations";

export default function Registrar_usuario(){
  const [firstStep, setFirstStep] = useState(true);

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errorShortPassword, SetErrorShortPassword] = useState(false);
  const [errorSamePassword, SetErrorSamePassword] = useState(false);

  // Acción que se realizará en el primer paso para terminar de crear la cuenta
  // Comprobar correo y contraseñas
  const handleFirstStepClick = (e) => {
    if(hayErroresFirstStep()){
      e.preventDefault();
    }
    else{
      setFirstStep(false);
    }
  }

  // Accionar que se realiza en el último paso, al crear finalmente la cuenta
  // Comprobar que nombre y apellidos solo tenga strings, y el id no tenga caracteres especiales, fecha con sentido
  const handleSubmit = () => {
    setFirstStep(false);
  }

  const hayErroresFirstStep = () => {
    const incorrectEmail = errorEmail || email.length < 1;
    const incorrectPassword = errorSamePassword || errorShortPassword || password.length < 8;
    return incorrectEmail || incorrectPassword;
  }
  /*Funciones para verificar los campos*/
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

        <form action="pagina.jar" className={!firstStep && styles.form_registro} style={{ gap: errorEmail && '20px'}} noValidate>
          {firstStep ? (
            <>
              <div>
                <label for="email" style={{ color: errorEmail && 'red'}}>Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  spellCheck="false" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => (email.length > 0) && setErrorEmail(!validateEmail(email))}         
                  no
                  style={{ borderColor: errorEmail && 'red'}}
                />
                {errorEmail && <p className={styles.error_msg}>El email no es correcto</p>}
              </div>
              <div>
                <label for="password" style={{ color: errorShortPassword && 'red'}}>Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => (password.length > 1) && SetErrorShortPassword(password.length < 8)}         
                  style={{ borderColor: errorShortPassword && 'red'}}
                />
                {errorShortPassword && <p className={styles.error_msg}>La contraseña debe tener mínimo 8 carácteres</p>}

              </div>
              <div>
                <label for="confirmPassword">Repetir contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={repeatedPassword}
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  onBlur={() => SetErrorSamePassword(repeatedPassword !== password)}         
                  style={{ borderColor: errorSamePassword && 'red'}}
                />
                {errorSamePassword && <p className={styles.error_msg}>Las contraseñas no coinciden</p>}
              </div>
              <input 
                className={styles.submit_input} 
                type="submit" 
                value="Siguiente paso" 
                onClick={handleFirstStepClick}
                style={{cursor: hayErroresFirstStep() ? 'not-allowed' : 'default', filter: hayErroresFirstStep() ? 'brightness(0.8)' : 'none'}}
              />
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
              <input 
                className={styles.submit_input} 
                type="submit" 
                value="Crear cuenta" 
                onClick={(handleSubmit)}
              />
            </>
          )}
        </form>
      </article>
    </section>
  )
}