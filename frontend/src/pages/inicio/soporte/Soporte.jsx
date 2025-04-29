import Footer from "../../../components/footer/footer";
import HeaderHome from "../../../components/home/headerHome";
import styles from "./Soporte.module.css"
const Soporte = () => {
  return (
    <>
      <title>Soporte | Beafrens</title>
      <HeaderHome />

      <main className={styles.soporteMain}>
        <form className={styles.soporteForm}>
          <h2>Contacto de Soporte</h2>
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="asunto">Asunto:</label>
          <input type="text" id="asunto" name="asunto" required />

          <label htmlFor="mensaje">Mensaje:</label>
          <textarea id="mensaje" name="mensaje" required></textarea>

          <button type="submit">Enviar</button>
        </form>
      </main>

      <Footer />
    </>

  );
}

export default Soporte;
