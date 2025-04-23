import styles from "./Editar.module.css"
import { lazy, Suspense, useState } from "react";
const EditarMiCuenta = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarMiCuenta })));
const EditarVivienda = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarVivienda })));
const EditarBiografia = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarBiografia })));
const EditarRecomendaciones = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarRecomendaciones })));

export default function EditarPerfil({ setIsOpen, showValue = 0, usuarioData = [], esViajero = false, userService, setEditedData }) {
  const [addImageState, setAddImageState] = useState(false);

  const [errorData, setErrorData] = useState(false);
  const [errorSameTitle, setErrorSameTitle] = useState(false);

  const [userData, setUserData] = useState(null);
  const [biografiaData, setBiografiaData] = useState(null);
  const [viviendaData, setViviendaData] = useState(null);
  const [recomendacionesData, setRecomendacionesData] = useState(null);

  // Comprueba si hay valores vacios, los gustos e imagenes pueden ser null
  const hayCamposNull = (data) => {
    // Comprobar datos usuario
    const valoresNulos = Object.entries(data).some(([key, value]) =>
      !key.startsWith("gusto") && !key.startsWith("imagen") && (value == null || value.trim() === '')
    );

    setErrorData(valoresNulos);
    console.log(valoresNulos);
    return valoresNulos;
  }

  // Comprueba si hay valores vacios en el contenido, sin tener en cuenta los opcionales
  const hayCamposNullContenido = (data) => {
    const valoresNulos = ["titulo", "descripcion"].some( 
      key => (data[key] == null || data[key].trim() === '')
    );
  
    setErrorData(valoresNulos);
    console.log(valoresNulos);
    return valoresNulos;
  };

  // Función asincrona para crear/editar la biografía
  const updateBiografia = async () => {
    const tipo_usuario = esViajero ? "viajeros" : "anfitriones";

    // Cargar dinámica del servicio
    const BiografiaService = (await import("../../../../services/biografias/BiografiasService")).default;

    // Realizar la operación correcta
    // Si no hay valores, es porque se está creando
    const OperacionBiografiaService = usuarioData.biografia == null
      ? BiografiaService.crear(tipo_usuario, usuarioData.usuario.id, biografiaData)
      : BiografiaService.update(tipo_usuario, usuarioData.usuario.id, biografiaData)

    OperacionBiografiaService
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setBiografiaData(null);
        setTimeout(() => setIsOpen(false), 200);
        setEditedData(true);
      });
  };

  // Función asincrona para crear/editar la vivienda
  const updateVivienda = async () => {
    // Cargar dinámica del servicio
    const ViviendasService = (await import("../../../../services/viviendas/ViviendasService")).default;

    // Realizar la operación correcta
    // Si no hay valores, es porque se está creando
    const OperacionViviendaService = usuarioData.usuario.vivienda == null
      ? ViviendasService.crearVivienda(usuarioData.usuario.id, viviendaData)
      : ViviendasService.updateVivienda(usuarioData.usuario.id, viviendaData);

    OperacionViviendaService
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setViviendaData(null);
        setTimeout(() => setIsOpen(false), 200);
        setEditedData(true);
      });
  };

  // Función que se ejecutará al guardar los cambios
  const handleSaveChanges = () => {
    // Si se ha editado los datos de usuario
    if (userData !== null && !hayCamposNull(userData)) {
      userService.update(usuarioData.usuario.id, userData)
        .then(response => console.log(response.data))
        .catch(error => console.error(error))
        .finally(() => {
          setUserData(null);
          setTimeout(() => setIsOpen(false), 200)
          setEditedData(true);
        });
    }

    // Si se ha editado los datos de biografía
    else if (biografiaData !== null && !hayCamposNull(biografiaData)) {
      updateBiografia();
    }

    // Si se ha editado los datos de la vivienda
    else if (viviendaData !== null && !hayCamposNull(viviendaData)) {
      updateVivienda();
    }

    // Si se ha editado todos los datos del contenido (recomendación o experiencia)
    else if (recomendacionesData !== null && !hayCamposNullContenido(recomendacionesData)) {
      // Si existe una recomendación con ese titulo salirse
      if(usuarioData.some(value => value.titulo.trim() === recomendacionesData.titulo.trim())){
        setErrorSameTitle(true);
        return;
      }
      setErrorSameTitle(false);
      console.log("creado con exito");
    }
  };

  return (
    <dialog className={styles.modal} ref={(el) => el && el.showModal()}>

      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        {/* Editar datos de "Mi cuenta" , "Biografía" o "Vivienda"*/}
        {showValue === 0 &&
          <EditarMiCuenta
            addImageState={addImageState}
            usuarioData={usuarioData.usuario}
            setAddImageState={setAddImageState}
            userData={userData}
            setUserData={setUserData}
          />}
        {showValue === 1 &&
          <EditarBiografia
            esViajero={esViajero}
            biografiaData={usuarioData.biografia}
            userData={biografiaData}
            setUserData={setBiografiaData}
          />}
        {showValue === 2 &&
          <EditarVivienda
            addImageState={addImageState}
            viviendaData={usuarioData.usuario.vivienda}
            setAddImageState={setAddImageState}
            userData={viviendaData}
            setUserData={setViviendaData}
          />}
        {showValue === 3 &&
          <EditarRecomendaciones
            esViajero={esViajero}
            recomendacionesData={usuarioData}
            userData={recomendacionesData}
            setUserData={setRecomendacionesData}
          />}
      </Suspense>

      {!errorData && errorSameTitle && <h3 className={styles.error_msg}>Ya existe una recomendación con ese titulo</h3>}
      {errorData && <h3 className={styles.error_msg}>Rellene todos los campos</h3>}

      <div className={styles.modal_buttons}>
        <button onClick={() => setIsOpen(false)}>CANCELAR</button>
        <button onClick={() => handleSaveChanges()}>GUARDAR</button>
      </div>
    </dialog >
  );
}
