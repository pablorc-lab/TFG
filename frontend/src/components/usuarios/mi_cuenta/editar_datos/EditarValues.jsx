import { lazy, Suspense, useEffect, useRef, useState } from "react";
import styles from "./Editar.module.css"
const FilteredList = lazy(() => import("../../../utilities/filteresCities/FilteredList"));

// Menu que aparece al editar "Mi Cuenta"
export const EditarMiCuenta = ({ addImageState, setAddImageState}) => {

	const [showDeleteImage, setShowDeleteImage] = useState(null);
	const gustosImages = [
		"baseball", "costura", "natacion", "pesca", 
		"poker", "social", "correr", "futbol", 
		"animales", "videojuegos", "comer", "cafe",
		"lectura", "peliculas", "musica", "ajedrez",
		"pintura", "cocina", "plantas", "camping",
		"ciclismo", "fotografia", "viajar", "gym"
	];

	const [gustos_actuales, SetGustos_actuales] = useState(["baseball", "natacion", "pesca"]);

	return (
		<>
			<h2>EDITAR CUENTA</h2>

			<section className={styles.modal_sections}>
				<h3>INFORMACIÓN</h3>
				<form className={`${styles.input_container} ${styles.input_MiCuenta}`}>
					<div className={styles.input_div}>
						<p>Nombre</p>
						<input type="text" placeholder="Pablo" spellCheck="false" name="nombre" />
					</div>
					<div className={styles.input_div}>
						<p>Apellido</p>
						<input type="text" placeholder="Ramblado" spellCheck="false" name="Apellido" />
					</div>
					<div className={styles.input_div}>
						<p>ID privado</p>
						<input type="text" placeholder="PabloID123" spellCheck="false" name="ID privado" />
					</div>
					<div className={styles.input_div}>
						<p>Fecha de nacimiento</p>
						<input type="date" placeholder="Ramblado" spellCheck="false" name="Edad" />
					</div>
				</form>
			</section>

			<section className={styles.modal_sections}>
				<h3>CONTACTO</h3>
				<form className={`${styles.input_container} ${styles.input_MiCuenta_contacto}`} >
					<div className={styles.input_div}>
						<p>Email</p>
						<input type="email" placeholder="Pablo@example.com" spellCheck="false" name="Email" autoComplete="email" />
					</div>
					<div className={styles.input_div}>
						<p>Teléfono</p>
						<input type="number" placeholder="666-777-999" spellCheck="false" name="Teléfono" />
					</div>
				</form>
			</section>

			<section className={styles.modal_sections}>
				<h3>INTERESES</h3>

				<form className={`${styles.input_container} ${styles.input_MiCuenta_contacto}`} >
					<div className={styles.input_div}>
						<p>Breve descripción 0 / 100</p>
						<textarea
							placeholder="Me gusta los paisajes al aire libre"
							spellCheck="false"
							name="biografia"
							rows="4"
						></textarea>
					</div>

					<div className={styles.input_div}>
						<p>Gustos ({gustos_actuales.length} / 3)</p>
						<article className={`${styles.input_container} ${styles.input_MiCuenta_gustos}`}>
							{gustosImages.map((img, index) => (
								<div 
									key={index} 
									className={`${gustos_actuales.includes(img) ? styles.gusto_active : undefined}`} 
									onMouseEnter={() => setShowDeleteImage(index)} 
									onMouseLeave={() => setShowDeleteImage(null)}
									onClick={() => gustos_actuales.length+1 <= 3 && SetGustos_actuales(prev => [...prev, img])}
								>
									<img src={`/images/usuarios/Gustos/${img}.svg`} alt={`Gusto ${index}`} className={styles.gusto_image}/>
									{showDeleteImage === index && gustos_actuales.includes(img) &&
										<img
											src="/images/usuarios/account/delete_img.svg"
											alt="Eliminar"
											className={styles.delete_icon}
											onClick={() => SetGustos_actuales(gustos_actuales.filter(prev => prev !== img))}
										/>}
								</div>
							))}
						</article>
					</div>
				</form>
			</section>
		</>
	)
};

