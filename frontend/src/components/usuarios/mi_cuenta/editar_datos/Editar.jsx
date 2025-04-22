import styles from "./Editar.module.css"
import { lazy, Suspense, useState } from "react";
const EditarMiCuenta = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarMiCuenta })));
const EditarVivienda = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarVivienda })));
const EditarBiografia = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarBiografia })));
const EditarRecomendaciones = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarRecomendaciones })));

export default function EditarPerfil({ setIsOpen, showValue = 0, usuarioData = [], esViajero = false, userService, setEditedData }) {
  const [addImageState, setAddImageState] = useState(false);

  const [userData, setUserData] = useState(null);
  const [biografiaData, setBiografiaData] = useState(null);
  const [viviendaData, setViviendaData] = useState(null);

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
    if (userData !== null) {
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
    else if (biografiaData !== null) {
      updateBiografia();
    }

    // Si se ha editado los datos de la vivienda
    else if (viviendaData !== null) {
      updateVivienda();
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
            recomendacionesData={usuarioData.usuario.recomendaciones}
            userService={userService}
            setUserData={setUserData}
          />}
      </Suspense>

      <div className={styles.modal_buttons}>
        <button onClick={() => setIsOpen(false)}>CANCELAR</button>
        <button onClick={() => handleSaveChanges()}>GUARDAR</button>
      </div>
    </dialog >
  );
}
