import { lazy, Suspense, useEffect, useRef, useState } from "react";
import styles from "./Editar.module.css"
const FilteredList = lazy(() => import("../../../utilities/filteresCities/FilteredList"));

// Menu que aparece al editar "Mi Cuenta"
export const EditarMiCuenta = ({ esViajero = false, usuarioData = [], userData, setUserData }) => {

	const [gustos_actuales, SetGustos_actuales] = useState([usuarioData.gusto1, usuarioData.gusto2, usuarioData.gusto3]);
	const [tiempoActive, setTiempoActive] = useState(usuarioData.tiempo_estancia);

	const [mouseEnter, SetMouseEnter] = useState(null);
	const [showDeleteImage, setShowDeleteImage] = useState(null);
	const gustosImages = [
		"baseball", "costura", "natacion", "pesca",
		"poker", "social", "correr", "futbol",
		"animales", "videojuegos", "comer", "cafe",
		"lectura", "peliculas", "musica", "ajedrez",
		"pintura", "cocina", "plantas", "camping",
		"ciclismo", "fotografia", "viajar", "gimnasio"
	];

	useEffect(() => {
		if (usuarioData) {
			setUserData({
				nombre: usuarioData.nombre || '',
				apellido: usuarioData.apellido || '',
				privateID: usuarioData.privateID || '',
				fecha_nacimiento: usuarioData.fecha_nacimiento || '',
				email: usuarioData.email || '',
				telefono: usuarioData.telefono || '',
				tiempo_estancia: tiempoActive,
				descripcion: usuarioData.descripcion || '',
				gusto1: gustos_actuales[0] || '',
				gusto2: gustos_actuales[1] || '',
				gusto3: gustos_actuales[2] || ''
			});
		}
	}, [usuarioData, gustos_actuales, tiempoActive]);

	return (
		<>

			<h2>EDITAR CUENTA</h2>

			<main className={styles.main}>
				<section className={styles.modal_sections}>
					<h3>INFORMACIÓN</h3>
					<form className={`${styles.input_container} ${styles.input_MiCuenta}`}>
						<div className={styles.input_div}>
							<p>Nombre</p>
							<input
								value={userData?.nombre || ''} onChange={(e) => (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]*$/).test(e.target.value) && setUserData(prev => ({ ...prev, nombre: e.target.value }))}
								type="text"
								placeholder="Pablo"
								spellCheck="false"
								name="nombre"
							/>
						</div>
						<div className={styles.input_div}>
							<p>Apellido</p>
							<input
								value={userData?.apellido || ''}
								onChange={(e) => (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]*$/).test(e.target.value) && setUserData(prev => ({ ...prev, apellido: e.target.value }))}
								type="text"
								placeholder="Ramblado"
								spellCheck="false"
								name="Apellido"
							/>
						</div>
						<div className={styles.input_div}>
							<p>ID privado</p>

							<input
								value={userData?.privateID || ''}
								onChange={(e) => setUserData(prev => ({ ...prev, privateID: e.target.value }))}
								type="text"
								placeholder="PabloID123"
								spellCheck="false"
								name="ID privado"
							/>
						</div>
						<div className={styles.input_div}>
							<p>Fecha de nacimiento</p>
							<input
								value={userData?.fecha_nacimiento || ''}
								onChange={(e) => setUserData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
								type="date"
								max={new Date().toISOString().split("T")[0]}
								spellCheck="false"
								name="Edad"
							/>
						</div>
					</form>
				</section>

				{esViajero &&
					<section className={styles.modal_sections}>
						<h3>TIEMPO DE ESTANCIA</h3>
						<form className={styles.input_container}>
							<div className={`${styles.input_div} ${styles.input_idioma} ${styles.input_tiempo}`}>
								{["< 1 mes", "1 - 3 meses", "3 - 6 meses", "6 - 12 meses", "> 1 año"].map((tiempo, index) => (
									<button
										key={index}
										type="button"
										className={`${styles.idioma_opcion} ${styles.tiempo_opcion} ${tiempo === userData?.tiempo_estancia ? styles.idioma_active : ""}`}
										onClick={() => setTiempoActive(tiempo)}
									>{tiempo}</button>
								))}
							</div>
						</form>
					</section>
				}

				<section className={styles.modal_sections}>
					<h3>CONTACTO</h3>
					<form className={`${styles.input_container} ${styles.input_MiCuenta_contacto}`} >
						<div className={styles.input_div}>
							<p>Email</p>
							<input
								value={userData?.email || ''}
								onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
								type="email"
								placeholder="Pablo@example.com"
								spellCheck="false"
								name="Email"
								autoComplete="email"
							/>
						</div>
						<div className={styles.input_div}>
							<p>Teléfono</p>
							<input
								value={userData?.telefono || ''}
								onChange={(e) => (/^\d{0,9}$/).test(e.target.value) && setUserData(prev => ({ ...prev, telefono: e.target.value }))}
								type="number"
								placeholder="666777999"
								spellCheck="false"
								name="Teléfono"
							/>
						</div>
					</form>
				</section>

				<section className={styles.modal_sections}>
					<h3>INTERESES</h3>

					<form className={`${styles.input_container} ${styles.input_MiCuenta_intereses}`} >
						<div className={styles.input_div}>
							<p>Breve descripción {userData?.descripcion?.length || 0} / 120</p>
							<textarea
								value={userData?.descripcion || ''}
								onChange={(e) => e.target.value.length <= 120 && setUserData(prev => ({ ...prev, descripcion: e.target.value })) && autoResizeTextarea(e)}
								placeholder="Me gusta los paisajes al aire libre"
								spellCheck="false"
								name="biografia"
								rows="4"
							/>
						</div>

						<div className={styles.input_div}>
							<p>Gustos ({gustos_actuales.length} / 3)</p>
							<article className={`${styles.input_container} ${styles.input_MiCuenta_gustos}`}>
								{gustosImages.map((img, index) => (
									<div
										key={index}
										className={`${gustos_actuales.includes(img) ? styles.gusto_active : undefined} ${gustos_actuales.includes(img) && mouseEnter !== index ? styles.gusto_delete : undefined}`}
										onMouseEnter={() => { setShowDeleteImage(index); SetMouseEnter(!gustos_actuales.includes(img) && index) }}
										onMouseLeave={() => { setShowDeleteImage(null); SetMouseEnter(false) }}
										onClick={() => SetGustos_actuales(prev => gustos_actuales.includes(img)
											? prev.filter(g => g !== img)
											: gustos_actuales.length < 3 ? [...prev, img] : prev
										)}
									>
										<img src={`/images/usuarios/Gustos/${img}.svg`} alt={`Gusto ${index}`} className={styles.gusto_image} />
										{showDeleteImage === index && gustos_actuales.includes(img) && mouseEnter !== index &&
											<img
												src="/images/usuarios/account/delete_img.svg"
												alt="Eliminar"
												className={styles.delete_icon}
											/>}
									</div>
								))}
							</article>
						</div>
					</form>
				</section>
			</main>
		</>
	)
};

