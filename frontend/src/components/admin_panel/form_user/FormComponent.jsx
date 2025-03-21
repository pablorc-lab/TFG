import { useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import styles from "./FormComponent.module.css";
import { useState } from "react";
import FormUser from "./FormUser";
import FormVivienda from "./FormVivienda";

export default function FormComponent({ }) {
  const { userType } = useParams();
  const { userID } = useParams();
  const [uploadingData, setUploadingData] = useState(false);
  const [errorInput, setErrorInput] = useState(false);
  const [emailExistente, setEmailExistente] = useState(false);

  // Campos de inputs para el formulario
  const InputField = ({ label, id, type, placeholder, value, campoOnChange, setUserData }) => (
    <div className={styles.form_Group}>
      <label htmlFor={id} className={styles.form_Label}>{label}</label>
      <input
        type={type}
        id={id}
        autoCorrect="false"
        placeholder={placeholder}
        className={styles.form_Control}
        value={value}
        onChange={(e) => setUserData(prev => ({ ...prev, [campoOnChange]: e.target.value }))} />
    </div>
  );

  return (
    <>
      <title>{`Admin panel | Crear ${userType}`}</title>

      <AdminHeader userType={userType} />
      <section className={styles.container}>
        <article className={styles.card}>
          <h2 className={styles.title}>{userID ? "Editar" : "Agregar"} <span>{userType}</span></h2>

          {errorInput && !uploadingData && <h3>POR FAVOR, RELLENA LOS CAMPOS</h3>}
          {emailExistente && !uploadingData && <h3>EL EMAIL YA ESTÁ EN USO</h3>}


          {uploadingData 
            ? <img src="/images/loading_gif.gif" alt="Cargando..." className={styles.loading_gif} /> 
            
            : (userType === "anfitrion" || userType === "viajero") ? 
              <FormUser 
                styles={styles}
                userType={userType} 
                userID={userID} 
                InputField={InputField} 
                setUploadingData={setUploadingData}
                setErrorInput={setErrorInput}
                setEmailExistente={setEmailExistente}
              /> 

            : userType === "viviendas" ? 
              <FormVivienda 
                styles={styles}
                userType={userType} 
                userID={userID} 
                InputField={InputField} 
                setUploadingData={setUploadingData}
                setErrorInput={setErrorInput}
              /> 
            : null
          }
        </article>
      </section>
    </>
  );
}