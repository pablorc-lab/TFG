import { useEffect, useState, useRef } from "react";
import Anf_card from "../users_cards/anf_card";
import Inq_card from "../users_cards/inq_card";
import Question from "./questions";
import faqData from "./Data_faq_home";
import "./home.css"

// Datos de las ventajas
const advantages = [
  { title: "Comunidad de Viajeros Activos", description: "Conecta con anfitriones apasionados y crea experiencias auténticas.",},
  { title: "Diversidad de Alojamientos", description: "Amplia variedad de estancias que se adaptan a diferentes estilos.", },
  { title: "Estancias Personalizadas", description: "Alojamientos diseñados a la medida de tus preferencias y estilo de vida.", },
  { title: "Conexiones Basadas en Intereses", description: "Encuentra anfitriones que compartan tus pasatiempos y estilo de vida.", },
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
  const headerNavRef = useRef(null);
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
      <header>

        <img className="header_logo" src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150"/>
        <section className="header_menu">
         <nav id="header_nav">
            <a>Alojamientos</a>
            <a>Inquilinos</a>
            <a>Guía</a>
          </nav>

          <article className={`header_user  ${isMenuOpen ? "open" : ""}`}>
            <div className="user_button" onClick={() => setMenuOpen(!isMenuOpen)} ref={userRef}>
              <img src="images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50"/>
              <img src="images/landing_page/menu_user.png" className="client_acces"/>
            </div>
          
            <div className="dropdown_menu" ref={menu_user_Ref}>
              <ul>
                {!isNavVisible && (
                  <>
                    <li className="title_menu_header">Navegar</li>
                    <li id="li_alojamientos"><span>Alojamientos</span></li>
                    <li><span>Inquilinos</span></li>
                    <li id="li_guia"><span>Guía</span></li>
                  </>
                )}
                <li className="title_menu_header">Acceder</li>
                <li id="li_iniciar_sesion"><span>Iniciar sesión</span></li>
                <li id="li_registrate"><span>Registrarse</span></li>
                <li><span>Soporte</span></li>
              </ul>
            </div>
          </article>
        </section>
      </header>

      <main>
        {/*?LOGO INICIAL*/}
        <section className="main_container">
          <figure id="logo_main">
            <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150"/>
            <figcaption>Bearfrens</figcaption>
          </figure>
        	<p className="main_descrpt">Donde viajeros y anfitriones se encuentran</p>
        </section>

        {/*?SECCION DE LOS ANFITRIONES*/}
        <section className="card_section anf_card">
          <article className="button_container">
            <h2>Encuentra el alojamiento perfecto</h2>
            <div id="btn_alojamientos">
              <img src="images/logos/anfitrion.png" alt="Icono casa" />
              <p>Hospedajes</p>
            </div>
          </article>
          
          <article className="card_container">
            <Anf_card
              Casa_img="/images/landing_page/casa_1.webp"
              Perfil_img="/images/landing_page/persona_1.webp"
              Nombre="Pablo"
              Gustos_imgs={[
                "/images/usuarios/Gustos/baseball.png",
                "/images/usuarios/Gustos/pesca.png",
                "/images/usuarios/Gustos/poker.png",
              ]}
              Valoracion={4.91}
              Ubicacion="Barcelona"
              Precio="300"
              Descripcion="Amante de la aventura y los viajes improvisados"
              prof_number="prof_1"
            />
          </article>
        </section>
        
        {/*?SECCION DE LOS VIAJEROS*/}
        <section className="card_section inq_card">
          <article className="card_container">
            <Inq_card
              Perfil_img="images/landing_page/persona_3.webp"
              Nombre="Juanma"
              Valoracion="4.51"
              Num_viajes="82"
              Edad="56"
              Profesion="Mécanico"
              Descripcion="Soy un hombre apasionado por conocer nuevas personas y sitios desconocidos"
              Gustos_imgs={[
                "/images/usuarios/Gustos/pesca.png",
                "/images/usuarios/Gustos/social.png",
                "/images/usuarios/Gustos/baseball.png",
              ]}
              prof_number="prof_3"
            />
          </article>

          <article className="button_container">
            <h2>Conecta con personas mundialmente</h2>
            <div id="btn_inquilinos">
                <img src="images/logos/inquilino.png" alt="Icono inquilino" />
                <p>Inquilinos</p>
            </div>
          </article>
        </section>

        {/*?VENTAJAS*/}
        <section className="advantages">
          <h2>VENTAJAS</h2>
          <article className="advantages_container">
            {advantages.map((advantage, index) => (
              <article className="advantage_item" key={index}>
                <img
                  src={`/images/landing_page/advantage_${index + 1}.png`}
                  alt={`Advantage ${index + 1}`}
                  className="icon"
                  width="250"
                />
                <div className="advantage_text">
                  <h3>{advantage.title}</h3>
                  <p>{advantage.description}</p>
                </div>
              </article>
            ))}
          </article>
        </section>

        {/*?OPINIONES*/}
        <section className="opinions">
          <h2>OPINIONES DE NUESTROS CLIENTES</h2>
          <article className="opinions_container">
            {opinions.map(({ text, img, name, role }, index) => (
              <div
                key={index}
                className={`bubble_text ${index === 1 ? "central" : ""}`}
              >
                <p>{text}</p>
                <article className="prof_opinion">
                  <img
                    className="profile_img"
                    src={img}
                    alt={`Imagen de ${role}`}
                    width="250"
                  />
                  <div className="info_opinion">
                    <h3>{name}</h3>
                    <p>{role}</p>
                  </div>
                </article>
              </div>
            ))}
          </article>
        </section>

        {/*FAQs*/}
        <section className="freq_questions">
          <h2>PREGUNTAS FRECUENTES</h2>
          {faqData.map((item, index) => (
            <Question
              key={index}
              pregunta={item.pregunta}
              respuesta={item.respuesta}
            />
          ))}
          <button>Mas preguntas en nuestra Guía</button>
        </section>
      </main>

      {/*Pie de pagina*/}
      <footer>
        {/*Logo*/}
        <figure id="logo_footer">
          <img
            src="images/logos/logo_blanco.png"
            alt="Logo Bearfrens"
            width={150}
          />
          <figcaption>Bearfrens</figcaption>
        </figure>
        {/*Información de contacto*/}
        <div className="contact-info">
          <div id="text-info">
            <p>
              Email: <strong>pabloramblado@correo.ugr.es</strong>
            </p>
            <p>
              Teléfono: <strong>+34 666-666-666</strong>
            </p>
          </div>
          <div className="social-media">
            <img
              src="./images/logos/instagram_logo.png"
              alt="instagram_logo"
              width={50}
            />
            <img src="./images/logos/x_logo.png" alt="x_logo" width={50} />
            <img
              src="./images/logos/youtube_logo.png"
              alt="youtube_logo"
              width={50}
            />
            <img
              src="./images/logos/facebook_logo.png"
              alt="facebook_logo"
              width={50}
            />
          </div>
        </div>
        {/*Políticias de privacidad*/}
        <div className="privacy-policy">
          <a href="/politicas-de-privacidad">Políticas de Privacidad</a>
        </div>
      </footer>
    </>
  );
}