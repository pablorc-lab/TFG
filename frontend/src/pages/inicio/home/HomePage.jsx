import HeaderHome from "../../../components/home/headerHome";
import AnfCard from "../../../components/users_cards/AnfCard";
import InqCard from "../../../components/users_cards/ViajCard";
import Footer from "../../../components/footer/footer";
import Question from "../../../components/home/questions";
import faqData from "../../../data/faq/questions_data";
import styles from "./HomePage.module.css"
import stylesFAQ from "../faq/FaqPage.module.css"
import { Link } from "react-router-dom";

// Datos de las ventajas
const advantages = [
  { title: "Comunidad de Viajeros Activos", description: "Conecta con anfitriones apasionados y crea experiencias auténticas.", },
  { title: "Diversidad de Alojamientos", description: "Amplia variedad de estancias que se adaptan a diferentes estilos.", },
  { title: "Estancias Personalizadas", description: "Alojamientos diseñados a la medida de tus preferencias y estilo de vida.", },
  { title: "Conexiones por intereses.", description: "Encuentra anfitriones que compartan tu estilo de vida.", },
  { title: "Fácil Proceso de Reserva", description: "Reserva de manera sencilla y rápida con solo unos clics.", },
  { title: "Impacto Global", description: "Plataforma presente en varios destinos, conectando a viajeros.", },
];

// Datos de las opiniones
const opinions = [
  {
    text: "Esta plataforma cambió por completo la forma en que viajo. No solo encontré alojamientos increíbles, sino que pude conectar con anfitriones que comparten mis intereses en fotografía y senderismo. Es una experiencia mucho más personal que otras webs.",
    img: "/images/landing_page/persona_4.webp",
    name: "Alejandra Domínguez",
    role: "Viajero"
  },
  {
    text: "Recibir viajeros a través de esta aplicación ha sido una gran experiencia. Me encanta que los viajeros con los que conecto tienen intereses en común conmigo, lo que ha hecho que las estancias sean mucho más amenas y agradables. He conocido a personas increíbles aqui.",
    img: "/images/landing_page/persona_1.webp",
    name: "Henry Cavill",
    role: "Anfitrión",
  },
  {
    text: "He probado otras plataformas, pero esta destaca por la conexión con los anfitriones. Encontré a alguien que ama los deportes tanto como yo, lo cual hizo que mi estancia fuera mucho más divertida. Además, las valoraciones son muy precisas, lo que me dio mucha confianza al elegir vivienda.",
    img: "/images/landing_page/persona_3.webp",
    name: "Jose Miguel Sosa",
    role: "Viajero",
  },
];

export default function HomePage() {

  return (
    <>
      <title>Inicio | Beafrens</title>
      {/*Cabecera*/}
      <HeaderHome isHome={true} />

      <main>
        {/*?LOGO INICIAL*/}
        <section className={styles.main_container}>
          <figure className={styles.logo_main}>
            <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
            <figcaption>Bearfrens</figcaption>
          </figure>
          <p className={styles.main_descrpt}>Donde viajeros y anfitriones se encuentran</p>
        </section>

        {/*?SECCION DE LOS ANFITRIONES*/}
        <section className={`${styles.card_section} ${styles.anf_card}`}>
          <article className={styles.button_container}>
            <h2>Encuentra el alojamiento perfecto</h2>
            <Link to="/viajeros/alojamientos" className={styles.btn_alojamientos}>
              <img src="images/logos/anfitrion.png" alt="Icono casa" />
              <p>Alojamientos</p>
            </Link>
          </article>

          <article className={styles.card_container}>
            <AnfCard
              styles={styles}
              Casa_img="/images/landing_page/casa_1.webp"
              Perfil_img="/images/landing_page/persona_1.webp"
              Nombre="Pablo"
              Gustos_imgs={["baseball", "pesca", "poker",]}
              Valoracion={4.91}
              Ubicacion="Barcelona"
              Precio="300"
              Descripcion="Amante de la aventura y los viajes improvisados"
              enlace={false}
            />
          </article>
        </section>

        {/*?SECCION DE LOS VIAJEROS*/}
        <section className={`${styles.card_section} ${styles.inq_card}`}>
          <article className={styles.card_container}>
            <InqCard
              styles={styles}
              Perfil_img="/images/landing_page/persona_3.webp"
              Nombre="Juanma"
              Valoracion="4.51"
              Num_viajes="82"
              Edad="56"
              Profesion="Mécanico"
              Descripcion="Soy un hombre apasionado por conocer nuevas personas y sitios desconocidos"
              Gustos_imgs={["pesca", "social", "baseball"]}
              tiempo_estancia={"3 - 6 meses"}
              enlace={false}
            />
          </article>

          <article className={styles.button_container}>
            <h2>Conecta con personas mundialmente</h2>
            <Link to="/anfitriones/inquilinos" className={styles.btn_inquilinos}>
              <img src="images/logos/inquilino.png" alt="Icono inquilino" />
              <p>Inquilinos</p>
            </Link>
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
        <section className={stylesFAQ.freq_questions}>
          <h1 className={stylesFAQ.home_freq_question}>PREGUNTAS FRECUENTES</h1>
          {faqData.conexion.map((item, index) => (
            <Question
              key={index}
              styles={stylesFAQ}
              pregunta={item.pregunta}
              respuesta={item.respuesta}
            />
          ))}
          <Link to="/inicio/faq">
            <button>Mas preguntas en nuestra Guía</button>
          </Link>
        </section>
      </main>

      {/*Pie de pagina*/}
      <Footer />
    </>
  );
}