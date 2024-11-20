import Populars from "./populars";
import "./home.css"

export default function Home_page() {

	return (
		<>
      {/*Cabecera*/}
			<header>
				<figure className="header_logo">
					<img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width="150" />
					<figcaption>Bearfrens</figcaption>
				</figure>
				<div className="header_menu">
					<div id="menu_icon" >
						<img src="images/logos/menu.png" alt="Icono de menú" />
					</div>

					<nav id="header_nav">
						<a>Inicio</a>
						<a>Alojamientos</a>
						<a>Inquilinos</a>
						<a>Soporte</a>
					</nav>

					<div className="header_user">
						<img src="images/logos/logo_usuario_blanco.png" alt="Logo usuario" width="50" />
						<a href="#" className="client_access">Acceder</a>
					</div>
				</div>
			</header>

			<main>
        {/*?LOGO INICIAL*/}
        <div className="main_container">
          <div id="logo_main">
            <img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width={150} />
          </div>

          {/*?BOTON INQUILINOS Y VIAJEROS*/}
          <section className="button_section">
            <div className="button_container">
              <h2>Encuentra el alojamiento perfecto</h2>
              <div id="btn_alojamientos">
                <img src="images/logos/anfitrion.png" alt="Icono casa" />
                <p>Hospedajes</p>
              </div>
            </div>
            <div className="button_container">
              <h2>Conecta con todo tipo de personas</h2>
              <div id="btn_inquilinos">
                <img src="images/logos/inquilino.png" alt="Icono inquilino" />
                <p>Inquilinos</p>
              </div>
            </div>
          </section>	
        </div>

        {/*?SECCION DE LOS POPULARES*/}
        <Populars/>
			</main>

      {/*Pie de pagina*/}
			<footer>
				{/*Logo*/}
				<figure id="logo_footer">
					<img src="images/logos/logo_verde.png" alt="Logo Bearfrens" width={150} />
					<figcaption>Bearfrens</figcaption>
				</figure>
				{/*Información de contacto*/}
				<div className="contact-info">
					<div id="text-info">
						<p>Email: <strong>pabloramblado@correo.ugr.es</strong></p>
						<p>Teléfono: <strong>+34 666-666-666</strong></p>
					</div>
					<div className="social-media">
						<img src="./images/logos/instagram_logo.png" alt="instagram_logo" width={50} />
						<img src="./images/logos/x_logo.png" alt="x_logo" width={50} />
						<img src="./images/logos/youtube_logo.png" alt="youtube_logo" width={50} />
						<img src="./images/logos/facebook_logo.png" alt="facebook_logo" width={50} />
					</div>
				</div>
				{/*Políticias de privacidad*/}
				<div className="privacy-policy">
					<a href="/politicas-de-privacidad">Políticas de Privacidad</a>
				</div>
			</footer>
		</>
	);
}