// Menu que aparece al editar "Vivienda "
export const EditarVivienda = ({ addImageState, viviendaData = [], setAddImageState, userData, setUserData }) => {
	const filteredListRef = useRef(null);
	const inputRef = useRef(null);

	const [editarStates, setEditarStates] = useState({
		locationFocus: false,
		location: ""
	})

	// Actualizar objeto de estado
	const updateEditarStates = (newState) => setEditarStates(prev => ({ ...prev, ...newState }));

	useEffect(() => {
		import("../../../utilities/filteresCities/FilteredList"); // Importar al cargar el componente

		// Controlar click fuera del input para cerrar el menú de listas filtradas
		const handleClickOutside = (event) => {
			if ((!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))) {
				updateEditarStates({ locationFocus: false });
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Actualizar los datos del usuario por primera vez
	useEffect(() => {
		if (viviendaData) {
			setUserData({
				ciudad: viviendaData.ciudad || '',
				provincia: viviendaData.provincia || '',
				precio_noche: viviendaData.precio_noche || '',
				banios: viviendaData.banios || '',
				habitaciones: viviendaData.habitaciones || '',
				camas: viviendaData.camas || '',
				viajeros: viviendaData.viajeros || '',
				imagen1: viviendaData.imagen1 || null,
				imagen2: viviendaData.imagen2 || null,
				imagen3: viviendaData.imagen3 || null,
				imagen4: viviendaData.imagen4 || null,
			});
			updateEditarStates({ location: viviendaData.ciudad + "," + viviendaData.provincia });
		}
	}, [viviendaData]);

	// Actualizar ubicación del usuario
	useEffect(() => {
		if (editarStates.location) {
			const ubicacion = editarStates.location.split(",");

			setUserData(prev => ({
				...prev,
				ciudad: ubicacion[0],
				provincia: ubicacion[1] || "",
			}));
		}
	}, [editarStates.location]);


	return (
		<>
			<h2>EDITAR VIVIENDA</h2>

			<main className={styles.main}>
				<section className={styles.modal_sections}>
					<h3>IMÁGENES <span>(máximo 4)</span></h3>

					<article className={styles.modal_images}>
						{userData && ["imagen1", "imagen2", "imagen3", "imagen4"].map((img, index) => {
							if (userData[img] == null) {
								// Si NO estamos en el primer índice o la imagen anterior es null, no mostramos nada mas
								if (index !== 0 && userData[`imagen${index}`] == null) return null;

								return (
									<div key={index} className={styles.file_input_wrapper}>
										<label className={styles.file_input_label} onMouseEnter={() => setAddImageState(true)} onMouseLeave={() => setAddImageState(false)} >
											<input
												type="file"
												accept="image/*"
												className={styles.file_input}
												name="archivo"
												onChange={(e) => setUserData(prev => ({ ...prev, [img]: e.target.files[0] }))}
											/>
											<img src="/images/usuarios/account/add_img.svg" alt="Editar vivienda" />
										</label>
										{addImageState && <p className={styles.add_image_tooltip}>Añadir imagen</p>}
									</div>
								)
							}

							return (
								<div key={index} className={styles.house_images}>
									<img
										src={userData[img] instanceof File ? URL.createObjectURL(userData[img]) : userData[img]}
										alt={`Vista previa ${img}`}
									/>
									<img
										src="/images/usuarios/account/delete_img.svg"
										alt="delete img"
										onClick={() => setUserData(prev => ({ ...prev, [img]: null }))} // Cambié onChange por onClick y actualicé el valor a null
									/>
								</div>
							);
						})}
					</article>
				</section>

				<section className={styles.modal_sections}>
					<h3>DETALLES</h3>
					<form className={`${styles.input_container} ${styles.input_detalles}`}>
						<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
							<p>Viajeros</p>
							<input
								type="number"
								value={userData?.viajeros || ""}
								onChange={(e) => setUserData(prev => ({ ...prev, viajeros: e.target.value }))}
								placeholder="Cantidad"
							/>
						</div>
						<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
							<p>Habitaciones</p>
							<input
								type="number"
								value={userData?.habitaciones || ""}
								onChange={(e) => setUserData(prev => ({ ...prev, habitaciones: e.target.value }))}
								placeholder="Cantidad"
							/>
						</div>
						<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
							<p>Camas</p>
							<input
								type="number"
								value={userData?.camas || ""}
								onChange={(e) => setUserData(prev => ({ ...prev, camas: e.target.value }))}
								placeholder="Cantidad"
							/>
						</div>
						<div className={`${styles.input_div} ${styles.input_details_vivienda}`}>
							<p>Baños</p>
							<input
								type="number"
								value={userData?.banios || ""}
								onChange={(e) => setUserData(prev => ({ ...prev, banios: e.target.value }))}
								placeholder="Cantidad"
							/>
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
							<p><strong style={{color : "black"}}>* </strong>Precio (&euro; / noche)</p>
							<input
								type="number"
								value={userData?.precio_noche || ""}
								onChange={(e) => setUserData(prev => ({ ...prev, precio_noche: e.target.value }))}
								placeholder="Coste"
							/>
							<span> </span>
						</div>
					</form>
					<p style={{ marginTop: "6px", fontSize : "20px", color : "gray" }}><strong style={{color : "black"}}>* </strong> Las comisiones del 10 % están añadidas al precio base. En el historial de reservas, el ingreso reflejado corresponderá al monto neto final recibido, una vez descontada dicha comisión.</p>
				</section>
			</main>

		</>
	)
};

// Menú que aparece al editar "Galeria"
export const EditarGaleria = ({ galeriaData = [], userData, setUserData }) => {

	// Actualizar los datos del usuario por primera vez
	useEffect(() => {
		if (galeriaData) {
			setUserData({
				imagen1: galeriaData.imagen1 || null,
				imagen2: galeriaData.imagen2 || null,
				imagen3: galeriaData.imagen3 || null,
				imagen4: galeriaData.imagen4 || null,
			});
		}
	}, [galeriaData]);


	return (
		<>
			<h2>EDITAR GALERIA</h2>

			<main className={styles.main}>
				<section className={styles.modal_sections}>
					<h3>IMÁGENES <span>(máximo 4)</span></h3>

					<article className={styles.modal_images}>
						{userData && ["imagen1", "imagen2", "imagen3", "imagen4"].map((img, index) => {
							if (userData[img] == null) {
								// Si NO estamos en el primer índice o la imagen anterior es null, no mostramos nada mas
								if (index !== 0 && userData[`imagen${index}`] == null) return null;

								return (
									<div key={index} className={styles.file_input_wrapper}>
										<label className={styles.file_input_label}>
											<input
												type="file"
												accept="image/*"
												className={styles.file_input}
												name="archivo"
												onChange={(e) => setUserData(prev => ({ ...prev, [img]: e.target.files[0] }))}
											/>
											<img src="/images/usuarios/account/add_img.svg" alt="Editar vivienda" />
										</label>
									</div>
								)
							}

							return (
								<div key={index} className={styles.house_images}>
									<img
										src={userData[img] instanceof File ? URL.createObjectURL(userData[img]) : userData[img]}
										alt={`Vista previa ${img}`}
									/>
									<img
										src="/images/usuarios/account/delete_img.svg"
										alt="delete img"
										onClick={() => setUserData(prev => ({ ...prev, [img]: null }))} // Cambié onChange por onClick y actualicé el valor a null
									/>
								</div>
							);
						})}
					</article>
				</section>
			</main>
		</>
	)
};

// Menu que aparece al editar "Biografia "
export const EditarBiografia = ({ esViajero = false, biografiaData = [], userData, setUserData }) => {
	const [UserIdiomas, setUserIdiomas] = useState(biografiaData.idiomas.split(",").map(idioma => idioma.trim()));

	const inputIdiomas = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Chino", "Árabe", "Ruso", "Japonés"];

	useEffect(() => {
		setUserData({
			sobreMi: biografiaData.sobreMi || '',
			idiomas: UserIdiomas.join(",") || '',
			descripcionExtra: biografiaData.descripcionExtra || '',
		});
	}, [biografiaData, UserIdiomas]);

	const handleChangeIdioma = (idiomaValue) => {
		UserIdiomas.includes(idiomaValue)
			? setUserIdiomas(UserIdiomas.filter(value => value !== idiomaValue))
			: setUserIdiomas([...UserIdiomas, idiomaValue]);
	}

	return (
		<>
			<h2>EDITAR BIOGRAFÍA</h2>

			<main className={styles.main}>
				<section className={styles.modal_sections}>
					<h3>SOBRE MI</h3>

					<form className={styles.input_container} >
						<div className={styles.input_div}>
							<p>Descripción personal {userData?.sobreMi?.length || 0} / 500</p>
							<textarea
								value={userData?.sobreMi || ''}
								onChange={(e) => e.target.value.length <= 500 && setUserData(prev => ({ ...prev, sobreMi: e.target.value })) && autoResizeTextarea(e)}
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
									className={`${styles.idioma_opcion} ${UserIdiomas.includes(idioma) ? styles.idioma_active : ""}`}
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
							<p>Descripción  {esViajero ? "de tus viajes" : "del alojamiento"} {userData?.descripcionExtra?.length || 0}  / 500</p>
							<textarea
								value={userData?.descripcionExtra || ''}
								onChange={(e) => e.target.value.length <= 500 && setUserData(prev => ({ ...prev, descripcionExtra: e.target.value })) && autoResizeTextarea(e)}
								placeholder={esViajero ? "En mis anteriores viajes me hospedé en ciudades grandes" : "Te hospedarás en una acogedora vivienda compartida"}
								spellCheck="false"
								name="biografia"
								rows="4"
							></textarea>
						</div>
					</form>
				</section>
			</main>
		</>
	)
};

// Menu que aparece al editar "Recomendaciones "
export const EditarRecomendaciones = ({ esViajero, recomendacionesData = [], userData, setUserData }) => {

	useEffect(() => {
		setUserData({
			titulo: recomendacionesData.titulo || '',
			descripcion: recomendacionesData.descripcion || '',
			ubicacion: recomendacionesData.ubicacion || '',
			recomendacion: recomendacionesData.recomendacion || '',
			telefono: recomendacionesData.telefono || '',
			horarios: recomendacionesData.horario || '',
			ayuda: recomendacionesData.ayuda || ''
		});
	}, []);


	return (
		<>
			<h2> AÑADIR {esViajero ? "EXPERIENCIA" : "RECOMENDACION"}</h2>

			<main className={styles.main}>
				<section className={styles.modal_sections}>
					<h3>{esViajero ? "EXPERIENCIA" : "RECOMENDACIÓN"}</h3>
					<form className={`${styles.input_container} ${styles.input_recomendacion}`}>
						<div className={`${styles.input_div} ${styles.input_recomendacion_title}`}>
							<p>Titulo</p>
							<input
								type="text"
								placeholder="Restaurante favorito"
								spellCheck="false"
								name="titulo"
								value={userData?.titulo || ""}
								onChange={(e) => e.target.value.length <= 60 && setUserData(prev => ({ ...prev, titulo: e.target.value }))}
							/>
						</div>

						<div className={styles.input_div}>
							<p>Descripción  {userData?.descripcion.length || 0} / 500</p>
							<textarea
								placeholder="Si te encanta la comida local, no puedes perderte ‘La Taberna de Juan’"
								spellCheck="false"
								name="descripcion"
								rows="4"
								value={userData?.descripcion || ""}
								onChange={(e) => e.target.value.length <= 500 && setUserData(prev => ({ ...prev, descripcion: e.target.value }))}
							></textarea>
						</div>
					</form>
				</section>

				<section className={styles.modal_sections}>
					<h3>DETALLES OPCIONALES</h3>
					<form className={`${styles.input_container} ${styles.input_details}`} >
						{!esViajero && <div className={styles.input_div}>
							<p>Ubicación</p>
							<article className={styles.input_article}>
								<img src="/images/profiles/recomendaciones/location.svg" alt="Ubicación" className={styles.input_image} />
								<input
									type="text"
									placeholder="Dirección del lugar"
									spellCheck="false"
									name="ubicacion"
									value={userData?.ubicacion || ""}
									onChange={(e) => e.target.value.length <= 75 && setUserData(prev => ({ ...prev, ubicacion: e.target.value }))}
								/>
							</article>
						</div>}

						<div className={styles.input_div}>
							<p>Recomendación</p>
							<article className={styles.input_article}>
								<img src="/images/profiles/recomendaciones/backpack.svg" alt="Recomendación" className={styles.input_image} />
								<input
									type="text"
									placeholder="Consejos para visitar"
									spellCheck="false"
									name="recomendacion"
									value={userData?.recomendacion || ""}
									onChange={(e) => e.target.value.length <= 75 && setUserData(prev => ({ ...prev, recomendacion: e.target.value }))}
								/>
							</article>
						</div>

						{!esViajero && <div className={styles.input_div}>
							<p>Teléfono</p>
							<article className={styles.input_article}>
								<img src="/images/profiles/recomendaciones/phone.svg" alt="Teléfono" className={styles.input_image} />
								<input
									type="number"
									placeholder="666-777-999"
									spellCheck="false"
									name="telefono"
									value={userData?.telefono || ""}
									onChange={(e) => e.target.value.match(/^\d*$/) && e.target.value.length <= 9 && setUserData(prev => ({ ...prev, telefono: e.target.value }))}
								/>
							</article>
						</div>}

						{!esViajero && <div className={styles.input_div}>
							<p>Horarios</p>
							<article className={styles.input_article}>
								<img src="/images/profiles/recomendaciones/clock.svg" alt="Horarios" className={styles.input_image} />
								<input
									type="text"
									placeholder="Horario de apertura y cierre"
									spellCheck="false"
									name="horarios"
									value={userData?.horarios || ""}
									onChange={(e) => e.target.value.length <= 75 && setUserData(prev => ({ ...prev, horarios: e.target.value }))}
								/>
							</article>
						</div>}

						{!esViajero && <div className={styles.input_div}>
							<p>Ayuda</p>
							<article className={styles.input_article}>
								<img src="/images/profiles/recomendaciones/help.svg" alt="Comentarios" className={styles.input_image} />
								<input
									type="text"
									placeholder="Comentarios adicionales"
									spellCheck="false"
									name="comentarios"
									value={userData?.ayuda || ""}
									onChange={(e) => e.target.value.length <= 75 && setUserData(prev => ({ ...prev, ayuda: e.target.value }))}
								/>
							</article>
						</div>}
					</form>
				</section>
			</main>
		</>
	)
};