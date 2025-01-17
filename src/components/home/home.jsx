import { useEffect, useState, useRef } from "react";
import Anf_card from "../users_cards/anf_card";
import Inq_card from "../users_cards/inq_card";
import Footer from "../footer/footer";
import Question from "./questions";
import faqData from "./questions_data";
import styles from "./home.module.css"

// Datos de las ventajas
const advantages = [
  { title: "Comunidad de Viajeros Activos", description: "Conecta con anfitriones apasionados y crea experiencias auténticas.",},
  { title: "Diversidad de Alojamientos", description: "Amplia variedad de estancias que se adaptan a diferentes estilos.", },
  { title: "Estancias Personalizadas", description: "Alojamientos diseñados a la medida de tus preferencias y estilo de vida.", },
  { title: "Conexiones por intereses.", description: "Encuentra anfitriones que compartan tu estilo de vida.", },
  { title: "Fácil Proceso de Reserva", description: "Reserva de manera sencilla y rápida con solo unos clics.", },
  { title: "Impacto Global", description: "Plataforma presente en varios destinos, conectando a viajeros.", },
];

// Datos de las opiniones
const opinions = [
  { text: "Esta plataforma cambió por completo la forma en que viajo. No solo encontré alojamientos increíbles, sino que pude conectar con anfitriones que comparten mis intereses en fotografía y senderismo. Es una experiencia mucho más personal que otras webs.",
    img: "images/landing_page/persona_4.webp",
    name: "Alejandra Domínguez",
    role: "Viajero"
	},
  {text: "Recibir viajeros a través de esta aplicación ha sido una gran experiencia. Me encanta que los viajeros con los que conecto tienen intereses en común conmigo, lo que ha hecho que las estancias sean mucho más amenas y agradables. He conocido a personas increíbles aqui.",
    img: "images/landing_page/persona_1.webp",
    name: "Henry Cavill",
    role: "Anfitrión",
  },
  {text: "He probado otras plataformas, pero esta destaca por la conexión con los anfitriones. Encontré a alguien que ama los deportes tanto como yo, lo cual hizo que mi estancia fuera mucho más divertida. Además, las valoraciones son muy precisas, lo que me dio mucha confianza al elegir vivienda.",
    img: "images/landing_page/persona_3.webp",
    name: "Jose Miguel Sosa",
    role: "Viajero",
  },
];

