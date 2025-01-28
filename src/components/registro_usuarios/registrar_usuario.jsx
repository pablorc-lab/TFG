import { useState } from "react"
import styles from "./accesos.module.css"
import { validateEmail, validateNames, validateIdUser, validateAge} from "./validations";

export default function Registrar_usuario(){
  const [firstStep, setFirstStep] = useState(true);
  const [repeatedPassword, setRepeatedPassword] = useState("");
  // Objeto que almacena todos los errores
  const [errorStates, setErrorStates] = useState({
    email: false,
    shortPassword: false,
    samePassword: false,
    name: false,
    lastName: false,
    userID: false,
    age: false,
  });
  // Objeto que almacena cada valor
  const [userValues, setUserValues] = useState({
    email : "",
    password : "",
    name : "",
    lastname : "",
    userID : "",
    age : ""
  })

    // Esta función permite cambiar el estado de cada valor
  function handleValuesChange(e, campo) {
    if (!campo || !(campo in userValues)) {
      throw new Error(`El campo '${campo}' introducido en 'handleValuesChange()' no es válido`);
    }
    const newValue = e.target.value.trim(); // Eliminar espacios 
      setUserValues({
        ...userValues,
        [campo] : newValue,
      });
  }
  
  // Esta función permite cambiar el estado de error de una variable
  function handleErrorChange(campoErroneo, estado){
    if (!campoErroneo || !(campoErroneo in errorStates)) {
      throw new Error(`El campo '${campoErroneo}' introducido en 'handleErrorChange()' no es válido`);
    }
    setErrorStates({
      ...errorStates,
      [campoErroneo] : estado
    })
  }

  // Acción que se realizará en el primer paso para terminar de crear la cuenta
  // Comprobar correo y contraseñas
  const handleSubmitFirstStep = (e) => {
    e.preventDefault();
    
    const first_step_errors = {
      email: !validateEmail(userValues.email),
      shortPassword: userValues.password.length < 8,
      samePassword: userValues.password !== repeatedPassword,
    };

    Object.values(first_step_errors).includes(true) 
      ? setErrorStates({...errorStates, ...first_step_errors}) 
      : setFirstStep(false); // Se pasa al siguiente paso
  }


  // Accionar que se realiza en el último paso, al crear finalmente la cuenta
  // Comprobar que nombre y apellidos solo tenga strings, y el id no tenga caracteres especiales, fecha con sentido
  const handleSubmit = (e) => {
    e.preventDefault();
    const second_step_errors = {
      name: !validateNames(userValues.name),
      lastName: !validateNames(userValues.lastname),
      userID: !validateIdUser(userValues.userID),
      age: !validateAge(userValues.age),
    };
    
    if(Object.values(second_step_errors).includes(true)){
      
      setErrorStates({ ...errorStates, ...second_step_errors});
    }else{
      console.log("Se han enviado los siguientes datos : ", userValues);
    }
  }

  /*Funciones para verificar los campos*/
  return (
    <section className={styles.acceso_section}>
      <header className={styles.acceso_header}>
        <figure>
          <img src="images/logos/logo_blanco.png" alt="logo blanco"/>
          <figcaption>Bearfrens</figcaption>
        </figure>
      </header>

      <article className={styles.acceso_container}>
        <h1>Registrarse</h1>

        <form action="pagina.jar" className={styles.form_registro} style={{gap: Object.values(errorStates).includes(true) && "15px"}} noValidate>
          {firstStep ? (
            <>
              <div className={`${styles.input_container} ${errorStates.email && styles.error_input}`}>
                <label htmlFor="email">Correo electrónico</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  spellCheck="false" 
                  value={userValues.email}
                  onChange={(e) => handleValuesChange(e,"email")}
                  onBlur={() => userValues.email && handleErrorChange("email",!validateEmail(userValues.email))}
                  noValidate
                />
                {errorStates.email && <p>El email no es correcto</p>}
              </div>
              <div className={`${styles.input_container} ${errorStates.shortPassword && styles.error_input}`}>
                <label htmlFor="password">Contraseña</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={userValues.password}
                  onChange={(e) => handleValuesChange(e,"password")}
                  onBlur={() => userValues.password && handleErrorChange("shortPassword",userValues.password.length < 8)}
                />
                {errorStates.shortPassword && <p>La contraseña debe tener mínimo 8 carácteres</p>}
              </div>
              <div className={`${styles.input_container} ${errorStates.samePassword && styles.error_input}`}>
                <label htmlFor="confirmPassword">Repetir contraseña</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={repeatedPassword}
                  onChange={(e) => setRepeatedPassword(e.target.value)}
                  onBlur={() => errorStates.samePassword && handleErrorChange("samePassword", userValues.password !== repeatedPassword)}
                />
                {errorStates.samePassword && <p>Las contraseñas no coinciden</p>}
              </div>
              <input 
                className={`${styles.submit_input} ${(errorStates.email || errorStates.shortPassword || errorStates.samePassword) && styles.error_submit_input}`}
                type="submit" 
                value="Siguiente paso" 
                onClick={handleSubmitFirstStep}            
              />
            </>
          ) : (
            <>
              <article className={`${styles.input_container} ${(errorStates.name||errorStates.lastName) && styles.error_input}`}>
                <div className={styles.name_input}>
                  <div>
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      spellCheck="false"
                      value={userValues.name}
                      onChange={(e) => handleValuesChange(e,"name")}
                      onBlur={() => userValues.name && handleErrorChange("name",!validateNames(userValues.name))}
                    />
                  </div>
                  <div>
                    <label htmlFor="apellido">Apellido</label>
                    <input 
                      type="text" 
                      id="apellido" 
                      name="apellido" 
                      spellCheck="false"
                      value={userValues.lastname}
                      onChange={(e) => handleValuesChange(e,"lastname")}
                      onBlur={() => userValues.lastname && handleErrorChange("lastName",!validateNames(userValues.lastname))}
                    />
                  </div> 
                </div>
                {(errorStates.name||errorStates.lastName) && <p className={styles.error_msg}>El nombre/apellido solo puede contener letras</p>}
              </article>
              <div className={`${styles.input_container} ${errorStates.userID && styles.error_input}`}>
                <label htmlFor="id_user">ID de usuario</label>
                <input 
                  type="text" 
                  id="id_user" 
                  name="id_user" 
                  placeholder="Nombre privado para identificarte" 
                  spellCheck="false"
                  value={userValues.userID}
                  onChange={(e) => handleValuesChange(e,"userID")}
                  onBlur={() => userValues.userID && handleErrorChange("userID",!validateIdUser(userValues.userID))}
                />
                {errorStates.userID && <p>El ID no puede contener carácteres especiales</p>}
              </div>
              <div className={`${styles.input_container} ${errorStates.age && styles.error_input}`}>
                <label htmlFor="edad">Edad</label>
                <input 
                  type="date" 
                  id="edad" 
                  name="edad"
                  value={userValues.age}
                  onChange={(e) => handleValuesChange(e,"age")}
                  onBlur={() => handleErrorChange("age",!validateAge(userValues.age))}
                />
                {errorStates.age && <p>Edad no válida</p>}
              </div>
              <input 
                className={`${styles.submit_input} ${(errorStates.name || errorStates.lastName || errorStates.userID || errorStates.age) && styles.error_submit_input}`}
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