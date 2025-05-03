import styles from "./HistorialReservas.module.css"
import { useEffect, useRef, useState } from "react";
import ReservasService from "../../../../services/reservas/ReservasService.jsx";
import ValoracionesService from "../../../../services/valoraciones/ValoracionesService.jsx";

const HistorialReservasMiCuenta = ({ userService, esViajero = false, userID, reservasViajesTotales = 0 }) => {
  const [reservasData, setReservasData] = useState([]);
  const [estadoValoraciones, setEstadoValoraciones] = useState({});

  const [gastoIngreso, setGastoIngreso] = useState(0); // Estado para guardar el total

  const [editedData, setEditedData] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Modal para cancelar reserva

  const [openValorar, setOpenValorar] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [valueStar, setValueStar] = useState(0);
  const [opinionValue, setOpinionValue] = useState("");

  const [fechaHistorial, setFechaHistorial] = useState(new Date().toISOString().slice(0, 7));
  const inputReservaRef = useRef(null);

  // Obtener las reservas en ese mes
  useEffect(() => {
    if (fechaHistorial) {
      setEditedData(false);
      const obtenerReservas = esViajero
        ? ReservasService.getReservasViajero(userID, fechaHistorial)
        : ReservasService.getReservasAnfitrion(userID, fechaHistorial);

      obtenerReservas
        .then(response => {
          setReservasData(response.data);
          
          const receptoresIDs = new Set(response.data.map(reserva => esViajero ? reserva.anfitrion.id : reserva.viajero.id));

          // Ahora guardamos el estado de esas reservas para ver si se ha dejado valoración o no
          ValoracionesService.obtenerValoracionEstado(esViajero ? "viajeros" : "anfitriones", userID, [...receptoresIDs])
          .then(response => setEstadoValoraciones(response.data))
          .catch(error => "Error al obtener el estado " + error);
        })
        .catch(error => "Error al obtener reservas para esa fecha " + error);
    }
  }, [editedData, fechaHistorial]);


  // Obtener los ingresos/gastos totales
  useEffect(() => {
    const obtenerGastoIngreso = esViajero ? ReservasService.gestGastosViajero(userID) : ReservasService.gestGastosViajero(userID)
    obtenerGastoIngreso
      .then(response => setGastoIngreso(response.data))
      .catch(error => console.error("Error al calcular el ingreso costo " + error))
  }, [userID, esViajero]);


  const handleLabelClick = () => {
    if (inputReservaRef.current && typeof inputReservaRef.current.showPicker === 'function') {
      inputReservaRef.current.showPicker();
    }
  };

  const estadoColores = {
    "ACTIVA": { color: "#D9A520" },
    "FINALIZADA": { color: "#009080" },
    "CANCELADA": { color: "#A63D40" },
    "PENDIENTE": { color: "#215ba4" }
  };

  const calcularIngresoGastoMensual = () => {
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();

    let ingresoMensual = 0;

    for (const reserva of reservasData) {
      const inicio = new Date(reserva.fechaInicio);
      const fin = new Date(reserva.fechaFin);

      // Solo considerar reservas que se cruzan con el mes actual
      if ((inicio.getMonth() === mesActual && inicio.getFullYear() === anioActual) || (fin.getMonth() === mesActual && fin.getFullYear() === anioActual)) {
        // Si alguno no se encuentra en el mes actual, calcular días correspondientes
        if (inicio.getMonth() !== mesActual || fin.getMonth() !== mesActual) {
          // Calcular primer y último día del mes actual
          const inicioMes = new Date(anioActual, mesActual, 1); // Primer dia mes actual
          const finMes = new Date(anioActual, mesActual + 1, 0); // Último día mes actual

          // Definir rango efectivo dentro del mes actual
          // Si el inicio de reserva está en el més, dejarlo, sino contar desde el inicio del mes actual
          // Si el fin de reserva está en el més, dejarlo, sino contar desde el final del mes actual
          const desde = inicio > inicioMes ? inicio : inicioMes;
          const hasta = fin < finMes ? fin : finMes;

          const diasReservadosEnMes = Math.floor((hasta - desde) / (1000 * 60 * 60 * 24)) + 1;
          ingresoMensual += diasReservadosEnMes * reserva.precio_noche;
        }

        else {
          ingresoMensual += reserva.precio_total;
        }
      }
    }

    return ingresoMensual;
  }

  const printFechasLegible = (fechaInicio, fechaFin) => {
    const fechaInicioFormateada = fechaInicio.split("-");
    const fechaFinFormateada = fechaFin.split("-");
    return `${fechaInicioFormateada.join("/")} - ${fechaFinFormateada.join("/")}`;
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
          <h2>{esViajero ? "Gasto" : "Ingreso"} mensual</h2>
          <p>{calcularIngresoGastoMensual()} &euro;</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Gastos" : "Ingresos"} totales</h2>
          <p>{gastoIngreso} &euro;</p>
        </div>
      </article>

      <section className={styles.historial_user_section}>
        <h3>{new Date(fechaHistorial).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</h3>

        <label onClick={handleLabelClick}>
          <input
            ref={inputReservaRef}
            type="month"
            value={fechaHistorial}
            onChange={(e) => e.target.value && setFechaHistorial(e.target.value)}
          />
        </label>

        {reservasData.length === 0 && <h2 style={{ textAlign: "center", margin: "30px 0" }}>No existen reservas en este mes</h2>}

        {reservasData.map((user, index) => {
          const userInfo = getUserInfo(user);

          return (
            <article key={index} className={styles.historial_user_article}>

              {openModal && user.estado === "PENDIENTE" &&
                <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
                  <h1>¿Anular reserva?</h1>
                  <div>
                    <img src={esViajero ? user.anfitrion.profile_image : user.viajero.profile_image} alt="Imagen perfil" className={styles.user_profile_img} style={{ width: "100px" }} />
                  </div>

                  <h2 style={{ textAlign: "center", marginBottom: "5px", fontWeight: "600" }}>{esViajero ? user.anfitrion.nombre : user.viajero.nombre}, {user.precio_total} €</h2>
                  <h2 style={{ textAlign: "center", marginBottom: "25px", fontWeight: "600" }}>{printFechasLegible(user.fechaInicio, user.fechaFin)}</h2>
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
                  <h2>{esViajero ? user.anfitrion.valoracion : user.viajero.valoracion}</h2>
                </div>
              </div>

              {userInfo.map((item, index) => (
                <div key={index} className={styles.details}>
                  <img src={item.img} alt={item.alt} />
                  <p> {item.value} {item.strong && <strong style={estadoColores[user.estado]}>{item.strong}</strong>} </p>
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
