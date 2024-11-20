import Anf_card from "./anf_card";

// Importar imagenes ESTÁTICAS de los ANFITRIONES
 
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
          Casa_img="/images/landing_page/casa_1.png"
          Perfil_img="/images/landing_page/persona_1.png"
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

        {/*?Perfil Anfitrion 2*/}
        <Anf_card
          Casa_img="/images/landing_page/casa_2.png"
          Perfil_img="/images/landing_page/persona_2.png"
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

      </section>
    </>
    
  );
}