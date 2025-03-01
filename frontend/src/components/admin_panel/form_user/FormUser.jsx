import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import styles from "./FormUser.module.css";
import { useEffect, useState } from "react";
import UsuarioService from "../../../services/UsuarioService";
import ImageUploader from "../../image_uploader/ImageUploader";

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
      }).catch(error => { console.error("Error al obtener el usuario ", error); })
    }
  }, [userService, userID]);


  // Funcion para crear el usuario
  const continuarProceso = async () => {
    let updatedUserData = { ...userData };

    // Si hay imagen, subirla a ImgBB a traves de la api
    if (userData.profileImage instanceof File) {
      try {
        const imageUrl = await ImageUploader({ file: userData.profileImage });
        if (imageUrl) {
          setUserData(prev => ({ ...prev, profileImage: imageUrl }));
          updatedUserData.profileImage = imageUrl;
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        return; // Detener si hay error en la subida de imagen
      }
    }

    // Si todo está bien, proceder
    setErrorInput(false);
    const userAction = userID ? userService.update(userID, updatedUserData) : userService.create(updatedUserData);

    userAction
      .then(response => {
        console.log(`Usuario ${userID ? "ACTUALIZADO" : "CREADO"} con éxito`, response);
        navigate(`/admin-panel/${userType}`);
      })
      .catch(error => {
        console.error(`Error al ${userID ? "ACTUALIZAR" : "CREAR"} el usuario:`, error);
      });
  }


  // Guardar o Editar cliente
  const saveOrUpdateCliente = (e) => {
    e.preventDefault();

    // Comprobar que todos estén rellenados
    if (Object.values(userData).some(value => !value)) {
      setErrorInput(true);
      return;
    }
    setUploadingData(true);

    // Solo comprobar si el email ha cambiado
    if (initialEmail !== userData.email) {
      UsuarioService.existEmail(userData.email)
        .then(response => {
          setEmailExistente(response.data);
          console.log(response.data);
          if (response.data) return; // Si el email existe, detenemos la ejecución

          // Proceder con la subida de imagen y creación/actualización del usuario
          continuarProceso();
        })
        .catch(error => console.error("Error al buscar el email:", error));
    }
    else {
      continuarProceso(); // Si el email no cambió, proceder directamente
    }
  };

  const FormularioUsuario = ({ userData, setUserData, saveOrUpdateCliente, userType }) => (
    <div className={styles.card_Body}>
      <form>
        {/* NOMBRE - APELLIDO*/}
        <article className={styles.form_flex}>
          <div className={styles.form_Group}>
            <label htmlFor="nombre" className={styles.form_Label}>Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Pablo"
              name="nombre"
              className={styles.form_Control}
              value={userData.nombre}
              onChange={(e) => setUserData(prev => ({ ...prev, nombre: e.target.value }))}
            />
          </div>
          <div className={styles.form_Group}>
            <label htmlFor="apellido" className={styles.form_Label}>Apellido</label>
            <input
              type="text"
              id="apellido"
              placeholder="Ramblado"
              name="apellido"
              className={styles.form_Control}
              value={userData.apellido}
              onChange={(e) => setUserData(prev => ({ ...prev, apellido: e.target.value }))}
            />
          </div>
        </article>

        {/* EMAIL - PRIVATEID*/}
        <article className={styles.form_flex}>
          <div className={styles.form_Group}>
            <label htmlFor="correo" className={styles.form_Label}>Email</label>
            <input
              type="email"
              id="correo"
              spellCheck="false"
              placeholder="pablo@example.com"
              name="nombre"
              className={styles.form_Control}
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className={styles.form_Group}>
            <label htmlFor="privateID" className={styles.form_Label}>PrivateID</label>
            <input
              type="text"
              id="privateID"
              name="PrivateID"
              value={userData.privateID}
              className={styles.form_Control}
              onChange={(e) => setUserData(prev => ({ ...prev, privateID: e.target.value }))}
            />
          </div>
        </article>

        {/* PASSWORD - FECHA NACIMIENTO*/}
        <article className={styles.form_flex}>
          <div className={styles.form_Group}>
            <label htmlFor="password" className={styles.form_Label}>Password</label>
            <input
              type="text"
              id="password"
              name="password"
              value={userData.password}
              onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
              className={styles.form_Control}
              spellCheck="false"
            />
          </div>
          <div className={styles.form_Group}>
            <label htmlFor="fecha" className={styles.form_Label}>Fecha de nacimiento</label>
            <input
              type="date"
              id="fecha"
              value={userData.fecha_nacimiento}
              onChange={(e) => setUserData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
              name="fecha_nacimiento"
              className={styles.form_Control}
            />
          </div>
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
            :
            <FormularioUsuario userData={userData} setUserData={setUserData} saveOrUpdateCliente={saveOrUpdateCliente} userType={userType} />
          }
        </article>
      </section>
    </>
  );
}
