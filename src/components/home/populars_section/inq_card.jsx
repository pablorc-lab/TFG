export default function Inq_card({ Perfil_img, Nombre="-", Valoracion="/", Num_viajes="/", Edad="/",  Profesion="-", Descripcion="-",Gustos_imgs, prof_number}) {

  return (
    <div className={`general_prof viaj_prof ${prof_number}`}>
      <div className="personal_info">
        <img className="profile_img viaj_img" src={Perfil_img} alt="Imagen viajero" width={250} />
        <div className="text_column_viaj">
          <h3>{Nombre}</h3>
          <div className="score score_viajero">
            <p>{Valoracion}</p>
            <img src="/images/usuarios/estrella.png" alt="Logo estrella" />
          </div>
          <p>{Num_viajes} viajes</p>
        </div>
      </div>

      {/*?Edad y descripcion*/}
      <div>
        <p className="age">{Edad} años, {Profesion}</p>
        <p className="description">{Descripcion}</p>
      </div>

      {/*?Gustos*/}
      <div className="viaj_likes">
        {Gustos_imgs.map((gusto, index) => (
          <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
        ))}
      </div>

      {/*?Conectar*/}
      <button className="btn_conectar">Conectar</button>
    </div>
  );
}
