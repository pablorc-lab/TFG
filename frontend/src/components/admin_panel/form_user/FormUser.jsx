import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UsuarioService from "../../../services/users/UsuarioService";

export default function FormUser({ styles, userType, userID, InputField, setUploadingData, setErrorInput, setEmailExistente }) {
  const navigate = useNavigate();
  const [userService, setUserService] = useState(null);
  const [initialEmail, setInitialEmail] = useState(null);

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
          ? (await import("../../../services/users/AnfitrionService")).default
          : (await import("../../../services/users/ViajeroService")).default
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


  return (
    <div className={styles.card_Body}>
      <form>
        {/* NOMBRE - APELLIDO*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Nombre", id: "nombre", type: "text", placeholder: "Pablo", value: userData.nombre, campoOnChange: "nombre", setUserData })}
          {InputField({ label: "Apellido", id: "apellido", type: "text", placeholder: "Ramblado", value: userData.apellido, campoOnChange: "apellido", setUserData })}
        </article>

        {/* EMAIL - PRIVATEID*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Email", id: "correo", type: "email", placeholder: "pablo@example.com", value: userData.email, campoOnChange: "email", setUserData })}
          {InputField({ label: "PrivateID", id: "privateID", type: "text", placeholder: "", value: userData.privateID, campoOnChange: "privateID", setUserData })}
        </article>

        {/* PASSWORD - FECHA NACIMIENTO*/}
        <article className={styles.form_flex}>
          {InputField({ label: "Password", id: "password", type: "text", placeholder: "", value: userData.password, campoOnChange: "password", setUserData })}
          {InputField({ label: "Fecha de nacimiento", id: "fecha", type: "date", placeholder: "", value: userData.fecha_nacimiento, campoOnChange: "fecha_nacimiento", setUserData })}
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
          {userData.profileImage && (
            <img 
              src={userData.profileImage instanceof File
                ? URL.createObjectURL(userData.profileImage)
                : userData.profileImage}
              alt="Vista previa"
            />
          )}
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
}
