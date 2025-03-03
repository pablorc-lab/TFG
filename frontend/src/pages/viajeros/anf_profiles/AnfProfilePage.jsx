import { useEffect, useState } from "react";
import styles from "./AnfProfilePage.module.css"
import { Link } from "react-router-dom";
import ViajerosMobileHeader from "../../../components/viajeros/header/ViajerosMobileHeader";
import ScoreMiCuenta from "../../../components/usuarios/mi_cuenta/Score";

export default function AnfProfilePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 770);

  // Controlar cuando es pantalla pequeña
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 770);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Gustos_imgs = [
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ];


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
          <img src="/images/landing_page/casa_1.webp" alt="Casa" />
          <img src="/images/landing_page/casa_1.webp" alt="Casa" />
          <img src="/images/landing_page/casa_1.webp" alt="Casa" />
          <img src="/images/landing_page/casa_1.webp" alt="Casa" />
        </section>

        <section className={styles.vivienda_info}>
          <h1>Vivienda en Granada, Granada</h1>
          <h1>187 &euro; / noche</h1>
          <p>2 viajeros - 6 habitaciones - 3 camas - 2 baños</p>
        </section>

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
      </main>
    </>

  )
}