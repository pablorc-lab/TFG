import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ViajerosMobileHeader from "../../../components/viajeros/header/ViajerosMobileHeader";
import Footer from "../../../components/footer/footer";
import UserPage from "../../../components/usuarios/user_page/UserPage";
import AnfitrionService from "../../../services/users/AnfitrionService";
import MatchesService from "../../../services/matches/MatchesService";

import styles from "./AnfProfilePage.module.css"
import LikesService from "../../../services/matches/LikesService";

export default function AnfProfilePage() {
  const [anfitrionInfo, SetAnfitrionInfo] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [Gustos_imgs, setGustos_imgs] = useState([]);
  const [idiomasUser, setIdiomasUser] = useState([]);
  const [Vivienda_imgs, setVivienda_imgs] = useState([null, null, null, null]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [isColumns, setIsColumns] = useState(window.innerWidth <= 1350);
  const [actualImage, setActualImage] = useState(0);

  const [match, SetMatch] = useState(false);

  const [loading, SetLoading] = useState(true);

  const location = useLocation();
  const id = location.state?.id;
  const emisorID = location.state?.emisorID;
  const [conectado, setConectado] = useState(false);

  // Controlar cuando es pantalla pequeña 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsColumns(window.innerWidth <= 1350);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, isColumns]);

  // Obtener datos del usuario si no hay y se tiene su id
  useEffect(() => {
    if (id && anfitrionInfo.length === 0) {
      AnfitrionService.getById(id).then(response => {
        SetAnfitrionInfo(response.data);
        setValoraciones(response.data.valoraciones);
        setIdiomasUser(response.data.biografia?.idiomas ? response.data.biografia.idiomas.trim().split(",") : ["Español"]);
        setVivienda_imgs([
          response.data.usuario.vivienda.imagen1,
          response.data.usuario.vivienda.imagen2,
          response.data.usuario.vivienda.imagen3,
          response.data.usuario.vivienda.imagen4
        ]);

        setGustos_imgs([
          response.data.usuario.gusto1,
          response.data.usuario.gusto2,
          response.data.usuario.gusto3
        ].filter(img => img != null));

        // Ver si se ha dado like
        LikesService.haDadoLike("viajeros", emisorID, id)
          .then(likeDado => setConectado(likeDado.data))
          .catch(error => console.error("Error al buscar el match " + error));

        // Ver si se tiene match con el
        MatchesService.getTwoUsersMatchs(id, emisorID)
          .then(match => SetMatch(match.data))
          .catch(error => console.error("Error al buscar el match " + error));
      })
        .catch(error => console.error("No se encontró el usuario " + error))
        .finally(SetLoading(false));
    }
  }, [id, anfitrionInfo])

  // Información de la vivienda
  const ViviendaInfo = (
    <section className={styles.vivienda_info}>
      <h1>Vivienda en {anfitrionInfo.usuario?.vivienda?.ciudad || <i>No disponible</i>}, {anfitrionInfo.usuario?.vivienda?.provincia || <i>No disponible</i>}</h1>
      <h1>{anfitrionInfo.usuario?.vivienda?.precio_noche || "0"} &euro; / noche</h1>
      <p>
        {(anfitrionInfo.usuario?.vivienda?.viajeros || "0") + " viajeros - "}
        {(anfitrionInfo.usuario?.vivienda?.habitaciones || "0") + " habitaciones - "}
        {(anfitrionInfo.usuario?.vivienda?.camas || "0") + " camas - "}
        {(anfitrionInfo.usuario?.vivienda?.banios || "0") + " baños"}
      </p>
    </section>
  );

  return (
    <>
      <title>Perfil anfitrion | Viajeros</title>


      {/* CABECERA */}
      <header className={styles.header}>
        <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <nav>
          {!isMobile ? (
            <>
              <Link to="/viajeros/alojamientos">Alojamientos</Link>
              <Link to="/viajeros/foros">Foros</Link>
              <Link to="/viajeros/conexiones">Matches</Link>
              <Link to="/inicio/soporte">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
              <Link to="/viajeros/mi-cuenta">Mi Cuenta</Link>
            </>
          ) : (
            <>
              <Link to="/inicio/soporte">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          )}
        </nav>
      </header>
      {isMobile && <ViajerosMobileHeader activeSection="" />}

      {loading
        ? <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", margin: "250px 0", transform: "translateX(-50%)" }} />
        : <>
          <section className={styles.vivienda_imgs}>
            {isMobile ? (
              <>
                <img
                  className={styles.arrow_left}
                  src="/images/profiles/arrow.svg"
                  alt="Biografia logo"
                  onClick={() => setActualImage(actualImage === 0 ? Vivienda_imgs.length - 1 : actualImage - 1)}
                />
                <img
                  className={styles.arrow_right}
                  src="/images/profiles/arrow.svg"
                  alt="Biografia logo"
                  onClick={() => setActualImage((actualImage + 1) % Vivienda_imgs.length)}
                />
                <img src={Vivienda_imgs[actualImage] || "/images/not_found/vivienda.webp"} alt="Vivienda" width={100} />
                <span>{actualImage + 1}</span>
              </>
            ) : (
              <>
                {Vivienda_imgs.map((vivienda, index) => (
                  <img key={index} src={vivienda || "/images/not_found/vivienda.webp"} alt="Vivienda imagen" width={100} />
                ))}
              </>
            )}
          </section>

          <UserPage
            usuarioData={anfitrionInfo}
            valoraciones={valoraciones}
            Gustos_imgs={Gustos_imgs}
            idiomasUser={idiomasUser}
            ViviendaInfo={ViviendaInfo}
            recomendaciones={anfitrionInfo.usuario?.recomendaciones}
            isColumns={isColumns}
            conectado={conectado}
            setConectado={setConectado}
            match={match}
            esAnfitrion={true}
            userID={id}
            emisorID={emisorID}
          />
        </>
      }

      <Footer />
    </>
  )
}