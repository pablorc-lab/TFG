import Anf_card from "./anf_card";
import Inq_card from "./inq_card";
 
export default function Populars() {
  return (
    <>
      <div id="popular_titles">
        <h2>Anfitriones populares</h2>
        <h2>Viajeros destacados</h2>
        <h2 id="movil_title">Anfitriones y Viajeros destacados</h2>
      </div>

      <section className="popular_section">
        {/*?Perfil Anfitrion 1*/}
        <Anf_card
          Casa_img="/images/landing_page/casa_1.webp"
          Perfil_img="/images/landing_page/persona_1.webp"
          Nombre="Pablo"
          Gustos_imgs={[
            "/images/usuarios/Gustos/baseball.png",
            "/images/usuarios/Gustos/pesca.png",
            "/images/usuarios/Gustos/poker.png",
          ]}
          Valoracion={4.91}
          Ubicacion="Barcelona"
          Precio="300"
          Descripcion="Amante de la aventura y los viajes improvisados"
          prof_number="prof_1"
        />
        
        {/*?Perfil Viajero 1*/}
        <Inq_card
					Perfil_img="images/landing_page/persona_3.webp"
					Nombre="Juanma"
					Valoracion="4.51"
					Num_viajes="82"
					Edad="56"
					Profesion="Mécanico"
					Descripcion="Soy un hombre apasionado por conocer nuevas personas y sitios desconocidos"
					Gustos_imgs={[
            "/images/usuarios/Gustos/pesca.png",
            "/images/usuarios/Gustos/social.png",
            "/images/usuarios/Gustos/baseball.png",
          ]}
					prof_number="prof_3"
				/>

        {/*?Perfil Anfitrion 2*/}
        <Anf_card
          Casa_img="/images/landing_page/casa_2.webp"
          Perfil_img="/images/landing_page/persona_2.webp"
          Nombre="Pablo"
          Gustos_imgs={[
            "/images/usuarios/Gustos/pesca.png",
            "/images/usuarios/Gustos/poker.png",
            "/images/usuarios/Gustos/baseball.png",
          ]}
          Valoracion={4.87}
          Ubicacion="Sevilla"
          Precio="170"
          Descripcion="Me gusta conocer personas nuevas y sitios pintorescos, me gusta la naturaleza"
          prof_number="prof_2"
        />

				{/*?Perfil Viajero 2*/}
				<Inq_card
					Perfil_img="/images/landing_page/persona_4.webp"
					Nombre="Alejandra"
					Valoracion="4.81"
					Num_viajes="21"
					Edad="41"
					Profesion="Bióloga"
					Descripcion="Me gusta sitios tranquilos rodeados de naturaleza, y si es acompañado de alguien que conozca la zona mejor."
					Gustos_imgs={[
						"/images/usuarios/Gustos/baseball.png",
						"/images/usuarios/Gustos/poker.png",
						"/images/usuarios/Gustos/social.png"
					]}
					prof_number="prof_4"
				/>
      </section>
    </>
    
  );
}