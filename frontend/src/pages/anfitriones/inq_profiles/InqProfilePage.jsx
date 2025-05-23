import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../../components/footer/footer";
import UserPage from "../../../components/usuarios/user_page/UserPage";
import AnfitrionMobileHeader from "../../../components/anfitriones/header/AnfitrionMobileHeader";
import ViajeroService from "../../../services/users/ViajeroService";
import LikesService from "../../../services/matches/LikesService";
import MatchesService from "../../../services/matches/MatchesService";
import styles from "./InqProfilePage.module.css";

export default function InqProfilePage() {
  const [viajeroInfo, SetViajeroInfo] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [Gustos_imgs, setGustos_imgs] = useState([]);
  const [idiomasUser, setIdiomasUser] = useState([]);
  const [galeria_imgs, setGaleria_imgs] = useState([null, null, null, null]);
  const [actualImage, setActualImage] = useState(0);

  const [loading, SetLoading] = useState(true);

  const [match, SetMatch] = useState(false);

  const location = useLocation();
  const id = location.state?.id;
  const emisorID = location.state?.emisorID;
  const [conectado, setConectado] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [isColumns, setIsColumns] = useState(window.innerWidth <= 1350);

  // Controlar cuando es pantalla pequeña 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsColumns(window.innerWidth <= 1350);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obtener datos del usuario si no hay y se tiene su id
  useEffect(() => {
    if (id && viajeroInfo.length === 0) {
      ViajeroService.getById(id).then(response => {
        console.log(response.data);
        SetViajeroInfo(response.data);
        setValoraciones(response.data.valoraciones);
        setIdiomasUser(response.data.biografia?.idiomas ? response.data.biografia.idiomas.trim().split(",") : ["Español"]);

        setGaleria_imgs([
          response.data.usuario.imagen1,
          response.data.usuario.imagen2,
          response.data.usuario.imagen3,
          response.data.usuario.imagen4
        ]);

        setGustos_imgs([
          response.data.usuario.gusto1,
          response.data.usuario.gusto2,
          response.data.usuario.gusto3
        ].filter(img => img != null));

        // Ver si se ha dado like
        LikesService.haDadoLike("anfitriones", emisorID, id)
          .then(likeDado => setConectado(likeDado.data))
          .catch(error => console.error("Error al buscar el match " + error));

        // Ver si se tiene match con el
        MatchesService.getTwoUsersMatchs(id, emisorID)
          .then(match => SetMatch(match.data))
          .catch(error => console.error("Error al buscar el match " + error));

        SetLoading(false);
      }
      ).catch(error => console.error("No se encontró el usuario " + error));
    }
  }, [id, viajeroInfo])

  return (
    <>
      <title>Perfil viajero | Anfitriones</title>


      {/* CABECERA */}
      <header className={styles.header}>
        <img className={styles.header_logo} src="/images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <nav>
          {!isMobile ? (
            <>
              <Link to="/anfitriones/inquilinos">Inquilinos</Link>
              <Link to="/anfitriones/foros">Foros</Link>
              <Link to="/anfitriones/conexiones">Matches</Link>
              <Link to="/inicio/soporte">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
              <Link to="/anfitriones/mi-cuenta">Mi Cuenta</Link>
            </>
          ) : (
            <>
              <Link to="/inicio/soporte">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          )}
        </nav>
      </header>
      {isMobile && <AnfitrionMobileHeader activeSection="" />}

      {loading
        ? <img src="/images/loading_gif.gif" alt="Cargando..." style={{ width: "350px", position: "relative", top: "0", left: "50%", margin: "250px 0", transform: "translateX(-50%)" }} />
        :
        <>
          <section className={styles.galeria_imgs}>
            {isMobile ? (
              <>
                <img
                  className={styles.arrow_left}
                  src="/images/profiles/arrow.svg"
                  alt="Biografia logo"
                  onClick={() => setActualImage(actualImage === 0 ? galeria_imgs.length - 1 : actualImage - 1)}
                />
                <img
                  className={styles.arrow_right}
                  src="/images/profiles/arrow.svg"
                  alt="Biografia logo"
                  onClick={() => setActualImage((actualImage + 1) % galeria_imgs.length)}
                />
                <img src={galeria_imgs[actualImage] || "/images/not_found/vivienda.webp"} alt="Vivienda" width={100} />
                <span>{actualImage + 1}</span>
              </>
            ) : (
              <>
                {galeria_imgs.map((vivienda, index) => (
                  <img key={index} src={vivienda || "/images/not_found/vivienda.webp"} alt="Vivienda imagen" width={100} />
                ))}
              </>
            )}
          </section>

          <UserPage
            usuarioData={viajeroInfo}
            valoraciones={valoraciones}
            Gustos_imgs={Gustos_imgs}
            idiomasUser={idiomasUser}
            isColumns={isColumns}
            recomendaciones={viajeroInfo.usuario?.experiencias}
            conectado={conectado}
            setConectado={setConectado}
            match={match}
            userID={id}
            emisorID={emisorID}
          />
        </>
      }

      <Footer />
    </>
  )
}