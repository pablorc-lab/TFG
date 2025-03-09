import styles from "./HistorialReservas.module.css"
import ReservaData from "../../../../data/usuarios/mi_cuenta/historial.json"

const HistorialReservasMiCuenta = () => {

  const estadoColores = {
    "En curso": { color: "#D9A520" },  
    "Completada": { color: "#009080" }, 
    "Cancelada": { color: "#A63D40" },  
    "Por iniciar": { color: "#215ba4" } 
  };
  
  return (
    <section className={styles.historial_main}>
      <article className={styles.summary}>
        <h1>Visión general</h1>
        <div className={styles.summary_div}>
          <h2>Reservas totales</h2>
          <p>291</p>
        </div>

        <div className={styles.summary_div}>
          <h2>Ingreso mensual</h2>
          <p>181 &euro;</p>
        </div>

        <div className={styles.summary_div}>
          <h2>Ingresos totales</h2>
          <p>372 &euro;</p>
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
