import { Link } from "react-router-dom";

export default function Anf_card({ styles, anf_id, Casa_img, Perfil_img, Nombre = "-", Gustos_imgs, Valoracion = "/", Ubicacion = "-", Precio = "-", Descripcion = "-", enlace = true }) {

  return (
    <article className={styles.general_prof}>
      {/* Imagen de la casa */}
      <Link to="/viajeros/perfil-anfitrion" state={{ id: anf_id }} style={{ pointerEvents: !enlace ? 'none' : 'auto' }}>
        <img className={styles.house} src={Casa_img} alt="Imagen casa" width={500} />
      </Link>

      <div className={styles.anf_info}>
        {/* Perfil y Nombre */}
        <Link to="/viajeros/perfil-anfitrion" state={{ id: anf_id }} className={styles.anf_link} style={{ pointerEvents: !enlace ? 'none' : 'auto' }}>
          <div className={`${styles.personal_info} ${styles.anf_personal_info}`}>
            <img className={styles.profile_img} src={Perfil_img} alt={`Imagen de ${Nombre}`} width={250} />
            <div className={styles.anf_name}>
              <h3>{Nombre}</h3>
            </div>
          </div>
        </Link>

        {/* Gustos */}
        <div className={styles.anf_rating}>
          <div className={`${styles.score} ${styles.anf_score}`}>
            <img src="/images/usuarios/estrella.webp" alt="Logo estrella" />
            <p>{Valoracion}</p>
          </div>
          <div className={styles.anf_likes}>
            {/* Mapeamos las imágenes de gustos */}
            {Gustos_imgs.map((gusto, index) => (
              <img
                key={index}
                src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
                alt={`Logo gusto ${index + 1}`}
                width={100}
                onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
              />
            ))}
          </div>
        </div>

        {/* Dirección */}
        <address className={styles.address}>
          <img src="/images/usuarios/ubicacion.svg" alt="Logo ubicación" width={50} />
          <span>{`${Ubicacion} (${Precio}\u20ac  / noche)`}</span>
        </address>

        {/* Descripción */}
        <p className={styles.description}>{Descripcion}</p>

        {/* Parte inferior (Conectar) */}
        <Link to="/viajeros/perfil-anfitrion" state={{ id: anf_id }} className={styles.anf_link} style={{ pointerEvents: !enlace ? 'none' : 'auto' }}>
        <button className={styles.btn_conectar}>Conectar</button>
        </Link>
      </div>
    </article>
  );

}