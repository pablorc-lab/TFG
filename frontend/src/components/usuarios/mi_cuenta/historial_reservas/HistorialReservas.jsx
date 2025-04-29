import styles from "./HistorialReservas.module.css"
import ReservaData from "../../../../data/usuarios/mi_cuenta/historial.json"

const HistorialReservasMiCuenta = ({ userService, reservasData = [], esViajero = false }) => {

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
          const finMes = new Date(anioActual, mesActual + 1, 0); // Último días mes actual

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
        <h3>ENERO 2024</h3>
        {ReservaData.map((user, index) => {
          const userInfo = [
            { img: "/images/usuarios/account/historial_fecha.svg", alt: "Fecha", value: user.fecha, extra: `(${user.precio_noche} € / noche)` },
            { img: "/images/usuarios/account/historial_ubicacion.svg", alt: "Ubicación", value: user.ubicacion },
            { img: "/images/usuarios/account/historial_costo.svg", alt: "Beneficio", value: `${user.precio_total} €` },
            { img: "/images/usuarios/account/historial_estado.svg", alt: "Estado", value: "Estado : ", strong: user.estado }
          ];

          return (
            <article key={index} className={styles.historial_user_article}>
              <div className={styles.historial_user_info}>
                <img src={user.imagen_perfil} alt="Imagen perfil" className={styles.user_profile_img} />
                <h2>{user.nombre}</h2>
                <div className={styles.score}>
                  <img src="/images/usuarios/estrella.webp" alt="Logo estrella" />
                  <p>{user.valoracion}</p>
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
