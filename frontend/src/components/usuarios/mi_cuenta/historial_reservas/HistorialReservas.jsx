import styles from "./HistorialReservas.module.css"
import { useEffect, useState } from "react";
import ReservasService from "../../../../services/reservas/ReservasService.jsx";
import ValoracionesService from "../../../../services/valoraciones/ValoracionesService.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';


const HistorialReservasMiCuenta = ({ userService, esViajero = false, userID, reservasViajesTotales = 0 }) => {
  const [reservasData, setReservasData] = useState([]);
  const [costoMensual, setCostoMensual] = useState(0);

  const [estadoValoraciones, setEstadoValoraciones] = useState({});

  const [gastoIngreso, setGastoIngreso] = useState(0); // Estado para guardar el total

  const [editedData, setEditedData] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Modal para cancelar reserva

  const [openValorar, setOpenValorar] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [valueStar, setValueStar] = useState(0);
  const [opinionValue, setOpinionValue] = useState("");

  const [fechaHistorial, setFechaHistorial] = useState(new Date().toISOString().slice(0, 7));

  // Obtener las reservas en ese mes
  useEffect(() => {
    if (fechaHistorial) {
    
      setEditedData(false);
      const obtenerReservas = esViajero
        ? ReservasService.getReservasViajero(userID, fechaHistorial)
        : ReservasService.getReservasAnfitrion(userID, fechaHistorial);

      obtenerReservas
        .then(response => {
          setReservasData(response.data.reservas);
          setCostoMensual(response.data.costomensual);

          const receptoresIDs = new Set(response.data.reservas.map(reserva => esViajero ? reserva.anfitrion.id : reserva.viajero.id));

          // Ahora guardamos el estado de esas reservas para ver si se ha dejado valoración o no
          ValoracionesService.obtenerValoracionEstado(esViajero ? "viajeros" : "anfitriones", userID, [...receptoresIDs])
            .then(response => setEstadoValoraciones(response.data))
            .catch(error => "Error al obtener el estado " + error)
            .finally();
        })
        .catch(error => "Error al obtener reservas para esa fecha " + error);
    }
  }, [editedData, fechaHistorial]);


  // Obtener los ingresos/gastos totales
  useEffect(() => {
    const obtenerGastoIngreso = esViajero ? ReservasService.gestGastosViajero(userID) : ReservasService.getIngresoAnfitrion(userID)
    obtenerGastoIngreso
      .then(response => setGastoIngreso(response.data))
      .catch(error => console.error("Error al calcular el ingreso costo " + error))
  }, [userID, esViajero]);

  const printFechasLegible = (fechaInicio, fechaFin) => {
    return `${new Date(fechaInicio).toLocaleDateString()} - ${new Date(fechaFin).toLocaleDateString()}`;
  };

  const obtenerDiasReservados = (fechaInicio, fechaFin) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Calculamos la diferencia en milisegundos y la convertimos a días
    const diferencia = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);

    return diferencia;
  };

  const getUserInfo = (user) => [
    { img: "/images/usuarios/account/historial_fecha.svg", alt: "Fecha", value: printFechasLegible(user.fechaInicio, user.fechaFin), extra: `(${obtenerDiasReservados(user.fechaInicio, user.fechaFin)} noches)` },
    { img: "/images/usuarios/account/historial_ubicacion.svg", alt: "Ubicación", value: user.ubicacion },
    { img: "/images/usuarios/account/historial_costo.svg", alt: "Beneficio", value: `${user.precio_total} €`, extra: `(${user.precio_noche} € / noche)` },
    { img: "/images/usuarios/account/historial_estado.svg", alt: "Estado", value: "Estado : ", strong: user.estado }
  ];

  const cancelarReserva = (anfitrionID, viajeroID, fechaInicio, fechaFin) => {
    ReservasService.cancelarReserva(anfitrionID, viajeroID, fechaInicio, fechaFin)
      .then(response => console.log(response.data))
      .catch(error => console.error(error))
      .finally(() => {
        setEditedData(true)
        setOpenModal(false);
      });
  }

  const crearValoracion = (receptorID) => {
    ValoracionesService.crearValoracion(esViajero ? "viajeros" : "anfitriones", userID, receptorID)
      .then(response => console.log("Valoración creada con éxito"))
      .catch(error => "Error al crear la valoración " + error)
      .finally(() => {
        setEditedData(true);
        setOpenValorar(false);
      });
  };

  return (
    <section className={styles.historial_main}>
      <article className={styles.summary}>
        <h1>Visión general</h1>
        <div className={styles.summary_div}>
          <h2>{esViajero ? "Viajes" : "Reservas"} totales</h2>
          <p>{reservasViajesTotales}</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Viajes" : "Reservas"} ese mes</h2>
          <p>{reservasData.filter(r => r.estado !== "CANCELADA").length}</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Gasto" : "Ingreso"} mensual</h2>
          <p>{costoMensual.toFixed(1)} &euro;</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Gastos" : "Ingresos"} totales</h2>
          <p>{gastoIngreso.toFixed(1)} &euro;</p>
        </div>
      </article>

      <section className={styles.historial_user_section}>
        <div className={styles.div_label}>
          <img src="/images/usuarios/account/folder.svg" alt="history" />
          <label>
            <h3>{new Date(fechaHistorial).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</h3>

            <DatePicker
              selected={fechaHistorial}
              onChange={(date) => date && setFechaHistorial(date.toISOString().slice(0, 7))}
              dateFormat="MM-yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              locale={es}
            />
          </label>
        </div>

        {reservasData.length === 0 && <h2 style={{ textAlign: "center", margin: "30px 0" }}>No existen reservas en este mes</h2>}

        {reservasData.map((user) => {
          const userInfo = getUserInfo(user);

          return (
            <article key={user.fechaInicio} className={styles.historial_user_article}>

              {openModal && user.estado === "PENDIENTE" &&
                <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
                  <h1>¿Anular reserva?</h1>
                  <div>
                    <img src={esViajero ? user.anfitrion.profile_image : user.viajero.profile_image} alt="Imagen perfil" className={styles.user_profile_img} style={{ width: "100px" }} />
                  </div>

                  <p style={{ textAlign: "start", marginBottom: "10px", marginTop: "25px", fontWeight: "600" }}><strong>Nombre :</strong> {esViajero ? user.anfitrion.nombre : user.viajero.nombre}</p>
                  <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600" }}><strong>Ubicación : </strong> {user.ubicacion} </p>
                  <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600" }}><strong>Precio : </strong>{user.precio_total} &euro; </p>
                  <p style={{ textAlign: "start", marginBottom: "10px", fontWeight: "600"}}><strong>Fecha : </strong>  {new Date(user.fechaInicio).toLocaleDateString()} - {new Date(user.fechaFin).toLocaleDateString()}</p>
                  <p style={{ textAlign: "start", marginBottom: "25px", fontWeight: "600" }}><strong>{obtenerDiasReservados(user.fechaInicio, user.fechaFin)} noches</strong>  ({user.precio_noche} &euro; / noche)</p>

                  <div>
                    <button onClick={() => setOpenModal(false)}>CANCELAR</button>
                    <button onClick={() => cancelarReserva(user.anfitrion.id, user.viajero.id, user.fechaInicio, user.fechaFin)}>ANULAR</button>
                  </div>
                </dialog>
              }

              {user.estado === "PENDIENTE" &&
                <div className={styles.action_imgs_1} onClick={() => setOpenModal(true)}>
                  <p>Anular</p>
                  <img src="/images/usuarios/account/anular.svg" alt="delete img" />
                </div>
              }

              {openValorar && !estadoValoraciones[esViajero ? user.anfitrion.id : user.viajero.id] &&
                <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
                  <h1>Valorar {esViajero ? "viajero" : "anfitrión"}</h1>
                  <div>
                    <img src={esViajero ? user.anfitrion.profile_image : user.viajero.profile_image} alt="Imagen perfil" className={styles.user_profile_img} style={{ width: "100px" }} />
                  </div>

                  <div className={styles.modal_valorar}>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <img
                        key={index}
                        src={`/images/usuarios/account/valorar_star${(valueStar >= index) || index <= hoveredStar ? "_full" : ""}.svg`}
                        alt="star"
                        onMouseEnter={() => setHoveredStar(index)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setValueStar(index)}
                      />
                    ))}
                  </div>

                  <textarea
                    value={opinionValue}
                    onChange={(e) => setOpinionValue(e.target.value)}
                    spellCheck="false"
                    name="opinión"
                    placeholder="Deja una opinión al usuario"
                  >
                  </textarea>
                  <div>
                    <button onClick={() => { setOpenValorar(false); setValueStar(0); setHoveredStar(0); setOpinionValue(""); }}>CANCELAR</button>
                    <button disabled={valueStar === 0 || opinionValue === ""} onClick={() => crearValoracion(esViajero ? user.anfitrion.id : user.viajero.id)}>GUARDAR</button>
                  </div>
                </dialog>
              }

              {user.estado === "FINALIZADA" && !estadoValoraciones[esViajero ? user.anfitrion.id : user.viajero.id] &&
                <div className={styles.action_imgs_2} onClick={() => setOpenValorar(true)}>
                  <p>Valorar</p>
                  <img src="/images/usuarios/account/valorar.svg" alt="delete img" />
                </div>
              }

              <div className={styles.historial_user_info}>
                <img src={esViajero ? user.anfitrion.profile_image : user.viajero.profile_image} alt="Imagen perfil" className={styles.user_profile_img} />
                <h2>{esViajero ? user.anfitrion.nombre : user.viajero.nombre}</h2>
                <div className={styles.score}>
                  <img src="/images/usuarios/estrella.webp" alt="Logo estrella" />
                  <h2>{esViajero ? parseInt(user.anfitrion?.valoracion || 0.0).toFixed(1) : parseInt(user.viajero?.valoracion || 0.0).toFixed(1)}</h2>
                </div>
              </div>

              {userInfo.map((item) => (
                <div key={item.alt} className={styles.details}>
                  <img src={item.img} alt={item.alt} />
                  <p className={styles[user.estado]}> {item.value} {item.strong && <strong>{item.strong}</strong>} </p>
                  {item.extra && <span>{item.extra}</span>}
                </div>
              ))}
            </article>
          )
        })}
      </section>
    </section>
  );
}

export default HistorialReservasMiCuenta;
