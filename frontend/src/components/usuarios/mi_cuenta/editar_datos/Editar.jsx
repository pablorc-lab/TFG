import styles from "./Editar.module.css"
import { lazy, Suspense, useState } from "react";
const EditarMiCuenta = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarMiCuenta })));
const EditarVivienda = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarVivienda })));
const EditarBiografia = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarBiografia })));
const EditarRecomendaciones = lazy(() => import("./EditarValues").then(functions => ({ default: functions.EditarRecomendaciones })));

export default function EditarPerfil({ setIsOpen, showValue = 0, esViajero = false }) {
  const [addImageState, setAddImageState] = useState(false);

  return (
    <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
      <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", transform: "translateX(-50%)" }} />}>
        {/* Editar datos de "Mi cuenta" , "Biografía" o "Vivienda"*/}
        {showValue === 0 && <EditarMiCuenta addImageState={addImageState} setAddImageState={setAddImageState} />}
        {showValue === 1 && <EditarBiografia esViajero={esViajero}/>}
        {showValue === 2 && <EditarVivienda addImageState={addImageState} setAddImageState={setAddImageState} />}
        {showValue === 3 && <EditarRecomendaciones />}

        <div className={styles.modal_buttons}>
          <button onClick={() => setIsOpen(false)}>CANCELAR</button>
          <button onClick={() => setIsOpen(false)}>GUARDAR</button>
        </div>
      </Suspense>

    </dialog>
  );
}
