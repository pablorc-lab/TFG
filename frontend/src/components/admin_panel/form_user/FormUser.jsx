import { Link, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import styles from "./FormUser.module.css";
import { useEffect, useState } from "react";

export default function FormUser({ }) {
  const { userType } = useParams();
  const { userID } = useParams();
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState(false);
  const [userService, setUserService] = useState(null);
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
        //console.log(usuario);
        setUserData(prev => ({
          ...prev,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          fecha_nacimiento: usuario.fecha_nacimiento,
          privateID: usuario.privateID,
        }));
      }).catch(error => { console.log(error); })
    }
  }, [userService, userID]);

  // Guardar o Editar cliente
  const saveOrUpdateCliente = (e) => {
    e.preventDefault();
    if (Object.values(userData).some(value => !value)) { // Comprobar que todos estén rellenados
      setErrorInput(true);
    }
    else {
      setErrorInput(false);
      if (userID) { // Editar usuario
        console.log("Usuario EDITADO correctamente", userData);
        userService.update(userID, userData);
      } else { // Crear usuario
        console.log("Usuario CREADO correctamente", userData);
        userService.create(userData);
      }

      // Al hacer navigate dejamos un pequeño timeout para que se agregue correctamente el user
      setTimeout(() => {
        navigate(`/admin-panel/${userType}`);
      }, 100);
    }
  };

  return (
    <>
      <title>{`Admin panel | Crear ${userType}`}</title>

      <AdminHeader userType={userType} />

      <section className={styles.container}>
        <article className={styles.card}>
          <h2 className={styles.title}>{userID ? "Editar" : "Agregar"} <span>{userType}</span></h2>
          {errorInput && <h3>POR FAVOR, REVISA LOS CAMPOS</h3>}
          <div className={styles.card_Body}>
            <form>
              {/* NOMBRE - APELLIDO*/}
              <article className={styles.form_flex}>
                <div className={styles.form_Group}>
                  <label className={styles.form_Label}>Nombre</label>
                  <input
                    type="text"
                    placeholder="Pablo"
                    name="nombre"
                    className={styles.form_Control}
                    value={userData.nombre}
                    onChange={(e) => setUserData(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                </div>
                <div className={styles.form_Group}>
                  <label className={styles.form_Label}>Apellido</label>
                  <input
                    type="text"
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
                  <label className={styles.form_Label}>Email</label>
                  <input
                    type="email"
                    spellCheck="false"
                    placeholder="pablo@example.com"
                    name="nombre"
                    className={styles.form_Control}
                    value={userData.email}
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className={styles.form_Group}>
                  <label className={styles.form_Label}>PrivateID</label>
                  <input
                    type="text"
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
                  <label className={styles.form_Label}>Password</label>
                  <input
                    type="text"
                    name="password"
                    value={userData.password}
                    onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                    className={styles.form_Control}
                    spellCheck="false"
                  />
                </div>
                <div className={styles.form_Group}>
                  <label className={styles.form_Label}>Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={userData.fecha_nacimiento}
                    onChange={(e) => setUserData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                    name="fecha_nacimiento"
                    className={styles.form_Control}
                  />
                </div>
              </article>

              {/* PROFILE IMAGE*/}
              <div className={styles.form_Group}>
                <label className={styles.form_Label}>Profile Image</label>
                <input
                  type="text"
                  name="profileImage"
                  value={userData.profileImage}
                  onChange={(e) => setUserData(prev => ({ ...prev, profileImage: e.target.value }))}
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
        </article>
      </section>
    </>
  );
}
