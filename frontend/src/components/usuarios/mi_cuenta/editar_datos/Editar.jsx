import styles from "./Editar.module.css"
import { lazy, Suspense, useState } from "react";
const EditarMiCuenta = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarMiCuenta })));
const EditarVivienda = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarVivienda })));
const EditarBiografia = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarBiografia })));
const EditarRecomendaciones = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarRecomendaciones })));

export default function EditarPerfil({ setIsOpen, showValue = 0, usuarioData = [], setUsuarioData = null, esViajero = false, userService, setEditedData, userID = null, titulosCreados = [] }) {
  const [addImageState, setAddImageState] = useState(false);

  const [errorData, setErrorData] = useState(false);
  const [errorSameTitle, setErrorSameTitle] = useState(false);

  const [sendingData, SetSendingData] = useState(false);
  const [userData, setUserData] = useState(null);
  const [biografiaData, setBiografiaData] = useState(null);
  const [viviendaData, setViviendaData] = useState(null);
  const [contenidoData, setContenidoData] = useState(null);

  // Comprueba si hay valores vacios, los gustos e imagenes pueden ser null
  const hayCamposNull = (data) => {
    // Comprobar datos usuario
    const valoresNulos = Object.entries(data).some(([key, value]) =>
      !key.startsWith("gusto") && !key.startsWith("imagen") && (value == null || value === '')
    );

    setErrorData(valoresNulos);
    console.log(valoresNulos);
    return valoresNulos;
  }

  // Comprueba si hay valores vacios en el contenido, sin tener en cuenta los opcionales
  const hayCamposNullContenido = (data) => {
    const valoresNulos = ["titulo", "descripcion"].some(
      key => (data[key] == null || data[key] === '')
    );

    setErrorData(valoresNulos);
    return valoresNulos;
  };

  // Función asincrona para crear/editar la biografía
  const updateBiografia = async () => {
    const tipo_usuario = esViajero ? "viajeros" : "anfitriones";
    const BiografiaService = (await import("../../../../services/biografias/BiografiasService.jsx")).default;

    // Si no hay valores, es porque se está creando
    const biografiaAction = usuarioData.biografia == null ? BiografiaService.crear : BiografiaService.update;

    biografiaAction(tipo_usuario, usuarioData.usuario.id, biografiaData)
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
    const ViviendasService = (await import("../../../../services/viviendas/ViviendasService.jsx")).default;

    // Subir cada imágen si son archivos
    let updatedViviendaData = { ...viviendaData };
    const imagenes = [viviendaData.imagen1, viviendaData.imagen2, viviendaData.imagen3, viviendaData.imagen4];

    await Promise.all(imagenes.map(async (image, index) => {
      if (image instanceof File) {
        try {
          const imageUrl = await ViviendasService.uploadImage(image);
          console.log(`Imagen ${index + 1} subida con éxito: `, imageUrl);
          updatedViviendaData[`imagen${index + 1}`] = imageUrl;
        }
        catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      }
    }));

    // Si no hay valores, es porque se está creando
    const viviendaAction = usuarioData.usuario.vivienda == null ? ViviendasService.crearVivienda : ViviendasService.updateVivienda;

    viviendaAction(usuarioData.usuario.id, updatedViviendaData)
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setTimeout(() => {
          setIsOpen(false);
          setViviendaData(null);
        }, 200);
        setEditedData(true);
      });
  };

  // Funcion para crear/editar la experiencia
  const updateExperiencia = async () => {
    const service = (await import("../../../../services/contenido/ExperienciasService.jsx")).default;
    const experienciaAction = usuarioData.length === 0
      ? service.crearExperiencia(userID, contenidoData)
      : service.updateExperiencia(userID, usuarioData.titulo, contenidoData);

    experienciaAction
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setTimeout(() => {
          setIsOpen(false);
          setContenidoData(null);
          setUsuarioData([]);
        }, 200);
        setEditedData(true);
      });
  };

  // Funcion para crear/editar la recomendacion
  const updateRecomendacion = async () => {
    const service = (await import("../../../../services/contenido/RecomendacionService.jsx")).default;
    const recomendacionAction = usuarioData.length === 0
      ? service.crearRecomendacion(userID, contenidoData)
      : service.updateRecomendacion(userID, usuarioData.titulo, contenidoData);

    recomendacionAction
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setTimeout(() => {
          setIsOpen(false);
          setContenidoData(null);
          setUsuarioData([]);
        }, 200);
        setEditedData(true);
      });
  };


  // Función que se ejecutará al guardar los cambios
  const handleSaveChanges = () => {
    // Si se ha editado los datos de usuario
    if (userData !== null && !hayCamposNull(userData)) {
      SetSendingData(true);
      userService.update(usuarioData.usuario.id, userData)
        .then(response => console.log(response.data))
        .catch(error => console.error(error))
        .finally(() => {
          setTimeout(() => {
            setIsOpen(false);
            setUserData(null);
          }, 200);
          setEditedData(true);
        });
    }

    // Si se ha editado los datos de biografía
    else if (biografiaData !== null && !hayCamposNull(biografiaData)) {
      SetSendingData(true);
      updateBiografia();
    }

    // Si se ha editado los datos de la vivienda
    else if (viviendaData !== null && !hayCamposNull(viviendaData)) {
      SetSendingData(true);
      updateVivienda();
    }

    // Si se ha editado todos los datos del contenido (recomendación o experiencia)
    else if (contenidoData !== null && !hayCamposNullContenido(contenidoData)) {
      // Si existe una recomendación/experiencia con ese titulo salirse
      if (titulosCreados.length > 0 && titulosCreados.includes(contenidoData.titulo.trim())) {
        setErrorData(false);
        setErrorSameTitle(true);
        return;
      }

      SetSendingData(true);
      // Crear recomendación/experiencia 
      esViajero ? updateExperiencia() : updateRecomendacion();
      setErrorSameTitle(false);
    }
  };

  const closeEditar = () => {
    setIsOpen(false);
    if (setUsuarioData) {
      setUsuarioData([]);
    }
  }

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
            userData={contenidoData}
            setUserData={setContenidoData}
          />}
      </Suspense>

      {!errorData && errorSameTitle && <h3 className={styles.error_msg}>Ya existe una recomendación con ese titulo</h3>}
      {errorData && <h3 className={styles.error_msg}>Rellene todos los campos</h3>}

      <div className={styles.modal_buttons}>
        <button onClick={() => closeEditar()}>CANCELAR</button>
        <button disabled={sendingData} onClick={() => !sendingData && handleSaveChanges()}>GUARDAR</button>
      </div>
    </dialog >
  );
}
