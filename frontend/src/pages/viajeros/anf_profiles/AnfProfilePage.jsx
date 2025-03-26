import { useEffect, useState } from "react";
import styles from "./AnfProfilePage.module.css"
import { Link, useLocation } from "react-router-dom";
import ViajerosMobileHeader from "../../../components/viajeros/header/ViajerosMobileHeader";
import OpinionesMiCuenta from "../../../components/usuarios/mi_cuenta/opiniones/Opiniones";
import Footer from "../../../components/footer/footer";
import AnfitrionService from "../../../services/users/AnfitrionService";

export default function AnfProfilePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [isColumns, setIsColumns] = useState(window.innerWidth <= 1250);
  const [actualImage, setActualImage] = useState(0);

  const [anfitrionInfo, SetAnfitrionInfo] = useState([]);
  const [Gustos_imgs, setGustos_imgs] = useState([]);
  const [idiomasUser, setIdiomasUser] = useState(["Español"]);
  const [valoraciones, setValoraciones] = useState([]);
  const [Vivienda_imgs, setVivienda_imgs] = useState([null, null, null, null]);

  const location = useLocation();
  const id = location.state?.id;

  // Obtener datos del usuario si no hay y se tiene su id
  useEffect(() => {
    if (id && anfitrionInfo.length === 0) {
      AnfitrionService.getById(id).then(response => {
        console.log(response.data);
        SetAnfitrionInfo(response.data);
        setValoraciones(response.data.valoraciones);
        setIdiomasUser(response.data.biografia?.idiomas ? response.data.biografia.idiomas.trim().split(",") : []);
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

  // Controlar cuando es pantalla pequeña 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsColumns(window.innerWidth <= 1250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const PerfilUsuario = (
    <section className={styles.user_info}>
      <article className={styles.user_article}>
        <img className={styles.user_img} src={anfitrionInfo.usuario?.profileImage || "/images/not_found/user_img.png"} alt="Imagen de perfil" width={50} />
        <div>
          <h2>Anfitrión : {anfitrionInfo.usuario?.nombre || "-"}</h2>
          <div className={styles.user_reservas}>
            <p>{anfitrionInfo.usuario?.reservas_realizadas || 0} reservas</p>
            <div className={styles.user_score}>
              <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
              <h3>{anfitrionInfo.usuario?.valoracion_media || 0.1}</h3>
            </div>
          </div>
        </div>
      </article>

      <p>{anfitrionInfo.usuario?.descripcion || "Este anfitrión aún no se ha descrito."}</p>

      <article className={styles.user_conectar}>
        <div className={styles.user_likes}>
          {Gustos_imgs.map((gusto, index) => (
            <img
              key={index}
              src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
              alt={`Logo gusto ${index + 1}`}
              width={100}
              onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
            />
          ))}
        </div>
        <button>Conectar</button>
      </article>
    </section>
  );

  const Biografia = (
    <section className={styles.user_biografia}>
      <div className={styles.user_title}>
        <img src="/images/profiles/biografia.svg" alt="Biografia logo" />
        <h1>Biografía</h1>
      </div>

      <article className={styles.user_descripcion}>
        <h2>Sobre mí</h2>
        <p>{anfitrionInfo.biografia?.sobreMi}</p>

        <h2>Idiomas que hablo</h2>
        <ul>
          {idiomasUser?.map((idioma, index) => (
            <li key={index}>{idioma}</li>
          ))}
        </ul>

        <h2>Sobre el alojamiento</h2>
        <p>{anfitrionInfo.biografia?.descripcionExtra || "Aun no existe una descripción del alojamiento"}</p>
      </article>
    </section>
  );

  const Recomendaciones = (
    <section className={styles.user_recomendations_section}>
      <div className={`${styles.user_title} ${styles.user_title2}`}>
        <img src="/images/profiles/recomendaciones.svg" alt="Recomendaciones logo" />
        <h1>Mis recomendaciones</h1>
      </div>

      <article className={styles.user_recomendations}>
        <h3>Restaurante favorito en la ciudad</h3>
        <p>Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’. Su especialidad es el pescado fresco y los platos tradicionales. Además, si vas los viernes, hay música en vivo. ¡Te encantará!</p>

        <div className={styles.logos_recomendations}>
          <img src="/images/profiles/location.svg" alt="Imagen location" />
          <p><strong>Ubicación:</strong> Calle Mayor, 23, 18028.</p>
        </div>
      </article>

      <article className={styles.user_recomendations}>
        <h3>Ruta de senderismo secreta con vistas increíbles</h3>
        <p>A solo 20 minutos de aquí, hay un sendero poco conocido que lleva a un mirador impresionante. Ideal para ver el atardecer y desconectar. Si te interesa, dime y te doy más detalles.</p>

        <div className={styles.logos_recomendations}>
          <img src="/images/profiles/backpack.svg" alt="Icono de mochila" />
          <p><strong>Recomendación:</strong> Lleva calzado cómodo y agua.</p>
        </div>
      </article>
    </section>
  );

  const Valoraciones = (
    <section className={styles.valoraciones}>
      <OpinionesMiCuenta
        showSize={true}
        nota_media={anfitrionInfo.usuario?.valoracion_media}
        valoraciones={valoraciones}
      />
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

      <main className={styles.main}>
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

        {isColumns ? (
          <>
            {ViviendaInfo}
            {PerfilUsuario /* PERFIL DEL USUARIO*/}
            {Biografia /* BIOGRAFÍA*/}
            {Recomendaciones /* RECOMENDACIONES*/}
            {Valoraciones}
          </>
        ) : (
          <>
            <div className={styles.columna_izquierda}>
              {ViviendaInfo}
              {Biografia /* BIOGRAFÍA*/}
              {Recomendaciones /* RECOMENDACIONES*/}
            </div>

            <div className={styles.columna_derecha}>
              {PerfilUsuario /* PERFIL DEL USUARIO*/}
              {Valoraciones}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>

  )
}