import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ViviendaService from '../../../services/viviendas/ViviendasService';

export default function FormVivienda({ styles, userType, userID, InputField, setUploadingData }) {
  const navigate = useNavigate();

  const [viviendaData, setViviendaData] = useState({
    anfitrion_id: "",
    imagen1: "",
    imagen2: "",
    imagen3: "",
    imagen4: "",
    viajeros: "",
    habitaciones: "",
    camas: "",
    banios: "",
    provincia: "",
    ciudad: "",
    precio_noche: "",
  });

  // Obtener el usuario actual si se está EDITANDO
  useEffect(() => {
    if (userID) {
      ViviendaService.getVivienda(userID)
        .then(response => {
          const vivienda = response.data;
          setViviendaData(prev => ({
            ...prev,
            anfitrion_id: vivienda.anfitrion_id || "",
            imagen1: vivienda.imagen1 || "",
            imagen2: vivienda.imagen2 || "",
            imagen3: vivienda.imagen3 || "",
            imagen4: vivienda.imagen4 || "",
            viajeros: vivienda.viajeros || "",
            habitaciones: vivienda.habitaciones || "",
            camas: vivienda.camas || "",
            banios: vivienda.banios || "",
            provincia: vivienda.provincia || "",
            ciudad: vivienda.ciudad || "",
            precio_noche: vivienda.precio_noche || "",
          }));
          console.log(response.data);
        })
        .catch(error => {
          console.error("Error al obtener la vivienda: ", error);
        });
    }
  }, [userID]);

  // Guardar o Editar vivienda
  const saveOrUpdateVivienda = async (e) => {
    e.preventDefault();

    // Subir cada imágen si son archivos
    let updatedViviendaData = { ...viviendaData };
    const imagenes = [viviendaData.imagen1, viviendaData.imagen2, viviendaData.imagen3, viviendaData.imagen4];

    await Promise.all(imagenes.map(async (image, index) => {
      if (image instanceof File) {
        try {
          const imageUrl = await ViviendaService.uploadImage(image);
          console.log(`Imagen ${index + 1} subida con éxito: `, imageUrl);
          updatedViviendaData[`imagen${index + 1}`] = imageUrl;
        }
        catch (error) {
          console.error("Error al subir la imagen:", error);
        }
      }
    }));

    // Realizar la operación correcta
    // Si no hay valores, es porque se está creando
    const OperacionViviendaService = userID == null
      ? ViviendaService.crearVivienda(viviendaData.anfitrion_id, updatedViviendaData)
      : ViviendaService.updateVivienda(viviendaData.anfitrion_id, updatedViviendaData);

    OperacionViviendaService
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => navigate(`/admin-panel/viviendas`));

    setUploadingData(true);
  };

  return (
    <div className={styles.card_Body}>
      <form>
        {InputField({ label: "ID anfitrión", id: "anfitrion_id", type: "number", placeholder: "4", value: viviendaData.anfitrion_id, campoOnChange: "anfitrion_id", setUserData: setViviendaData })}

        {/* PROPIEDADES NUMÉRICAS */}
        <article className={styles.form_flex}>
          {InputField({ label: "Viajeros", id: "viajeros", type: "number", placeholder: "4", value: viviendaData.viajeros, campoOnChange: "viajeros", setUserData: setViviendaData })}
          {InputField({ label: "Habitaciones", id: "habitaciones", type: "number", placeholder: "2", value: viviendaData.habitaciones, campoOnChange: "habitaciones", setUserData: setViviendaData })}
        </article>

        <article className={styles.form_flex}>
          {InputField({ label: "Camas", id: "camas", type: "number", placeholder: "3", value: viviendaData.camas, campoOnChange: "camas", setUserData: setViviendaData })}
          {InputField({ label: "Baños", id: "banios", type: "number", placeholder: "1", value: viviendaData.banios, campoOnChange: "banios", setUserData: setViviendaData })}
        </article>

        {/* UBICACIÓN */}
        <article className={styles.form_flex}>
          {InputField({ label: "Provincia", id: "provincia", type: "text", placeholder: "Madrid", value: viviendaData.provincia, campoOnChange: "provincia", setUserData: setViviendaData })}
          {InputField({ label: "Ciudad", id: "ciudad", type: "text", placeholder: "Madrid", value: viviendaData.ciudad, campoOnChange: "ciudad", setUserData: setViviendaData })}
        </article>

        {/* PRECIO */}
        {InputField({ label: "Precio por noche", id: "precio_noche", type: "number", placeholder: "100", value: viviendaData.precio_noche, campoOnChange: "precio_noche", setUserData: setViviendaData })}

        {/* IMÁGENES */}
        <div className={`${styles.form_Group} ${styles.form_File}`}>
          <label className={styles.form_Label}>Imágenes</label>
          {["imagen1", "imagen2", "imagen3", "imagen4"].map((img, index) => (
            <div className={styles.house_img} key={index}>
              <input
                type="file"
                accept="image/*"
                className={styles.form_Control}
                onChange={(e) => setViviendaData(prev => ({ ...prev, [img]: e.target.files[0] }))}
              />
              {viviendaData[img] && (
                <img
                  src={viviendaData[img] instanceof File ? URL.createObjectURL(viviendaData[img]) : viviendaData[img]}
                  alt={`Vista previa ${img}`}
                  className={styles.preview_image}
                />
              )}
            </div>
          ))}

        </div>

        {/* BOTONES */}
        <article className={styles.btn_Container}>
          <Link to={`/admin-panel/${userType}`}>
            <button className={styles.danger}>Cancelar</button>
          </Link>
          <button className={styles.save} onClick={(e) => saveOrUpdateVivienda(e)}>Guardar</button>
        </article>
      </form>
    </div>
  )
}
