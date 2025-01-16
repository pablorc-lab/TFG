export default function Anf_card({styles, Casa_img, Perfil_img, Nombre="-", Gustos_imgs, Valoracion="/", Ubicacion="-", Precio="-", Descripcion="-",}) {
  
  return (
    <div className={styles.general_prof}>
      {/* Imagen de la casa */}
      <img className={styles.house} src={Casa_img} alt="Imagen casa" width={500} />

      <div className={styles.anf_info}>
        {/* Perfil y Nombre */}
        <div className={`${styles.personal_info} ${styles.anf_personal_info}`}>
          <img className={styles.profile_img} src={Perfil_img} alt={`Imagen de ${Nombre}`} width={250} />
          <div className={styles.anf_name}>
            <h3>{Nombre}</h3>
          </div>
        </div>

        {/* Gustos */}
        <div className={styles.anf_rating}>
          <div className={`${styles.score} ${styles.anf_score}`}>
            <p>{Valoracion}</p>
            <img src="/images/usuarios/estrella_verde.webp" alt="Logo estrella" />
          </div>
          <div className={styles.anf_likes}>
            {Gustos_imgs.map((gusto, index) => (
              <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
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
        <button className={styles.btn_conectar}>Conectar</button>
      </div>
    </div>
  );

}