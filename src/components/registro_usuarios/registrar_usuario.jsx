import { useState } from "react"
import styles from "./accesos.module.css"
import { validateEmail, validateNames, validateIdUser, validateAge} from "./validations";

export default function Registrar_usuario(){
  const [firstStep, setFirstStep] = useState(false);

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [errorShortPassword, setErrorShortPassword] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState(false);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");

  const [lastName, setLastName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");

  const [userId, setUserId] = useState("");
  const [errorUserId, setErrorUserId] = useState("");

  const [age, setAge] = useState("");
  const [errorAge, setErrorAge] = useState("");

 
  // Acción que se realizará en el primer paso para terminar de crear la cuenta
  // Comprobar correo y contraseñas
  const handleFirstStepClick = (e) => {
    e.preventDefault();

    if(hayErroresFirstStep()){
      comprobarErrores();
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

  const comprobarErrores = () => {
    setErrorEmail(!validateEmail(email));
    setErrorShortPassword(password.length < 8);
    setErrorSamePassword(password !== repeatedPassword);
  };
  
  const hayErroresAlgunos = () => {
    return (errorEmail || errorSamePassword || errorShortPassword || errorName || errorLastName || errorUserId || errorAge);
  }

  const hayErroresFirstStep = () => {
    const incorrectEmail = !validateEmail(email) || email.length < 1;
    const incorrectPassword = (repeatedPassword !== password) || errorShortPassword || password.length < 8;
    return incorrectEmail || incorrectPassword;
  }

  const handleChangeName = (name, setValue) => {
       // No permitir espacios
    if(name[name.length-1] !== " ")
      setValue(name);
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

        <form action="pagina.jar" className={styles.form_registro} style={{gap: hayErroresAlgunos() && "15px"}} noValidate>
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
                  onBlur={() => setErrorEmail(!validateEmail(email))}
                  noValidate
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
                  onBlur={() => setErrorShortPassword(password.length < 8)}
                  style={{ borderColor: errorShortPassword && 'red'}}
                />
                {errorShortPassword && <p className={styles.error_msg}>La contraseña debe tener mínimo 8 carácteres</p>}
              </div>
              <div>
                <label for="confirmPassword" style={{ color: errorSamePassword && 'red'}}>Repetir contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={repeatedPassword}
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  onBlur={() => setErrorSamePassword(password !== repeatedPassword)}
                  style={{ borderColor: errorSamePassword && 'red'}}
                />
                {errorSamePassword && <p className={styles.error_msg}>Las contraseñas no coinciden</p>}
              </div>
              <input 
                className={styles.submit_input} 
                type="submit" 
                value="Siguiente paso" 
                onClick={handleFirstStepClick}
                style={{
                  filter: (errorEmail || errorShortPassword || errorSamePassword) ? "brightness(0.8)" : "none",
                  cursor: (errorEmail || errorShortPassword || errorSamePassword) ? "not-allowed" : "pointer"
                }}               
              />
            </>
          ) : (
            <>
              <article >
                <div className={styles.name_input}>
                  <div>
                    <label for="nombre" style={{ color: errorName && 'red'}}>Nombre</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      spellCheck="false"
                      value={name}
                      onChange={(e) => handleChangeName(e.target.value, setName)}
                      onBlur={() => setErrorName(!validateNames(name))}
                      style={{ borderColor: errorName && 'red'}}
                    />
                  </div>
                  <div>
                    <label for="apellido" style={{ color: errorLastName && 'red'}}>Apellido</label>
                    <input 
                      type="text" 
                      id="apellido" 
                      name="apellido" 
                      spellCheck="false"
                      value={lastName}
                      onChange={(e) => handleChangeName(e.target.value, setLastName)}
                      onBlur={() => setErrorLastName(!validateNames(lastName))}
                      style={{ borderColor: errorLastName && 'red'}}
                    />
                  </div> 
                </div>
                {(errorName||errorLastName) && <p className={styles.error_msg}>El nombre/apellido solo puede contener letras</p>}
              </article>
              <div >
                <label for="id_user" style={{ color: errorUserId && 'red'}}>ID de usuario</label>
                <input 
                  type="text" 
                  id="id_user" 
                  name="id_user" 
                  placeholder="Nombre privado para identificarte" 
                  spellCheck="false"
                  value={userId}
                  onChange={(e) => handleChangeName(e.target.value, setUserId)}
                  onBlur={() => setErrorUserId(!validateIdUser(userId))}
                  style={{ borderColor: errorUserId && 'red'}}
                />
                {errorUserId && <p className={styles.error_msg}>El ID no puede contener carácteres especiales</p>}
              </div>
              <div>
                <label for="edad" style={{ color: errorAge && 'red'}}>Edad</label>
                <input 
                  type="date" 
                  id="edad" 
                  name="edad"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onBlur={() => setErrorAge(!validateAge(age))}
                  style={{ borderColor: errorAge && 'red'}}
                />
                {errorAge && <p className={styles.error_msg}>Edad no válida</p>}
              </div>
              <input 
                className={styles.submit_input} 
                type="submit" 
                value="Crear cuenta" 
                onClick={(handleSubmit)}
                style={{
                  filter: (errorName || errorLastName || errorUserId || errorAge) ? "brightness(0.8)" : "none",
                  cursor: (errorName || errorLastName || errorUserId || errorAge) ? "not-allowed" : "pointer"
                }}  
              />
            </>
          )}
        </form>
      </article>
    </section>
  )
}