import { useState } from "react"
import styles from "./accesos.module.css"
import { validateEmail, validateNames, validateIdUser, validateAge } from "../../components/registro_usuarios/validations";
import { Link } from "react-router-dom";

export default function RegistrarUsuarioPage() {
  const [actualStep, setActualStep] = useState(0);
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);

  // Objeto que almacena todos los errores
  const [errorStates, setErrorStates] = useState({
    email: false,
    shortPassword: false,
    samePassword: false,
    name: false,
    lastName: false,
    userID: false,
    age: false,
    userType: false,
  });
  // Objeto que almacena cada valor
  const [userValues, setUserValues] = useState({
    email: "",
    password: "",
    name: "",
    lastname: "",
    userID: "",
    age: "",
    userType: "",
  })

  // Esta función permite cambiar el estado de cada valor
  function handleValuesChange(e, campo) {
    if (!campo || !(campo in userValues)) {
      throw new Error(`El campo '${campo}' introducido en 'handleValuesChange()' no es válido`);
    }

    const newValue = e.target.value.trim(); // Eliminar espacios 
    setUserValues({
      ...userValues,
      [campo]: newValue,
    });
  }

  // Esta función permite cambiar el estado de ERROR de una variable
  function handleErrorChange(campoErroneo, estado) {
    if (!campoErroneo || !(campoErroneo in errorStates)) {
      throw new Error(`El campo '${campoErroneo}' introducido en 'handleErrorChange()' no es válido`);
    }
    setErrorStates({
      ...errorStates,
      [campoErroneo]: estado
    })
  }

  // Acción que se realizará en el primer paso para terminar de crear la cuenta
  // Comprobar correo y contraseñas
  const handleSubmitFirstStep = (e) => {
    e.preventDefault();

    const validate_step_errors = actualStep === 0
      ? {
        email: !validateEmail(userValues.email),
        shortPassword: userValues.password.length < 8,
        samePassword: userValues.password !== repeatedPassword,
      } : {
        name: !validateNames(userValues.name),
        lastName: !validateNames(userValues.lastname),
        userID: !validateIdUser(userValues.userID),
        age: !validateAge(userValues.age),
      };

    Object.values(validate_step_errors).includes(true)
      ? setErrorStates({ ...errorStates, ...validate_step_errors })
      : setActualStep(actualStep + 1); // Se pasa al siguiente paso
  }


  // Accionar que se realiza en el último paso, al crear finalmente la cuenta
  // Comprobar que nombre y apellidos solo tenga strings, y el id no tenga caracteres especiales, fecha con sentido
  const handleSubmit = (e) => {
    e.preventDefault();

    // Actualizar el campo si está vacio
    const validate_user_type = userValues.userType === "";

    if (validate_user_type) {
      handleErrorChange("userType", userValues.userType === "");
    } else {
      console.log("Se han enviado los siguientes datos : ", userValues);
    }
  }

  // Formulario del primer paso del registro
  const FirstStepRegister = (
    <>
      <fieldset className={`${styles.input_container} ${errorStates.email && styles.error_input}`}>
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          spellCheck="false"
          value={userValues.email}
          onChange={(e) => handleValuesChange(e, "email")}
          onBlur={() => userValues.email && handleErrorChange("email", !validateEmail(userValues.email))}
          noValidate
        />
        {errorStates.email && <p>El email no es correcto</p>}
      </fieldset>
      <fieldset className={`${styles.input_container} ${errorStates.shortPassword && styles.error_input}`}>
        <label htmlFor="password">Contraseña</label>
        <div className={styles.input_password}>
          <img
            src={`/images/registro/${showPassword ? "reveal" : "hide"}_password.svg`}
            alt="Reveal password"
            onClick={() => setShowPassword(!showPassword)}
          />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={userValues.password}
            onChange={(e) => handleValuesChange(e, "password")}
            onBlur={() => userValues.password && handleErrorChange("shortPassword", userValues.password.length < 8)}
          />
        </div>
        {errorStates.shortPassword && <p>La contraseña debe tener mínimo 8 carácteres</p>}
      </fieldset>
      <fieldset className={`${styles.input_container} ${errorStates.samePassword && styles.error_input}`}>
        <label htmlFor="confirmPassword">Repetir contraseña</label>
        <div className={styles.input_password}>
          <img
            src={`/images/registro/${showRepeatedPassword ? "reveal" : "hide"}_password.svg`}
            alt="Reveal password"
            onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}
          />
          <input
            type={showRepeatedPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
            onBlur={() => errorStates.samePassword && handleErrorChange("samePassword", userValues.password !== repeatedPassword)}
          />
        </div>
        {errorStates.samePassword && <p>Las contraseñas no coinciden</p>}
      </fieldset>
      <input
        className={`${styles.submit_input} ${(errorStates.email || errorStates.shortPassword || errorStates.samePassword) && styles.error_submit_input}`}
        type="submit"
        name="submit"
        value="Siguiente paso"
        onClick={handleSubmitFirstStep}
      />
    </>
  );

  // Formulario del segundo paso del registro
  const SecondStepRegister = (
    <>
      <article className={`${styles.input_container} ${(errorStates.name || errorStates.lastName) && styles.error_input}`}>
        <div className={styles.name_input}>
          <fieldset>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              spellCheck="false"
              value={userValues.name}
              onChange={(e) => handleValuesChange(e, "name")}
              onBlur={() => userValues.name && handleErrorChange("name", !validateNames(userValues.name))}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              spellCheck="false"
              value={userValues.lastname}
              onChange={(e) => handleValuesChange(e, "lastname")}
              onBlur={() => userValues.lastname && handleErrorChange("lastName", !validateNames(userValues.lastname))}
            />
          </fieldset>
        </div>
        {(errorStates.name || errorStates.lastName) && <p className={styles.error_msg}>El nombre/apellido solo puede contener letras</p>}
      </article>
      <fieldset className={`${styles.input_container} ${errorStates.userID && styles.error_input}`}>
        <label htmlFor="id_user">ID de usuario</label>
        <input
          type="text"
          id="id_user"
          name="id_user"
          placeholder="Nombre privado para identificarte"
          spellCheck="false"
          value={userValues.userID}
          onChange={(e) => handleValuesChange(e, "userID")}
          onBlur={() => userValues.userID && handleErrorChange("userID", !validateIdUser(userValues.userID))}
        />
        {errorStates.userID && <p>El ID no puede contener carácteres especiales</p>}
      </fieldset>
      <fieldset className={`${styles.input_container} ${errorStates.age && styles.error_input}`}>
        <label htmlFor="edad">Edad</label>
        <input
          type="date"
          id="edad"
          name="edad"
          value={userValues.age}
          onChange={(e) => handleValuesChange(e, "age")}
          onBlur={() => handleErrorChange("age", !validateAge(userValues.age))}
        />
        {errorStates.age && <p>Edad no válida</p>}
      </fieldset>
      <input
        className={`${styles.submit_input} ${(errorStates.name || errorStates.lastName || errorStates.userID || errorStates.age) && styles.error_submit_input}`}
        type="submit"
        value="Último paso"
        onClick={handleSubmitFirstStep}
      />
    </>
  );

  const handleLastStepClick = (userTypeValue) => {
    handleValuesChange({ target: { value: userTypeValue } }, "userType");
    handleErrorChange("userType", false);
  };

  // Formulario del último paso del registro
  const LastStepRegister = (
    <>
      <h2 style={{ fontWeight: "normal" }}>¿Qué tipo de cuenta buscas?</h2>
      {errorStates.userType && <p className={`${styles.error_msg} ${styles.lastStepError}`}>Seleccione un tipo de cuenta</p>}
      <article className={`${styles.input_tipo_cuenta} ${userValues.userType === "viajero" && styles.active}`} onClick={() => handleLastStepClick("viajero")}>
        <img src="/images/registro/user_type_viajero.svg" alt="Tipo viajero" />
        <div>
          <h3>VIAJERO</h3>
          <p> <strong>Busca alojamiento</strong> en casas de anfitriones afines y <strong>conéctate con personas</strong> que compartan tus gustos. </p>
        </div>
      </article>
      <article className={`${styles.input_tipo_cuenta} ${userValues.userType === "anfitrion" && styles.active}`} onClick={() => handleLastStepClick("anfitrion")}>
        <img src="/images/registro/user_type_anfitrion.svg" alt="Tipo viajero" />
        <div>
          <h3>ANFITRIÓN</h3>
          <p> <strong>Alquila tu espacio </strong>a viajeros afines y <strong>elige a quién hospedar</strong> para crear experiencias únicas y personalizadas.</p>
        </div>
      </article>
      <input
        className={`${styles.submit_input} ${errorStates.userType && styles.error_submit_input}`}
        type="submit"
        value="Crear cuenta"
        onClick={handleSubmit}
      />
    </>
  );

  /*Funciones para verificar los campos*/
  return (
    <>
      <title>Registrar usuario | Bearfrens</title>
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
          <h1>Registrarse</h1>
          <div className={styles.progress_bar}>
            <progress max="100" value={actualStep >= 0 && 100} />
            <progress max="100" value={actualStep >= 1 && 100} />
            <progress max="100" value={actualStep >= 2 && 100} />
          </div>
          <form action="pagina.jar" className={styles.form_registro} style={{ gap: Object.values(errorStates).slice(0, -1).includes(true) && "15px" }} noValidate>
            {actualStep === 0 && FirstStepRegister}
            {actualStep === 1 && SecondStepRegister}
            {actualStep === 2 && LastStepRegister}
          </form>
        </article>
      </section>
    </>
  )
}