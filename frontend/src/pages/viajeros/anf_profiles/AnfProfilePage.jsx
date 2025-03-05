import { useEffect, useState } from "react";
import styles from "./AnfProfilePage.module.css"
import { Link } from "react-router-dom";
import ViajerosMobileHeader from "../../../components/viajeros/header/ViajerosMobileHeader";
import OpinionesMiCuenta from "../../../components/usuarios/mi_cuenta/opiniones/Opiniones";
import Footer from "../../../components/footer/footer";

export default function AnfProfilePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);
  const [isColumns, setIsColumns] = useState(window.innerWidth <= 1250);
  const [actualImage, setActualImage] = useState(0);

  // Controlar cuando es pantalla pequeña
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsColumns(window.innerWidth <= 1250);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Gustos_imgs = [
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ];

  const Vivienda_imgs = [
    "/images/landing_page/casa_1.webp",
    "/images/landing_page/casa_2.webp",
    "/images/landing_page/casa_1.webp",
    "/images/landing_page/casa_2.webp"
  ]

  const ViviendaInfo = (
    <section className={styles.vivienda_info}>
      <h1>Vivienda en Granada, Granada</h1>
      <h1>187 &euro; / noche</h1>
      <p>2 viajeros - 6 habitaciones - 3 camas - 2 baños</p>
    </section>
  );

  const PerfilUsuario = (
    <section className={styles.user_info}>
      <article className={styles.user_article}>
        <img className={styles.user_img} src="/images/landing_page/persona_2.webp" alt="Imagen de perfil" width={50} />
        <div>
          <h2>Anfitrión : Eduardo</h2>
          <div className={styles.user_reservas}>
            <p>23 reservas</p>
            <div className={styles.user_score}>
              <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
              <h3>4.9</h3>
            </div>
          </div>
        </div>
      </article>

      <p>Amante de la aventura y los viajes hacia lugares aislados</p>

      <article className={styles.user_conectar}>
        <div className={styles.user_likes}>
          {Gustos_imgs.map((gusto, index) => (
            <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
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
        <p>¡Hola! Soy Pablo, un apasionado de los viajes, la gastronomía y mi ciudad. Me encanta conocer gente de todo el mundo y compartir recomendaciones sobre los mejores rincones locales. Como anfitrión, mi objetivo es que disfrutes de una estancia cómoda y te sientas como en casa. Siempre estoy disponible para ayudarte con consejos sobre restaurantes, actividades y lugares secretos que solo los locales conocemos.</p>

        <h2>Idiomas que hablo</h2>
        <ul>
          <li>Español</li>
          <li>Francés</li>
          <li>Inglés</li>
        </ul>

        <h2>Sobre el alojamiento</h2>
        <p>Te hospedarás en una acogedora vivienda compartida, ideal para viajeros que buscan comodidad y una experiencia auténtica. Ubicada a pocos minutos del centro y cerca de las principales atracciones, ofrece un ambiente tranquilo con vistas impresionantes. ¡Será un placer recibirte!</p>
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
      <OpinionesMiCuenta showSize={true} />
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
              <img src={Vivienda_imgs[actualImage]} alt="Vivienda" width={100} />
            </>
          ) : (
            <>
              {Vivienda_imgs.map((vivienda, index) => (
                <img key={index} src={vivienda} alt="Vivienda imagen" width={100} />
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

      <Footer/>
    </>

  )
}