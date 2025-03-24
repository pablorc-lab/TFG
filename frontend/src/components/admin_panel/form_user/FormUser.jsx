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
    gusto1: "",
    gusto2: "",
    gusto3: "",
    descripcion: "",
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
        const usuario = response.data.usuario || response.data;
        setInitialEmail(usuario.email);
        //console.log(usuario);
        setUserData(prev => ({
          ...prev,
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          email: usuario.email || "",
          fecha_nacimiento: usuario.fecha_nacimiento || "",
          privateID: usuario.privateID || "",
          profileImage: usuario.profileImage || "",
          gusto1: usuario.gusto1 || "",
          gusto2: usuario.gusto2 || "",
          gusto3: usuario.gusto3 || "",
          descripcion: usuario.descripcion || "",
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
    if (Object.entries(userData).some(([key, value]) => !value && key !== "password" && key !== "profileImage")) {
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

        {/*GUSTOS */}
        <article className={styles.form_flex}>
          {InputField({ label: "Gusto 1", id: "gusto1", type: "text", placeholder: "Ej: fútbol", value: userData.gusto1, campoOnChange: "gusto1", setUserData })}
          {InputField({ label: "Gusto 2", id: "gusto2", type: "text", placeholder: "Ej: baloncesto", value: userData.gusto2, campoOnChange: "gusto2", setUserData })}
        </article>
        <article className={styles.form_flex}>
          {InputField({ label: "Gusto 3", id: "gusto3", type: "text", placeholder: "Ej: pescar", value: userData.gusto3, campoOnChange: "gusto3", setUserData })}
          {InputField({ label: "Descripcion", id: "descripcion", type: "text", placeholder: "Me gusta pasear", value: userData.descripcion, campoOnChange: "descripcion", setUserData })}
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