// Menu que aparece al editar "Vivienda "
export const EditarVivienda = ({ addImageState, setAddImageState }) => {
	const filteredListRef = useRef(null);
	const inputRef = useRef(null);

	const [editarStates, setEditarStates] = useState({
		locationFocus: false,
		location: ""
	})
	// Actualizar objeto de estado
	const updateEditarStates = (newState) => setEditarStates(prev => ({ ...prev, ...newState }));

	useEffect(() => {
		import("../../../utilities/filteresCities/FilteredList"); // Importar al cargar el componeten

		// Controlar click fuera del input para cerrar el menú de listas filtradas
		const handleClickOutside = (event) => {
			if ((!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))) {
				updateEditarStates({ locationFocus: false });
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const [viviendasImages, setViviendasImages] = useState([]);

	return (
		<>
			<h2>EDITAR VIVIENDA</h2>

			<section className={styles.modal_sections}>
				<h3>IMÁGENES <span>(máximo 4)</span></h3>
				<article className={styles.modal_images}>
					{viviendasImages.map((img, index) => (
						<div key={index} className={styles.house_images}>
							<img src={img instanceof File ? URL.createObjectURL(img) : img} alt={`Imagen ${index}`} />
							<img
								src={"/images/usuarios/account/delete_img.svg"}
								alt="delete img"
								onClick={() => setViviendasImages(viviendasImages.filter((_, i) => i !== index))}
							/>
						</div>
					))}

					{/* Mostrar el label solo si hay menos de 4 imágenes */}
					{viviendasImages.length < 4 && (
						<div className={styles.file_input_wrapper}>
							<label className={styles.file_input_label} onMouseEnter={() => setAddImageState(true)} onMouseLeave={() => setAddImageState(false)} >
								<input
									type="file" 
									accept="image/*" 
									className={styles.file_input} 
									name="archivo" 
									onChange={(e) => setViviendasImages(prev => [...prev, e.target.files[0]])}
								/>
								<img src="/images/usuarios/account/add_img.svg" alt="Editar vivienda" />
							</label>
							{addImageState && <p className={styles.add_image_tooltip}>Añadir imagen</p>}
						</div>
					)}
				</article>
			</section>

			<section className={styles.modal_sections}>
				<h3>DETALLES</h3>
				<form className={`${styles.input_container} ${styles.input_detalles}`}>
					<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
						<p>Viajeros</p>
						<input type="number" placeholder="1 - 4" min="1" max="4" name="habitaciones" />
					</div>
					<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
						<p>Habitaciones</p>
						<input type="number" placeholder="1 - 4" min="1" max="4" name="baños" />
					</div>
					<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
						<p>Camas</p>
						<input type="number" placeholder="1 - 4" min="1" max="4" name="habitaciones" />
					</div>
					<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
						<p>Baños</p>
						<input type="number" placeholder="1 - 4" min="1" max="4" name="baños" />
					</div>
				</form>
			</section>

			<section className={styles.modal_sections}>
				<h3>UBICACIÓN</h3>
				<form className={`${styles.input_container} ${styles.input_ubicacion}`}>
					<div className={`${styles.input_div} ${styles.input_text}`}>
						<p>Ciudad</p>
						<input
							ref={inputRef}
							type="text"
							name="ubicacion"
							placeholder="Granada,Motril"
							spellCheck="false"
							value={editarStates.location}
							onChange={(e) => updateEditarStates({ location: e.currentTarget.value })}
							onFocus={() => updateEditarStates({ locationFocus: true })}
						/>
						{editarStates.locationFocus && editarStates.location &&
							<Suspense fallback={null}>
								<FilteredList filteredListRef={filteredListRef} listStates={editarStates} updateListStates={updateEditarStates} menuEdit={true} />
							</Suspense>
						}
					</div>
					<div className={styles.input_div}>
						<p>Precio (&euro; / noche)</p>
						<input type="number" placeholder="45" name="precio" />
						<span> </span>
					</div>
				</form>
			</section>
		</>
	)
};

// Menu que aparece al editar "Biografia "
export const EditarBiografia = ({ esViajero = false }) => {

	const [UserIdiomas, setUserIdiomas] = useState(["Español", "Italiano", "Francés"]);

	const inputIdiomas = ["Español", "Inglés", "Francés", "Alemán", "Italiano"];

	const handleChangeIdioma = (idiomaValue) => {
		UserIdiomas.includes(idiomaValue)
			? setUserIdiomas(UserIdiomas.filter(value => value !== idiomaValue))
			: setUserIdiomas([...UserIdiomas, idiomaValue]);
	}

	return (
		<>
			<h2>EDITAR BIOGRAFÍA</h2>

			<section className={styles.modal_sections}>
				<h3>SOBRE MI</h3>

				<form className={styles.input_container} >
					<div className={styles.input_div}>
						<p>Descripción personal 0 / 500</p>
						<textarea
							placeholder="Soy una persona muy activa y sociable, me gusta los lugares aislados"
							spellCheck="false"
							name="biografia"
							rows="4"
						></textarea>
					</div>
				</form>
			</section>

			<section className={styles.modal_sections}>
				<h3>IDIOMAS QUE HABLO</h3>

				<form className={styles.input_container}>
					<div className={`${styles.input_div} ${styles.input_idioma}`}>
						{inputIdiomas.map((idioma, index) => (
							<button
								key={index}
								type="button"
								className={`${styles.idioma_opcion} ${UserIdiomas.includes(idioma) ? styles.idioma_active : undefined}`}
								onClick={() => handleChangeIdioma(idioma)}
							>{idioma}</button>
						))}
					</div>
				</form>

			</section>

			<section className={styles.modal_sections}>
				<h3>SOBRE {esViajero ? "MIS VIAJES" : "EL ALOJAMIENTO"}</h3>

				<form className={styles.input_container} >
					<div className={styles.input_div}>
						<p>Descripción  {esViajero ? "de tus viajes" : "del alojamiento"} 0 / 500</p>
						<textarea
							placeholder={esViajero ? "En mis anteriores viajes me hospedé en ciudades grandes" : "Te hospedarás en una acogedora vivienda compartida"}
							spellCheck="false"
							name="biografia"
							rows="4"
						></textarea>
					</div>
				</form>
			</section>
		</>

	)
};

// Menu que aparece al editar "Recomendaciones "
export const EditarRecomendaciones = ({esViajero }) => {
	return (
		<>
			<h2> AÑADIR {esViajero ? "EXPERIENCIA" : "RECOMENDACION"}</h2>

			<section className={styles.modal_sections}>
				<h3>{esViajero ? "EXPERIENCIA" : "RECOMENDACIÓN"}</h3>
				<form className={`${styles.input_container} ${styles.input_recomendacion}`}>
					<div className={`${styles.input_div} ${styles.input_recomendacion_title}`}>
						<p>Titulo</p>
						<input type="text" placeholder="Restaurante favorito" spellCheck="false" name="Titulo recomendaciones" />
					</div>

					<div className={styles.input_div}>
						<p>Descripción  0 / 500</p>
						<textarea
							placeholder="Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’"
							spellCheck="false"
							name="biografia"
							rows="4"
						></textarea>
					</div>
				</form>
			</section>

			<section className={styles.modal_sections}>
				<h3>DETALLES (opcionales)</h3>
				<form className={`${styles.input_container} ${styles.input_details}`} >
					{!esViajero && <div className={styles.input_div}>
						<p>Ubicación</p>
						<article className={styles.input_article}>
							<img src="/images/profiles/recomendaciones/location.svg" alt="Ubicación" className={styles.input_image} />
							<input type="text" placeholder="Dirección del lugar" spellCheck="false" name="Ubicación" />
						</article>
					</div>}

					<div className={styles.input_div}>
						<p>Recomendación</p>
						<article className={styles.input_article}>
							<img src="/images/profiles/recomendaciones/backpack.svg" alt="Recomendación" className={styles.input_image} />
							<input type="text" placeholder="Consejos para visitar" spellCheck="false" name="Recomendación" />
						</article>
					</div>

					{!esViajero &&<div className={styles.input_div}>
						<p>Teléfono</p>
						<article className={styles.input_article}>
							<img src="/images/profiles/recomendaciones/phone.svg" alt="Teléfono" className={styles.input_image} />
							<input type="number" placeholder="666-777-999" spellCheck="false" name="Teléfono" />
						</article>
					</div>}

					{!esViajero &&<div className={styles.input_div}>
						<p>Horarios</p>
						<article className={styles.input_article}>
							<img src="/images/profiles/recomendaciones/clock.svg" alt="Horarios" className={styles.input_image} />
							<input type="text" placeholder="Horario de apertura y cierre" spellCheck="false" name="Horarios" />
						</article>
					</div>}

					{!esViajero && <div className={styles.input_div}>
						<p>Ayuda</p>
						<article className={styles.input_article}>
							<img src="/images/profiles/recomendaciones/help.svg" alt="Comentarios" className={styles.input_image} />
							<input type="text" placeholder="Comentarios adicionales" spellCheck="false" name="Comentarios" />
						</article>
					</div>}
				</form>
			</section>
		</>
	)
};