import { Link, useParams } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import styles from "./FormUser.module.css";
import { useEffect, useState } from "react";

export default function FormUser({ }) {
  const { userType } = useParams();
  const { userID } = useParams();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");

  const [service, setService] = useState(null);

  // Cargar el servicio actual requerido
  useEffect(() => {
    const loadService = async () => {
      setService(
        userType === "anfitrion"
          ? (await import("../../../services/AnfitrionService")).default
          : (await import("../../../services/ViajeroService")).default
      );
    };
    loadService();
  }, [userType])

  // Obtener el usuario actual si se está EDITANDO
  useEffect(() => {
    if(service && userID){
      service.getById(userID).then(response => {
        const usuario = response.data;
        //console.log(usuario);
        setNombre(usuario.nombre);
        setApellido(usuario.apellido);
        setEmail(usuario.email);
        setFecha_nacimiento(usuario.fecha_nacimiento);
      }).catch(error => { console.log(error);})
    }

    }, [service, userID]);
  
  return (
    <>
      <title>{`Admin panel | Crear ${userType}`}</title>

      <AdminHeader userType={userType} />

      <section className={styles.container}>
        <article className={styles.row}>
          <div className={styles.card}>
            <h2 className={styles.title}>{userID ? "Editar" : "Agregar"} <span>{userType}</span></h2>

            <div className={styles.card_Body}>
              <form>
                <article className={styles.form_flex}>
                  <div className={styles.form_Group}>
                    <label className={styles.form_Label}>Nombre</label>
                    <input
                      type="text"
                      placeholder="Pablo"
                      name="nombre"
                      className={styles.form_Control}
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className={styles.form_Group}>
                    <label className={styles.form_Label}>Apellido</label>
                    <input
                      type="text"
                      placeholder="Ramblado"
                      name="apellido"
                      className={styles.form_Control}
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </div>
                </article>

                <div className={styles.form_Group}>
                  <label className={styles.form_Label}>Email</label>
                  <input
                    type="email"
                    placeholder="pablo@example.com"
                    name="nombre"
                    className={styles.form_Control}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <article className={styles.form_flex}>
                  <div className={styles.form_Group}>
                    <label className={styles.form_Label}>Password</label>
                    <input
                      type="text"
                      name="password"
                      className={styles.form_Control}
                    />
                  </div>
                  <div className={styles.form_Group}>
                    <label className={styles.form_Label}>Fecha de nacimiento</label>
                    <input
                      type="date"
                      value={fecha_nacimiento}
                      onChange={(e) => setFecha_nacimiento(e.target.value)}
                      name="fecha_nacimiento"
                      className={styles.form_Control}
                    />
                  </div>
                </article>

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
          </div>
        </article>
      </section>
    </>
  );
}
