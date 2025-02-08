import HeaderHome from "../../../components/home/headerHome";
import faqData from "../../../data/faq/questions_data";
import styles from "./FaqPage.module.css"
import Question from "../../../components/home/questions";
import Footer from "../../../components/footer/footer";

// "Object.entries()" convierte un objeto en un array de arrays, donde cada elemento es un par [clave, valor]
export default function FaqPage() {
  return (
    <>
      <title>FAQ | Beafrens</title>
      <HeaderHome />
      <section className={styles.freq_questions} style={{padding:"70px 7%", backgroundColor:"rgb(255, 250, 245)"}}>
        <h1>PREGUNTAS FRECUENTES</h1>

        {Object.entries(faqData).map(([categoria, preguntas]) => (
          <div key={categoria}>
            <h2>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
            {preguntas.map((item, index) => (
              <Question
                key={index}
                styles={styles}
                pregunta={item.pregunta}
                respuesta={item.respuesta}
              />
            ))}
          </div>
        ))}
      </section>
      <Footer/>
    </>
  )
}