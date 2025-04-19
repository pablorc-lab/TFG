import { useEffect, useState } from "react";
import viaj_card_styles from "../../users_cards/UserCard.module.css"
import ViajCard from "../../users_cards/ViajCard";
import styles from "./ViajProfilesGallery.module.css"
import { jwtDecode } from "jwt-decode";
import LikesService from "../../../services/matches/LikesService";

export default function ViajProfilesGallery({ viajeros, viajerosFiltrados = [], match = false, conectados_ID = false, buscarFiltrado = false }) {
  const [listaViajeros, setListaViajeros] = useState([]);
  const [anfitrionID, setAnfitrionID] = useState(null);
  const [loading, SetLoading] = useState(true);
  const [conexionesID, setConexionesID] = useState([]);

  useEffect(() => {
    // Obtener el id del anfitrión
    if (anfitrionID == null) {
      // Obtener el correo decodificado del localstorage
      const token = localStorage.getItem("acces_token");
      const decoded = jwtDecode(token);
      const id_anfitrion = decoded.jti;
      setAnfitrionID(id_anfitrion); // JTI : Id del token (almacena el id del usuario anfitrión)

      if (conectados_ID && conexionesID.length === 0) {
        // Obtener usuarios a los que se ha enviado el ike
        LikesService.getAllEnviados("anfitriones", id_anfitrion).then(response => {
          setConexionesID(response.data.map(usuario => usuario.usuarioID));
        }).catch(error => "Error al obtener los likes " + error)
      }
    }

    if (buscarFiltrado) {
      setListaViajeros(viajerosFiltrados);
    }

    else if (listaViajeros !== viajeros) {
      setListaViajeros(viajeros);
    }

    SetLoading(false);
  }, [viajerosFiltrados, viajeros, buscarFiltrado, conectados_ID])

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

  // Comprueba si se dió like
  function likeDado(ViajeroID) {
    let contiene_id = conexionesID.length > 0 && conexionesID.some(id => id === ViajeroID);
    return contiene_id || match;
  }

  return (
    <section className={styles.card_users}>
      {!loading && anfitrionID != null && listaViajeros.map((viajero, index) => (
        <article key={index}>
          <ViajCard
            styles={viaj_card_styles}
            viaj_ID={viajero.id}
            Perfil_img={viajero.profileImage || "/images/not_found/user_img.png"}
            Nombre={viajero.nombre}
            Valoracion={viajero.valoracion_media || "0.0"}
            Num_viajes={viajero.viajes_realizados || 0}
            Edad={calcularEdad(viajero.fecha_nacimiento) || 18}
            Profesion={viajero.profesion || "Sin información"}
            Descripcion={viajero.descripcion}
            Gustos_imgs={[viajero.gusto1, viajero.gusto2, viajero.gusto3].filter(gusto => gusto != null)}
            tiempo_estancia={viajero.tiempo_estancia || "Indefinido"}
            conectado={likeDado(viajero.id)}
            anfitrion_ID={anfitrionID}
          />
        </article>
      ))}

      {loading && <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "250px", position: "relative", top: "50%", left: "0%", margin: "150px 0", transform: "translateY(-50%)" }} />}

      {listaViajeros.length === 0 && listaViajeros === viajeros && <h1 className={styles.not_found}>No hay viajeros actualmente.</h1>}
      {listaViajeros.length === 0 && listaViajeros === viajerosFiltrados && <h1 className={styles.not_found}>No existen viajeros con esos filtros.</h1>}

    </section>
  )
}
