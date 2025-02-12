import styles from "./Comentarios.module.css"

const Comentarios = () => {

  return (
    <article className={styles.comentarios_container}>
      <div className={styles.profile_img}>
        <img  src="/images/landing_page/persona_3.webp" alt="Imagen de perfil" width={50} />
        <h2>Juan P</h2>
      </div>

      <article className={styles.valoracion}>
        <div>
          <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
          <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
          <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
          <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
          <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
        </div>
        <p>31/12/24</p>
      </article>

      <p className={styles.comentario}>
        La estadía fue buena en general. El lugar estaba limpio y bien ubicado, aunque hubo algunos pequeños detalles que podrían mejorar. Aun así, la comunicación fue clara y la experiencia fue positiva. ¡Gracias!
      </p>
    </article>
  );
}

export default Comentarios;
