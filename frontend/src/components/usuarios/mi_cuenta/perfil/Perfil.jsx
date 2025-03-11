import { lazy, useState } from "react";
import styles from "./Perfil.module.css";
import EditarPerfil from "../editar_datos/Editar";
const ContenidoMiCuenta = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoMiCuenta })));
const ContenidoVivienda = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoVivienda })));
const ContenidoBiografia = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoBiografia })));

const PerfilMiCuenta = ({ showValue = 0,  esViajero = false}) => {
  const [isOpen, setIsOpen] = useState(null);

  // Contenido mostrado al acceder a "Datos personales" o "Vivienda"
  return (
    <>
      <article className={styles.miCuenta_title}>
        {showValue === 0 && <h1>Información privada</h1>}
        {showValue === 1 && <h1>Biografía</h1>}
        {showValue === 2 && <h1>Vivienda personal</h1>}

        <button onClick={() => setIsOpen(true)}>
          <img src="/images/usuarios/account/pen_edit.webp" alt="Editar vivienda" />
          <p>Editar</p>
        </button>

        {isOpen && <EditarPerfil setIsOpen={setIsOpen} showValue={showValue}  esViajero={esViajero}/>}
      </article>

      {/* Mostrar datos de "Mi cuenta" , "Biografía" o "Vivienda" respectivamente*/}
      {showValue === 0 && <ContenidoMiCuenta />}
      {showValue === 1 && <ContenidoBiografia esViajero={esViajero}/>}
      {showValue === 2 && <ContenidoVivienda />}
    </>
  );
}

export default PerfilMiCuenta;
