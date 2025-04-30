import styles from "./HistorialReservas.module.css"
import ReservaData from "../../../../data/usuarios/mi_cuenta/historial.json"
import { useEffect, useRef, useState } from "react";

const HistorialReservasMiCuenta = ({ userService, reservasData = [], esViajero = false }) => {

  const [fechaHistorial, setFechaHistorial] = useState(new Date().toISOString().slice(0, 7));
  const inputReservaRef = useRef(null);

  const handleLabelClick = () => {
    if (inputReservaRef.current && typeof inputReservaRef.current.showPicker === 'function') {
      inputReservaRef.current.showPicker();
    }
  };

  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  useEffect(() => {
    setReservasFiltradas(
      reservasData.filter(reserva => 
        new Date(reserva.fechaInicio).toISOString().slice(0, 7) === fechaHistorial || 
        new Date(reserva.fechaFin).toISOString().slice(0, 7) === fechaHistorial
      )
    )
  }, [fechaHistorial]);

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

  return (
    <section className={styles.historial_main}>
      <article className={styles.summary}>
        <h1>Visión general</h1>
        <div className={styles.summary_div}>
          <h2>{esViajero ? "Viajes" : "Reservas"} totales</h2>
          <p>{reservasData.length}</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Gasto" : "Ingreso"} mensual</h2>
          <p>{calcularIngresoGastoMensual()} &euro;</p>
        </div>

        <div className={styles.summary_div}>
          <h2>{esViajero ? "Gastos" : "Ingresos"} totales</h2>
          <p>{reservasData.reduce((sum, reserva) => sum + reserva.precio_total, 0)} &euro;</p>
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

        {reservasFiltradas.length === 0 && <h2 style={{textAlign : "center", margin : "30px 0"}}>No existen reservas en este mes</h2>}
        {reservasFiltradas.map((user, index) => {
          const userInfo = getUserInfo(user);

          return (
            <article key={index} className={styles.historial_user_article}>
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
