import styles from "./Comentarios.module.css"

const Comentarios = ({ profileImg, fecha, nombre, nota, descripcion }) => {
  return (
    <article className={styles.comentarios_container}>
      <div className={styles.profile_img}>
        <img
          src={profileImg || "/images/not_found/user_img.png" }
          onError={(e) => e.target.src = "/images/not_found/user_img.png"}
          alt="Imagen de perfil"
          width={50}
        />
        <h2>{nombre}</h2>
      </div>

      <article className={styles.valoracion}>
        <div>
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={`/images/usuarios/estrella${i + 1 <= nota ? "" : "_gris"}.webp`}
              alt="Ícono de estrella"
            />
          ))}
        </div>
        <p>{fecha || "--/--/--"}</p>
      </article>

      <p className={styles.comentario}>{descripcion || "Reseña no encontrada"}</p>
    </article>
  );
}

export default Comentarios;
