import { useEffect } from "react";
import Anf_card from "../users_cards/anf_card";
import Inq_card from "../users_cards/inq_card";
import Question from "./questions";

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
	// Cambia el título solo al montar el componente
	useEffect(() => {
    document.title = "Beafrens"; 
  }, []); 

	return (
    <>
      {/*Cabecera*/}
      <header>
        <img className="header_logo" src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150"/>
        <article className="header_menu">
          <div id="menu_icon">
            <img src="images/logos/menu.png" alt="Icono de menú" />
          </div>

          <nav id="header_nav">
            <a>Inicio</a>
            <a>Alojamientos</a>
            <a>Inquilinos</a>
            <a>Soporte</a>
          </nav>

          <div className="header_user">
            <img src="images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50"/>
            <a href="#" className="client_access"> Acceder </a>
          </div>
        </article>
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
          <Question
            pregunta={"¿Como conecto con otros Viajeros o Anfitriones?"}
            respuesta={"texto ejemplo"}
          />
          <Question
            pregunta={"¿Que es y como se produce un “match”?"}
          />
          <Question
            pregunta={"¿Puedo cancelar un hospedaje ya acordado?"}
          />
          <Question
            pregunta={"¿Puedo viajar con más personas?"}
          />
          <Question
            pregunta={"¿Cómo busco a un Viajero/Anfitrión que conozco?"}
          />
          <Question
            pregunta={"¿Puedo encontrar personas que compartan mis intereses?"}
          />
          <button>Mas preguntas en nuestro FAQ</button>
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