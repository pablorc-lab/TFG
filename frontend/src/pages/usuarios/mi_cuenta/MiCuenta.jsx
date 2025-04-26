import { lazy, Suspense, useEffect, useState } from "react";
import styles from "./MiCuenta.module.css"
import ScoreMiCuenta from "../../../components/usuarios/mi_cuenta/Score";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const AnfitrionMobileHeader = lazy(() => import("../../../components/anfitriones/header/AnfitrionMobileHeader"));
const ViajerosMobileHeader = lazy(() => import("../../../components/viajeros/header/ViajerosMobileHeader"));

const OpinionesMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/opiniones/Opiniones"));
const PerfilMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/perfil/Perfil"));
const SeguridadMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/seguridad/Seguridad"));
const HistorialReservasMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/historial_reservas/HistorialReservas"));
const RecomendacionesMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/recomendaciones/Recomendaciones"));

export default function MiCuenta({ activeSection = "perfil", esViajero = true }) {
  const [activeMenu, setActiveMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const navigate = useNavigate();

  const [openEditProfileImage, SetOpenEditProfileImage] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [editedData, setEditedData] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [userService, setUserService] = useState(null);
  const [usuarioData, setUsuarioData] = useState([]);
  const [perfilImage, setPerfilImage] = useState(null);

  // Controlar cuando es pantalla pequeña
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar el servicio requerido
  useEffect(() => {
    if (!userService) {
      const loadService = async () => {
        const tempService = !esViajero
          ? (await import("../../../services/users/AnfitrionService")).default
          : (await import("../../../services/users/ViajeroService")).default;
        setUserService(tempService);
      };
      loadService();
    }
  }, [userService]);

  // Cuando el servicio cargue, una vez añadido, se muestra la información del usuario (si se modifica la información también)
  useEffect(() => {
    if (userService) {
      const token = localStorage.getItem("acces_token");
      const decoded = jwtDecode(token);
      const email = decoded.sub;

      userService.getByEmail(email)
        .then(response => {
          setUsuarioData(response.data);
          setPerfilImage(response.data.usuario.profileImage);
          console.log(response.data);
        })
        .catch(error => console.error("Error al mostrar el usuario", error))
        .finally(() => {
          setIsLoading(false);
          setEditedData(false);
        });
    }
  }, [userService, editedData]);

  const userNavItems = [
    { src: "/images/usuarios/account/edit.svg", alt: "Datos personales", text: "Datos personales" },
    { src: "/images/usuarios/account/biografia.svg", alt: "Biografía", text: "Biografía" },
    { src: "/images/usuarios/account/house.svg", alt: "Vivienda", text: "Vivienda" },
    { src: "/images/usuarios/account/recomendaciones.svg", alt: "Recomendaciones", text: esViajero ? "Experiencias" : "Recomendaciones" },
    { src: "/images/usuarios/account/security.svg", alt: "Seguridad", text: "Seguridad" },
    { src: "/images/usuarios/account/star.svg", alt: "Opiniones", text: "Opiniones" },
    { src: "/images/usuarios/account/history.svg", alt: "Historial de reservas", text: "Historial de reservas" }
  ];

  const styleSuspense = {
    width: "80%",
    position: "relative",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "50px",
    backgroundColor: "white",
    boxShadow: "0 0 5px rgba(65, 65, 65, 0.3)",
  };

  const handleLogout = () => {
    localStorage.clear();

    navigate("/inicio");
    //TODO : HACER LLAMADA A LA API EN LOGOUT PARA ELIMINAR ESE TOKEN
  }


  // Return : edad en años dada la fecha en estilo yyyy-mm-dd
  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  const handleChangePerfil = (e) => {
    setNewProfileImage(e.target.files[0]);
    setTimeout(() => SetOpenEditProfileImage(true), 300);
  }

  const handleSaveProfileImage = async () => {
    if (newProfileImage instanceof File) {
      let updatedUserData = { ...usuarioData };

      userService.uploadImage(newProfileImage)
        .then(imageUrl => {
          console.log("Imagen subida con éxito:", imageUrl);

          updatedUserData.profileImage = imageUrl;

          userService.update(usuarioData.usuario.id, updatedUserData)
            .then(() => setEditedData(true))
            .catch(error => console.error(`Error al ACTUALIZAR el usuario:`, error));
        })
        .catch(error => {
          console.error("Error al subir la imagen:", error);
          return; // Detener si hay error en la subida de imagen
        });
    }
    else {
      console.log("No es una imagen valida");
    }
    setNewProfileImage(null);
    SetOpenEditProfileImage(false);
  };

  return (
    <>
      <title>Mi cuenta | Viajeros</title>
      <header className={styles.header}>
        <figure>
          <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
          <figcaption>
            <h1>Bearfrens</h1>
            <h2>Mi cuenta</h2>
          </figcaption>
        </figure>
        <nav>
          {!isMobile ? (
            <>
              {esViajero ? (
                <>
                  <Link to="/viajeros/alojamientos">Alojamientos</Link>
                  <Link to="/viajeros/conexiones">Conexiones</Link>
                  <Link to="/viajeros/conexiones">Conexiones</Link>
                </>
              ) : (
                <>
                  <Link to="/viajeros/">Grupos</Link>
                  <Link to="/anfitriones/inquilinos">Inquilinos</Link>
                  <Link to="/anfitriones/conexiones">Conexiones</Link>
                </>
              )}
              <Link to="/inicio">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          ) : (
            <>
              <Link to="/inicio">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          )}

        </nav>
      </header>

      {isMobile && (esViajero ? <ViajerosMobileHeader activeSection={activeSection} /> : <AnfitrionMobileHeader activeSection={activeSection} />)}

      {openEditProfileImage &&
        <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
          <h1>Imagen de perfil modificada</h1>
          <img className={styles.user_img} src={URL.createObjectURL(newProfileImage)} alt="Imagen de perfil" width={50} />
          <div>
            <button onClick={() => SetOpenEditProfileImage(false)}>CANCELAR</button>
            <button onClick={() => handleSaveProfileImage()}>GUARDAR</button>
          </div>
        </dialog>
      }

      {!isLoading ? (
        <main className={styles.main}>
          <article className={styles.main_containers}>

            {/* Menú de nav*/}
            <nav className={styles.user_nav}>
              <ul className={styles.user_nav_ul}>
                {userNavItems.map((item, index) => {
                  if (index == 2 && esViajero) return null;

                  return (
                    <li key={index} className={activeMenu === index ? styles.active : undefined} onClick={() => setActiveMenu(index)}>
                      <img src={item.src} alt={item.text} />
                      <h2>{item.text}</h2>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Perfil de usuario*/}
            <section className={styles.user_container}>
              <article className={styles.user_profile}>
                <div >
                  <label className={styles.file_input_label}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleChangePerfil(e)}
                    />
                    <img className={styles.user_img} src={perfilImage || "/images/not_found/user_img.png"} alt="Imagen de perfil" width={50} />
                  </label>

                  <div className={styles.profile_img} >
                    <img src="/images/usuarios/account/edit_img.svg" alt="Editar imagen" />
                  </div>
                </div>

                <div className={styles.user_general_info}>
                  <div className={styles.user_name}>
                    <h2>{usuarioData.usuario?.nombre || "-"}, {usuarioData.usuario?.apellido.charAt(0) || "-"}</h2>
                    <p>({calcularEdad(usuarioData.usuario?.fecha_nacimiento) || "18"} años)</p>
                  </div>
                  <ScoreMiCuenta nota_media={usuarioData.usuario?.valoracion_media || 0.1} valoraciones={usuarioData?.valoraciones} />

                  <div className={styles.user_likes}>
                    {[usuarioData.usuario?.gusto1, usuarioData.usuario?.gusto2, usuarioData.usuario?.gusto3].map((gusto, index) => (
                      <img
                        key={index}
                        src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
                        alt={`Logo gusto ${index + 1}`} width={100}
                        onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
                      />
                    ))}
                  </div>
                </div>
              </article>

              <div className={styles.user_bubble}>
                {!esViajero && <h4>
                  {usuarioData.usuario?.vivienda?.ciudad + "," || "-"}
                  {" " + usuarioData.usuario?.vivienda?.provincia || "-"}
                  {" (" + usuarioData.usuario?.vivienda?.precio_noche || "-"}&euro; / noche)
                </h4>
                }
                <p>{usuarioData.usuario?.descripcion || "Descripción no disponible"}</p>
              </div>

              <div className={styles.cerrar_sesion}>
                <h3 onClick={handleLogout}>Cerrar sesión</h3>
              </div>

            </section>
          </article>

          {/* Componente de los menús*/}
          <div className={styles.user_component}>
            <Suspense fallback={<div style={styleSuspense}><img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "200px", position: "relative", left: "50%", transform: "translateX(-50%)" }} /></div>}>
              {activeMenu === 0 &&
                <PerfilMiCuenta
                  showValue={0}
                  esViajero={esViajero}
                  usuarioData={usuarioData}
                  userService={userService}
                  setEditedData={setEditedData}
                />
              }
              {activeMenu === 1 &&
                <PerfilMiCuenta
                  showValue={1}
                  esViajero={esViajero}
                  usuarioData={usuarioData}
                  userService={userService}
                  setEditedData={setEditedData}
                />
              }
              {activeMenu === 2 && !esViajero &&
                <PerfilMiCuenta
                  showValue={2}
                  usuarioData={usuarioData}
                  userService={userService}
                  setEditedData={setEditedData}
                />
              }
              {activeMenu === 3 &&
                <RecomendacionesMiCuenta
                  esViajero={esViajero}
                  recomendacionesData={esViajero ? usuarioData.usuario?.experiencias : usuarioData.usuario?.recomendaciones}
                  userService={userService}
                  setEditedData={setEditedData}
                  userID={usuarioData.usuario?.id}
                />
              }
              {activeMenu === 4 &&
                <SeguridadMiCuenta
                  userService={userService}
                  usuarioData={usuarioData}
                  setUsuarioData={setUsuarioData}
                  handleLogout={handleLogout}
                  userID={usuarioData.usuario?.id}
                  userEmail={usuarioData.usuario?.email}
                />
              }
              {activeMenu === 5 &&
                <OpinionesMiCuenta
                  showSize={true}
                  nota_media={usuarioData.usuario?.valoracion_media}
                  valoraciones={usuarioData?.valoraciones}
                  MiCuenta={true}
                  userService={userService}
                  setEditedData={setEditedData}
                />
              }
              {activeMenu === 6 && <HistorialReservasMiCuenta userService={userService} />}
            </Suspense>
          </div>
        </main>
      ) : (
        <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      )}
    </>
  )
}