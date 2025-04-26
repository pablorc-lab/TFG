import { Suspense, useEffect, useState } from "react";
import styles from "./Recomendaciones.module.css";
import EditarPerfil from "../editar_datos/Editar";

// Maneja tanto experiencias como recomendaciones
const RecomendacionesMiCuenta = ({ esViajero, recomendacionesData = [], userService, setEditedData, userID = null }) => {
  const [isOpen, setIsOpen] = useState(null);

  const [editarRecomendacionData, setEditarRecomendacionData] = useState([]);
  const [titulosCreados, SetTitulosCreados] = useState([]);

  useEffect(() => {
    if(recomendacionesData){
      SetTitulosCreados(recomendacionesData.map(item => item.titulo));
    }
  }, [recomendacionesData]);

  const datos_recomendaciones = [
    { key: "recomendacion", label: "Sugerencia", icon: "backpack" },
    { key: "ayuda", label: "Importante", icon: "help" },
    { key: "ubicacion", label: "Ubicación", icon: "location" },
    { key: "horarios", label: "Horarios", icon: "clock" },
    { key: "telefono", label: "Teléfono", icon: "phone" },
  ];

  const deleteRecomendacion = async (titulo) => {
    const nombre_service = esViajero ? "ExperienciasService" : "RecomendacionService";
    const service = (await import(`../../../../services/contenido/${nombre_service}.jsx`)).default;
    const deleteAction = esViajero ? service.deleteExperiencia : service.deleteRecomendacion;
    
    deleteAction(userID, titulo)
    .then(response => console.log(response.data))
    .catch(error => console.error(error))
    .finally(() => setEditedData(true));
  };

  const editRecomendacion = (recomendacionData) => {
    setEditarRecomendacionData(recomendacionData);
    SetTitulosCreados(titulosCreados.filter(titulo => titulo !== recomendacionData.titulo))
    setTimeout(() => setIsOpen(true), 200);
  }

  return (
    <section className={styles.recomendaciones_main}>
      <h1>{esViajero ? "Experiencias" : "Recomendaciones"} - {recomendacionesData.length}</h1>

      {isOpen &&
        <Suspense fallback={<img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "200px", position: "relative", left: "50%", transform: "translateX(-50%)" }} />}>
          <EditarPerfil
            setIsOpen={setIsOpen}
            showValue={3}
            esViajero={esViajero}
            usuarioData={editarRecomendacionData}
            setUsuarioData={setEditarRecomendacionData}
            setEditedData={setEditedData}
            titulosCreados={titulosCreados}
            userID={userID}
          />
        </Suspense>
      }

      <ul className={styles.recomendaciones_container}>
        <li className={styles.add_recomendacion} onClick={() => setIsOpen(true)}>
          <img src="/images/usuarios/account/aniadir_recomendacion.svg" alt="Aniadir recomendacion" />
          <p>Añadir {esViajero ? "experiencia" : "recomendacion"}</p>
        </li>

        {recomendacionesData.length > 0
          ? (
            recomendacionesData.map((recomendacion, index) => (
              <li key={index}>
                <div className={styles.action_imgs}>
                  <img
                    src="/images/admin_panel/edit.svg"
                    alt="delete img"
                    onClick={() => editRecomendacion(recomendacion)}
                  />
                  <img
                    src="/images/usuarios/account/delete_img.svg"
                    alt="delete img"
                    onClick={() => deleteRecomendacion(recomendacion.titulo)}
                  />
                </div>

                <h3>{recomendacion.titulo}</h3>
                <p>{recomendacion.descripcion}</p>

                {datos_recomendaciones.map(({ key, label, icon }) =>
                  recomendacion[key] ? (
                    <div className={styles.logos_recomendations} key={key}>
                      <img src={`/images/profiles/recomendaciones/${icon}.svg`} alt={`Imagen ${label}`} />
                      <p><strong>{label}:</strong> {recomendacion[key]}</p>
                    </div>
                  ) : null
                )}
              </li>
            ))
          ) : <h2 style={{ textAlign: "center" }}> No se ha creado ningun recomendacion</h2>
        }
      </ul>
    </section>
  )
};

export default RecomendacionesMiCuenta;