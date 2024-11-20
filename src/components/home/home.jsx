import Logo_verde from "../../assets/images/logos/logo_verde.png"
import Icono_menu from '../../assets/images/landing_page/menu.png';
import Icono_user_blanco from "../../assets/images/usuarios/logo_usuario_blanco.png"
import Icono_anfitrion from "../../assets/images/landing_page/anfitrion.png"
import Icono_inquilino from "../../assets/images/landing_page/inquilino.png"

import "./home.css"

export default function Home_page() {

	return (
		<>
      {/*Cabecera*/}
			<header>
				<figure class="header_logo">
					<img src={Logo_verde} alt="Logo Bearfrens" width="150" />
					<figcaption>Bearfrens</figcaption>
				</figure>
				<div class="header_menu">
					<div id="menu_icon" >
						<img src={Icono_menu} alt="Icono de menú" />
					</div>

					<nav id="header_nav">
						<a>Inicio</a>
						<a>Alojamientos</a>
						<a>Inquilinos</a>
						<a>Soporte</a>
					</nav>

					<div class="header_user">
						<img src={Icono_user_blanco} alt="Logo usuario" width="50" />
						<a href="#" class="client_access">Acceder</a>
					</div>
				</div>
			</header>

			<main>
        {/*?LOGO INICIAL*/}
        <div className="main_container">
          <div id="logo_main">
            <img src={Logo_verde} alt="Logo Bearfrens" width={150} />
          </div>

          {/*?BOTON INQUILINOS Y VIAJEROS*/}
          <section className="button_section">
            <div className="button_container">
              <h2>Encuentra el alojamiento perfecto</h2>
              <div id="btn_alojamientos">
                <img src={Icono_anfitrion} alt="Icono casa" />
                <p>Hospedajes</p>
              </div>
            </div>
            <div className="button_container">
              <h2>Conecta con todo tipo de personas</h2>
              <div id="btn_inquilinos">
                <img src={Icono_inquilino} alt="Icono inquilino" />
                <p>Inquilinos</p>
              </div>
            </div>
          </section>	
        </div>

			</main>

      {/*Pie de pagina*/}
			<footer>
				{/*Logo*/}
				<figure id="logo_footer">
					<img src={Logo_verde} alt="Logo Bearfrens" width={150} />
					<figcaption>Bearfrens</figcaption>
				</figure>
				{/*Información de contacto*/}
				<div className="contact-info">
					<div id="text-info">
						<p>Email: <strong>pabloramblado@correo.ugr.es</strong></p>
						<p>Teléfono: <strong>+34 666-666-666</strong></p>
					</div>
					<div className="social-media">
						<img src="../src/assets/images/logos/instagram_logo.png" alt="instagram_logo" width={50} />
						<img src="../src/assets/images/logos/x_logo.png" alt="x_logo" width={50} />
						<img src="../src/assets/images/logos/youtube_logo.png" alt="youtube_logo" width={50} />
						<img src="../src/assets/images/logos/facebook_logo.png" alt="facebook_logo" width={50} />
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