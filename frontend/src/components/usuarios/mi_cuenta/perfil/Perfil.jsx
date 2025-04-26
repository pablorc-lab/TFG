import { lazy, useState } from "react";
import styles from "./Perfil.module.css";
import EditarPerfil from "../editar_datos/Editar";
const ContenidoMiCuenta = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoMiCuenta })));
const ContenidoVivienda = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoVivienda })));
const ContenidoBiografia = lazy(() => import("./PerfilValues").then(functions => ({ default: functions.ContenidoBiografia })));

const PerfilMiCuenta = ({ showValue = 0,  esViajero = false,  usuarioData=[], userService, setEditedData}) => {
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

        {isOpen && <EditarPerfil setIsOpen={setIsOpen} showValue={showValue} usuarioData={usuarioData} esViajero={esViajero} userService={userService} setEditedData={setEditedData}/>}
      </article>

      {/* Mostrar datos de "Mi cuenta" , "Biografía" o "Vivienda" respectivamente*/}
      {showValue === 0 && <ContenidoMiCuenta usuarioData={usuarioData.usuario} esViajero={esViajero}/>}
      {showValue === 1 && <ContenidoBiografia esViajero={esViajero} biografiaData={usuarioData.biografia}/>}
      {showValue === 2 && <ContenidoVivienda viviendaData={usuarioData.usuario.vivienda} />}
    </>
  );
}

export default PerfilMiCuenta;
