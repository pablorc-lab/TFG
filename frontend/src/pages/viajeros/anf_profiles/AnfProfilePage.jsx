import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ViajerosMobileHeader from "../../../components/viajeros/header/ViajerosMobileHeader";
import Footer from "../../../components/footer/footer";
import UserPage from "../../../components/usuarios/user_page/UserPage";
import AnfitrionService from "../../../services/users/AnfitrionService";
import styles from "./AnfProfilePage.module.css"

export default function AnfProfilePage() {
  const [anfitrionInfo, SetAnfitrionInfo] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [Gustos_imgs, setGustos_imgs] = useState([]);
  const [idiomasUser, setIdiomasUser] = useState([]);
  const [Vivienda_imgs, setVivienda_imgs] = useState([null, null, null, null]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [isColumns, setIsColumns] = useState(window.innerWidth <= 1250);
  const [actualImage, setActualImage] = useState(0);

  const location = useLocation();
  const id = location.state?.id;

  // Controlar cuando es pantalla pequeña 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsColumns(window.innerWidth <= 1250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obtener datos del usuario si no hay y se tiene su id
  useEffect(() => {
    if (id && anfitrionInfo.length === 0) {
      AnfitrionService.getById(id).then(response => {
        console.log(response.data);
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

      }
      ).catch(error => console.error("No se encontró el usuario " + error));
    }
  }, [id, anfitrionInfo])

  // Información de la vivienda
  const ViviendaInfo = (
    <section className={styles.vivienda_info}>
      <h1>Vivienda en {anfitrionInfo.usuario?.vivienda.ciudad || "-"}, {anfitrionInfo.usuario?.vivienda.provincia || "-"}</h1>
      <h1>{anfitrionInfo.usuario?.vivienda.precio_noche || "-"}&euro; / noche</h1>
      <p>
        {(anfitrionInfo.usuario?.vivienda.viajeros || "-") + " viajeros - "}
        {(anfitrionInfo.usuario?.vivienda.habitaciones || "-") + " habitaciones - "}
        {(anfitrionInfo.usuario?.vivienda.camas || "-") + " camas - "}
        {(anfitrionInfo.usuario?.vivienda.banios || "-") + " baños"}
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
              <Link to="/viajeros/alojamientos">Comunidades</Link>
              <Link to="/viajeros/alojamientos">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          ) : (
            <>
              <Link to="/viajeros/alojamientos">Soporte</Link>
              <Link to="/inicio/faq">FAQ</Link>
            </>
          )}
        </nav>
      </header>
      {isMobile && <ViajerosMobileHeader activeSection="" />}

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
      />
      <Footer />
    </>
  )
}