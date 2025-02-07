export default function Inq_card({ styles, Perfil_img, Nombre="-", Valoracion="/", Num_viajes="/", Edad="/",  Profesion="-", Descripcion="-",Gustos_imgs}) {

  return (
    <div className={`${styles.general_prof} ${styles.viaj_prof}`}>
      <div className={styles.personal_info}>
        <img className={`${styles.profile_img} ${styles.viaj_img}`} src={Perfil_img} alt="Imagen viajero" width={250} />
        <div className={styles.text_column_viaj}>
          <h3>{Nombre}</h3>
          <p>{Num_viajes} viajes</p>
          <div className={`${styles.score} ${styles.score_viajero}`}>
            <p>{Valoracion}</p>
            <img src="/images/usuarios/estrella.webp" alt="Logo estrella" />
          </div>
        </div>
      </div>

      {/*?Edad y descripcion*/}
      <div>
        <p className={styles.age}>{Edad} años, {Profesion}</p>
        <p className={styles.description}>{Descripcion}</p>
      </div>

      {/*?Gustos*/}
      <div className={styles.viaj_likes}>
        {Gustos_imgs.map((gusto, index) => (
          <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
        ))}
      </div>

      {/*?Conectar*/}
      <button className={styles.btn_conectar}>Conectar</button>
    </div>
  );
}
