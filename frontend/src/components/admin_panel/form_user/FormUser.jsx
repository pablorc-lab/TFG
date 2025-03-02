import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import styles from "./FormUser.module.css";
import { useEffect, useState } from "react";
import UsuarioService from "../../../services/UsuarioService";

export default function FormUser({ }) {
  const { userType } = useParams();
  const { userID } = useParams();
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [emailExistente, setEmailExistente] = useState(false);
  const [userService, setUserService] = useState(null);
  const [initialEmail, setInitialEmail] = useState(null);
  const [uploadingData, setUploadingData] = useState(false);

  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    fecha_nacimiento: "",
    privateID: "",
    profileImage: "",
  });

  // Cargar el servicio actual requerido
  useEffect(() => {
    const loadService = async () => {
      setUserService(
        userType === "anfitrion"
          ? (await import("../../../services/AnfitrionService")).default
          : (await import("../../../services/ViajeroService")).default
      );
    };
    loadService();
  }, [userType])

  // Obtener el usuario actual si se está EDITANDO
  useEffect(() => {
    if (userService && userID) {
      userService.getById(userID).then(response => {
        const usuario = response.data;
        setInitialEmail(usuario.email);
        //console.log(usuario);
        setUserData(prev => ({
          ...prev,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          fecha_nacimiento: usuario.fecha_nacimiento,
          privateID: usuario.privateID,
          profileImage: usuario.profileImage,
        }));
        console.log(response.data);
      }).catch(error => { console.error("Error al obtener el usuario ", error); })
    }
  }, [userService, userID]);

  // Si todo está bien, proceder a crear/actualizar la cuenta
  function sendUserData(userData) {
    setErrorInput(false);
    const userAction = userID ? userService.update(userID, userData) : userService.create(updatedUseruserDataData);

    userAction
      .then(response => {
        console.log(`Usuario ${userID ? "ACTUALIZADO" : "CREADO"} con éxito`, response);
        navigate(`/admin-panel/${userType}`);
      })
      .catch(error => {
        console.error(`Error al ${userID ? "ACTUALIZAR" : "CREAR"} el usuario:`, error);
      });
  }

  // Funcion para crear el usuario
  const continuarProceso = async () => {
    // Si hay imagen, subirla a ImgBB a traves de la api
    if (userData.profileImage instanceof File) {
      let updatedUserData = { ...userData };

      userService.uploadImage(userData.profileImage)
        .then(imageUrl => {
          console.log("Imagen subida con éxito:", imageUrl);
          updatedUserData.profileImage = imageUrl;

          sendUserData(updatedUserData);
        })
        .catch(error => {
          console.error("Error al subir la imagen:", error);
          return; // Detener si hay error en la subida de imagen
        });
    }
    else {
      sendUserData(userData);
    }
  }

  // Guardar o Editar cliente
  const saveOrUpdateCliente = (e) => {
    e.preventDefault();

    // Comprobar que todos estén rellenados
    if (Object.values(userData).some(value => !value)) {
      setErrorInput(true);
      return;
    }

    // Solo comprobar si el email ha cambiado
    if (initialEmail !== userData.email) {
      UsuarioService.existEmail(userData.email)
        .then(response => {
          setEmailExistente(response.data);
          console.log("Email existente : ", response.data);
          if (response.data) return; // Si el email existe, detenemos la ejecución

          // Proceder con la subida de imagen y creación/actualización del usuario
          continuarProceso();
        })
        .catch(error => console.error("Error al buscar el email:", error));
    }
    else {
      continuarProceso(); // Si el email no cambió, proceder directamente
    }

    setUploadingData(true);
  };

  // Campos de inputs para el formulario
  const InputField = ({ label, id, type, placeholder, value, campoOnChange }) => (
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

  // Formulario completo
  const FormularioUsuario = ({ userData, setUserData, saveOrUpdateCliente, userType }) => (
    <div className={styles.card_Body}>
      <form>
        {/* NOMBRE - APELLIDO*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Nombre", id: "nombre", type: "text", placeholder: "Pablo", value: userData.nombre, campoOnChange: "nombre" })}
          {InputField({ label: "Apellido", id: "apellido", type: "text", placeholder: "Ramblado", value: userData.apellido, campoOnChange: "apellido" })}
        </article>

        {/* EMAIL - PRIVATEID*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Email", id: "correo", type: "email", placeholder: "pablo@example.com", value: userData.email, campoOnChange: "email" })}
          {InputField({ label: "PrivateID", id: "privateID", type: "text", placeholder: "", value: userData.privateID, campoOnChange: "privateID" })}
        </article>

        {/* PASSWORD - FECHA NACIMIENTO*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Password", id: "password", type: "text", placeholder: "", value: userData.password, campoOnChange: "password" })}
          {InputField({ label: "Fecha de nacimiento", id: "fecha", type: "date", placeholder: "", value: userData.fecha_nacimiento, campoOnChange: "fecha_nacimiento" })}
        </article>

        {/* PROFILE IMAGE*/}
        <div className={`${styles.form_Group} ${styles.form_File}`}>
          <label htmlFor="profileIMG" className={styles.form_Label}>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            id="profileIMG"
            name="profileImage"
            onChange={(e) => setUserData(prev => ({ ...prev, profileImage: e.target.files[0] }))}
            className={styles.form_Control}
            spellCheck="false"
          />
        </div>

        <article className={styles.btn_Container}>
          <Link to={`/admin-panel/${userType}`}>
            <button className={styles.danger}>
              Cancelar
            </button>
          </Link>
          <button className={styles.save} onClick={(e) => saveOrUpdateCliente(e)}>Guardar</button>
        </article>
      </form>
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
            : FormularioUsuario({ userData, setUserData, saveOrUpdateCliente, userType })
          }
        </article>
      </section>
    </>
  );
}