export default function Home_page() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNavVisible, setNavVisible] = useState(true);
  const menu_user_Ref = useRef(null);
  const userRef = useRef(null);

  // Manejar el clic fuera del menú y fuera del botón de usuario
  const handleClickOutside_Menu = (event) => {
    if (menu_user_Ref.current && !menu_user_Ref.current.contains(event.target) && !userRef.current.contains(event.target))
      setMenuOpen(false); // Cierra el menú
  };

  // Establecer navVisible a true si el ancho de la ventana es menor o igual a 769px
  const checkNavVisibility = () => {
    setNavVisible(window.innerWidth > 769);
  };

  useEffect(() => {
    // Cambia el título solo al montar el componente
    document.title = "Beafrens";

    // Escuchar clics en todo el documento
    document.addEventListener("mousedown", handleClickOutside_Menu);
   
    checkNavVisibility();
    window.addEventListener("resize", checkNavVisibility); // Cada vez que cambie el tamaño de la ventana se evalua

    // Función de limpieza (esto se ejecutará cuando el componente se desmonta o antes de que se ejecute de nuevo el efecto).
    // Asegura que se elimine el evento cuando el componente ya no esté en la página.
    return () => {
      //Eliminar los evento cuando el componente se desmonta.
      // Evita que el manejador de eventos siga activo cuando el componente ya no esté visible.
      document.removeEventListener("mousedown", handleClickOutside_Menu);
      window.removeEventListener("resize", checkNavVisibility);
    };
  }, []);

	return (
    <>
      {/*Cabecera*/}
      <header className={styles.header}>
        <img className={styles.header_logo} src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
        <section className={styles.header_menu}>
          <nav className={styles.header_nav}>
            <a>Alojamientos</a>
            <a>Inquilinos</a>
            <a>Guía</a>
          </nav>

          <article className={`${styles.header_user} ${isMenuOpen && styles.open}`}>
            <div className={styles.user_button} onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
              <img src="images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50" />
              <img className={styles.client_acces} src="images/landing_page/menu_user.png"/>
            </div>

            <div className={styles.dropdown_menu} ref={menu_user_Ref}>
              <ul>
                {!isNavVisible && (
                  <>
                    <li><span>Alojamientos</span></li>
                    <li><span>Inquilinos</span></li>
                    <li className={styles.guia_menu_header}><span>Guía</span></li>
                  </>
                )}
                <li><span>Iniciar sesión</span></li>
                <li className={styles.li_registrate}><span>Registrarse</span></li>
                <li><span>Soporte</span></li>
              </ul>
            </div>
          </article>
        </section>
      </header>

      <main>
        {/*?LOGO INICIAL*/}
        <section className={styles.main_container}>
          <figure className={styles.logo_main}>
            <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150"/>
            <figcaption>Bearfrens</figcaption>
          </figure>
        	<p className={styles.main_descrpt}>Donde viajeros y anfitriones se encuentran</p>
        </section>

        {/*?SECCION DE LOS ANFITRIONES*/}
        <section className={`${styles.card_section} ${styles.anf_card}`}>
          <article className={styles.button_container}>
            <h2>Encuentra el alojamiento perfecto</h2>
            <div className={styles.btn_alojamientos}>
              <img src="images/logos/anfitrion.png" alt="Icono casa" />
              <p>Hospedajes</p>
            </div>
          </article>
          
          <article className={styles.card_container}>
            <Anf_card
              styles={styles}
              Casa_img="/images/landing_page/casa_1.webp"
              Perfil_img="/images/landing_page/persona_1.webp"
              Nombre="Pablo"
              Gustos_imgs={[
                "/images/usuarios/Gustos/baseball.svg",
                "/images/usuarios/Gustos/pesca.svg",
                "/images/usuarios/Gustos/poker.svg",
              ]}
              Valoracion={4.91}
              Ubicacion="Barcelona"
              Precio="300"
              Descripcion="Amante de la aventura y los viajes improvisados"
            />
          </article>
        </section>
        
        {/*?SECCION DE LOS VIAJEROS*/}
        <section className={`${styles.card_section} ${styles.inq_card}`}>
          <article className={styles.card_container}>
            <Inq_card
              styles={styles}
              Perfil_img="images/landing_page/persona_3.webp"
              Nombre="Juanma"
              Valoracion="4.51"
              Num_viajes="82"
              Edad="56"
              Profesion="Mécanico"
              Descripcion="Soy un hombre apasionado por conocer nuevas personas y sitios desconocidos"
              Gustos_imgs={[
                "/images/usuarios/Gustos/pesca.svg",
                "/images/usuarios/Gustos/social.svg",
                "/images/usuarios/Gustos/baseball.svg",
              ]}
            />
          </article>

          <article className={styles.button_container}>
            <h2>Conecta con personas mundialmente</h2>
            <div className={styles.btn_inquilinos}>
                <img src="images/logos/inquilino.png" alt="Icono inquilino" />
                <p>Inquilinos</p>
            </div>
          </article>
        </section>

        {/*?VENTAJAS*/}
        <section className={styles.advantages}>
          <h2>VENTAJAS</h2>
          <article className={styles.advantages_container}>
            {advantages.map((advantage, index) => (
              <article className={styles.advantage_item} key={index}>
                <img
                  src={`/images/landing_page/advantage_${index + 1}.png`}
                  alt={`Advantage ${index + 1}`}
                  className={styles.icon}
                  width="250"
                />
                <div className={styles.advantage_text}>
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </div>
              </article>
            ))}
          </article>
        </section>

        {/*?OPINIONES*/}
        <section className={styles.opinions}>
          <h2>OPINIONES DE NUESTROS CLIENTES</h2>
          <article className={styles.opinions_container}>
            {opinions.map(({ text, img, name, role }, index) => (
              <div
                key={index}
                className={`${styles.bubble_text} ${index === 1 && styles.central}`}
              >
                <p>{text}</p>
                <article className={styles.prof_opinion}>
                  <img
                    className={styles.profile_img}
                    src={img}
                    alt={`Imagen de ${role}`}
                    width="250"
                  />
                  <div className={styles.info_opinion}>
                    <h3>{name}</h3>
                    <p>{role}</p>
                  </div>
                </article>
              </div>
            ))}
          </article>
        </section>

        {/*FAQs*/}
        <section className={styles.freq_questions}>
          <h2>PREGUNTAS FRECUENTES</h2>
          {faqData.map((item, index) => (
            <Question
              key={index}
              styles={styles}
              pregunta={item.pregunta}
              respuesta={item.respuesta}
            />
          ))}
          <button>Mas preguntas en nuestra Guía</button>
        </section>
      </main>

      {/*Pie de pagina*/}
      <Footer/>
    </>
  );
}