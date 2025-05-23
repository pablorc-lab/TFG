import styles from "./Perfil.module.css";

// Contenido de "Mi cuenta"
export const ContenidoMiCuenta = ({ usuarioData = [], esViajero = false }) => {
	return (
		<section className={styles.miCuenta_section}>
			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/informacion_perfil.svg" alt="Info vivienda" />
					<p>INFORMACIÓN</p>
				</div>
				<ul className={styles.miCuenta_info} >
					<li>
						<h2>Nombre</h2>
						<p>{usuarioData.nombre}</p>
					</li>
					<li>
						<h2>Apellido</h2>
						<p>{usuarioData.apellido}</p>
					</li>
					<li>
						<h2>ID privado</h2>
						<p>{usuarioData.privateID}</p>
					</li>
					<li>
						<h2>Fecha de nacimiento</h2>
						<p>{usuarioData.fecha_nacimiento}</p>
					</li>
					{esViajero &&
						<li>
							<h2>Tiempo de estancia</h2>
							<p>{usuarioData?.tiempo_estancia || "Indefinido"}</p>
						</li>
					}
				</ul>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/contacto.svg" alt="Localización vivienda" />
					<p>CONTACTO</p>
				</div>
				<ul className={`${styles.miCuenta_info} ${styles.miCuenta_contacto}`}>
					<li>
						<h2>Email</h2>
						<p>{usuarioData.email}</p>
					</li>
					<li>
						<h2>Teléfono</h2>
						<p>{usuarioData.telefono}</p>
					</li>
				</ul>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/gustos.svg" alt="Localización vivienda" />
					<p>INTERESES</p>
				</div>
				<ul className={`${styles.miCuenta_info} ${styles.miCuenta_biografia}`}>
					<li>
						<h2>Breve descripción</h2>
						<p>{usuarioData?.descripcion || "Aun no has añadido una descripción"}</p>
					</li>
					<li>
						<h2>Gustos :</h2>
						<div className={`${styles.miCuenta_info} ${styles.miCuenta_gustos}`}>
							{[usuarioData?.gusto1, usuarioData?.gusto2, usuarioData?.gusto3].map((gusto, index) => (
								<img
									key={index}
									src={`/images/usuarios/Gustos/${String(gusto).toLowerCase()}.svg`}
									alt={`Logo gusto ${index + 1}`} width={100}
									onError={(e) => e.target.src = "/images/usuarios/Gustos/default.svg"}
								/>
							))}
						</div>
					</li>
				</ul>
			</article>
		</section>
	)
};


// Contenido de "Vivienda"
export const ContenidoVivienda = ({ viviendaData = [] }) => {
	const vivienda_imgs = [
		viviendaData?.imagen1 || null,
		viviendaData?.imagen2 || null,
		viviendaData?.imagen3 || null,
		viviendaData?.imagen4 || null
	].filter(img => img != null && img !== "");

	return (
		<section className={styles.miCuenta_section}>
			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/vivienda_img.svg" alt="Imagen vivienda" />
					<p>IMÁGENES - {vivienda_imgs.length}</p>
				</div>
				<div className={styles.vivienda_images}>
					{vivienda_imgs.length > 0 && vivienda_imgs.map((path_img, index) => (
						<img key={index} src={path_img} alt={`Imagen ${index}`} />
					))}
				</div>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/vivienda_info.svg" alt="Info vivienda" />
					<p>DETALLES</p>
				</div>
				<ul className={styles.miCuenta_info}>
					<li>
						<h2>Viajeros</h2>
						<p>{viviendaData?.viajeros || 0}</p>
					</li>
					<li>
						<h2>Habitaciones</h2>
						<p>{viviendaData?.habitaciones || 0}</p>
					</li>
					<li>
						<h2>Camas</h2>
						<p>{viviendaData?.camas || 0}</p>
					</li>
					<li>
						<h2>Baños</h2>
						<p>{viviendaData?.banios || 0}</p>
					</li>
				</ul>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/vivienda_location.svg" alt="Localización vivienda" />
					<p>UBICACIÓN</p>
				</div>
				<ul className={styles.miCuenta_info}>
					<li>
						<h2>Provincia</h2>
						<p>{viviendaData?.provincia || "Sin ciudad"}</p>
					</li>
					<li>
						<h2>Ciudad</h2>
						<p>{viviendaData?.ciudad || "Sin provincia"}</p>
					</li>
					<li>
						<h2>Precio &euro; / noche</h2>
						<p>{viviendaData?.precio_noche || 0}</p>
					</li>
				</ul>
			</article>
		</section>
	)
};

// Contenido de "Galeria"
export const ContenidoGaleria = ({ galeriaData = [] }) => {
	const galeria_imgs = [
		galeriaData.imagen1,
		galeriaData.imagen2,
		galeriaData.imagen3,
		galeriaData.imagen4
	].filter(img => img != null && img !== "");

	console.log(galeria_imgs);

	return (
		<section className={styles.miCuenta_section}>
			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/vivienda_img.svg" alt="Imagen vivienda" />
					<p>IMÁGENES - {galeria_imgs.length}</p>
				</div>
				<div className={styles.vivienda_images}>
					{galeria_imgs.map((path_img, index) => (
						<img key={index} src={path_img} alt={`Imagen ${index}`} />
					))}
				</div>
			</article>

		</section>
	)
};
// Contenido "Biografia"
export const ContenidoBiografia = ({ esViajero, biografiaData = [] }) => {

	return (
		<section className={styles.miCuenta_section}>
			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/sobre_mi.svg" alt="Info vivienda" />
					<p>SOBRE MI</p>
				</div>
				<p className={styles.miCuenta_text_info}>{biografiaData?.sobreMi || "No se ha proporcionado descripción personal alguna"}</p>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/idiomas.svg" alt="Localización vivienda" />
					<p>IDIOMAS</p>
				</div>
				<ul>
					{biografiaData.idiomas != null ? (
						String(biografiaData.idiomas).split(",").map((idioma, index) => (
							<li key={index} className={styles.miCuenta_text_info}>{idioma.trim()}</li>
						))
					) : (
						<li className={styles.miCuenta_text_info}>Sin idiomas</li>
					)}
				</ul>
			</article>

			<article>
				<div className={styles.miCuenta_data}>
					<img src="/images/usuarios/account/sobre_necesidad.svg" alt="Localización vivienda" />
					<p>SOBRE  {esViajero ? "MIS VIAJES" : "EL ALOJAMIENTO"}</p>
				</div>
				<p className={styles.miCuenta_text_info}>{biografiaData?.descripcionExtra || "No se ha proporcinonado información sobre tus viajes"}</p>
			</article>
		</section>
	)
}