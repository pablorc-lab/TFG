export default function Anf_card({ Casa_img, Perfil_img, Nombre="-", Gustos_imgs, Valoracion="/", Ubicacion="-", Precio="-", Descripcion="-", prof_number}) {
  
  return (
    <div className={`general_prof ${prof_number}`}>
      {/* Imagen de la casa */}
      <img className="house" src={Casa_img} alt="Imagen casa" width={500} />

      <div className="anf_info">
        {/* Perfil y Nombre */}
        <div className="personal_info anf_personal_info">
          <img className="profile_img" src={Perfil_img} alt={`Imagen de ${Nombre}`} width={250} />
          <div className="anf_name">
            <h3>{Nombre}</h3>
          </div>
        </div>

        {/* Gustos */}
        <div className="anf_rating">
          <div className="score anf_score">
            <p>{Valoracion}</p>
            <img src="/images/usuarios/estrella.png" alt="Logo estrella" />
          </div>
          <div className="anf_likes">
            {Gustos_imgs.map((gusto, index) => (
              <img key={index} src={gusto} alt={`Logo gusto ${index + 1}`} width={100} />
            ))}
          </div>
        </div>

        {/* Dirección */}
        <address className="address">
          <img src="/images/usuarios/ubicacion.png" alt="Logo ubicación" width={50} />
          <span>{`${Ubicacion} (${Precio}\u20ac  / noche)`}</span>
        </address>

        {/* Descripción */}
        <p className="description">{Descripcion}</p>

        {/* Parte inferior (Conectar) */}
        <button className="btn_conectar">Conectar</button>
      </div>
    </div>
  );

}