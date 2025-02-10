import { lazy, Suspense, useState } from "react";
import ViajerosFinalHeader from "../../../components/viajeros/alojamientos/ViajerosFinalHeader";
import styles from "./MiCuenta.module.css"
import ScoreMiCuenta from "../../../components/usuarios/mi_cuenta/Score";
const ValoracionesMiCuenta = lazy(() => import("../../../components/usuarios/mi_cuenta/Valoraciones"));

export default function MiCuenta() {
  const [activeMenu, setActiveMenu] = useState(0);

  const Gustos_imgs = [
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ];

  const userNavItems = [
    { src: "/images/usuarios/account/profile.svg", alt: "Editar perfil", text: "Perfil público" },
    { src: "/images/usuarios/account/edit.svg", alt: "Editar perfil", text: "Editar perfil" },
    { src: "/images/usuarios/account/house.svg", alt: "Editar perfil", text: "Vivienda" },
    { src: "/images/usuarios/account/security.svg", alt: "Editar perfil", text: "Seguridad" },
    { src: "/images/usuarios/account/star.svg", alt: "Editar perfil", text: "Opiniones" }
  ];

  return (
    <>
      <title>Mi cuenta | Viajeros</title>
      <ViajerosFinalHeader />

      <main className={styles.main}>
        <article className={styles.main_containers}>
          {/* Perfil de usuario*/}
          <section className={styles.user_container}>
            <article className={styles.user_profile}>
              <img className={styles.user_img} src="/images/landing_page/persona_2.webp" alt="Imagen de perfil" width={50} />
              
              <div className={styles.user_general_info}>
                <div className={styles.user_name}>
                  <h2>Eduardo G</h2>
                  <p>(36 años)</p>
                </div>
                <ScoreMiCuenta />
                <div className={styles.user_likes}>
                  {Gustos_imgs.map((gusto, index) => (
                    <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
                  ))}
                </div>
              </div>
            </article>

            <div className={styles.user_bubble}>
              <h4>Barcelona (300&euro; / noche)</h4>
              <p>Amante de la aventura y los viajes hacia lugares muy bonitos</p>
            </div>
          </section>

          {/* Menú de nav*/}
          <nav className={styles.user_nav}>
            <ul className={styles.user_nav_ul}>
              {userNavItems.map((item, index) => (
                <li key={index} onClick={() => setActiveMenu(index)} className={activeMenu === index ? styles.active : undefined}>
                  <img src={item.src} alt={item.text} />
                  <h2>{item.text}</h2>
                </li>
              ))}
            </ul>
          </nav>
        </article>

        {/* Componente de los menús*/}
        <Suspense fallback={null}>
          <ValoracionesMiCuenta />
        </Suspense>
      </main>
    </>
  )
}