import styles from "./Editar.module.css"
import FilteredList from "../../../utilities/filteresCities/FilteredList";
import { useEffect, useRef, useState } from "react";

export default function EditarMiCuenta({ setIsOpen, mostrarCuenta = true }) {
  const filteredListRef = useRef(null);
  const inputRef = useRef(null);
  const [addImageState, setAddImageState] = useState(false);
  const [editarStates, setEditarStates] = useState({
    locationFocus: false,
    location: ""
  })

  const [viviendasImages, setViviendasImages] = useState([
    "/images/landing_page/casa_1.webp",
    "/images/landing_page/casa_2.webp",
    "/images/landing_page/casa_2.webp",
  ]);

  const [showDeleteImage, setShowDeleteImage] = useState(null);
  const [gustosImages, setGustosImages] = useState([
    "/images/usuarios/Gustos/baseball.svg",
    "/images/usuarios/Gustos/pesca.svg",
    "/images/usuarios/Gustos/poker.svg",
  ]);

  // Actualizar objeto de estado
  const updateEditarStates = (newState) => setEditarStates(prev => ({ ...prev, ...newState }));

  useEffect(() => {
    // Controlar click fuera del input para cerrar el menú de listas filtradas
    const handleClickOutside = (event) => {
      if ((!inputRef.current || !inputRef.current.contains(event.target)) && (!filteredListRef.current || !filteredListRef.current.contains(event.target))) {
        updateEditarStates({ locationFocus: false });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Contenido mostrado al acceder a "Vivienda"
  const editarVivienda = (
    <>
      <section className={styles.modal_sections}>
        <h3>IMÁGENES <span>(máximo 4)</span></h3>
        <article className={styles.modal_images}>
          {viviendasImages.map((path_img, index) => (
            <div key={index} className={styles.house_images}>
              <img src={path_img} alt={`Imagen ${index}`} />
              <img
                src="/images/usuarios/account/delete_img.svg"
                alt="delete img"
                onClick={() => setViviendasImages(viviendasImages.filter((_, i) => i !== index))}
              />
            </div>
          ))}

          {/* Mostrar el label solo si hay menos de 4 imágenes */}
          {viviendasImages.length < 4 && (
            <div className={styles.file_input_wrapper}>
              <label className={styles.file_input_label} onMouseEnter={() => setAddImageState(true)} onMouseLeave={() => setAddImageState(false)} >
                <input type="file" accept="image/*" className={styles.file_input} name="archivo" />
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
          <div className={`${styles.input_div} ${styles.input_details}`}>
            <p>Viajeros</p>
            <input type="number" placeholder="1 - 4" min="1" max="4" name="habitaciones" />
          </div>
          <div className={`${styles.input_div} ${styles.input_details}`}>
            <p>Habitaciones</p>
            <input type="number" placeholder="1 - 4" min="1" max="4" name="baños" />
          </div>
          <div className={`${styles.input_div} ${styles.input_details}`}>
            <p>Camas</p>
            <input type="number" placeholder="1 - 4" min="1" max="4" name="habitaciones" />
          </div>
          <div className={`${styles.input_div} ${styles.input_details}`}>
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
              <FilteredList
                filteredListRef={filteredListRef}
                listStates={editarStates}
                updateListStates={updateEditarStates}
                menuEdit={true}
              />
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

  const editarMiCuenta = (
    <>
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
            <input type="email" placeholder="Pablo@example.com" spellCheck="false" name="Email" autocomplete="email" />
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
          <div className={`${styles.input_div} ${styles.input_MiCuenta_biografia}`}>
            <p>Biografía 0 / 100</p>
            <textarea
              placeholder="Me gusta los paisajes al aire libre"
              spellCheck="false"
              name="biografia"
              rows="4"
            ></textarea>
          </div>

          <div className={styles.input_div}>
            <p>Gustos (máximo 3)</p>
            <article className={`${styles.input_container} ${styles.input_MiCuenta_gustos}`}>
              {gustosImages.map((src, index) => (
                <div key={index} className={`${showDeleteImage === index ? styles.gusto_delete : undefined}`} onMouseEnter={() => setShowDeleteImage(index)} onMouseLeave={() => setShowDeleteImage(null)}>
                  <img src={src} alt={`Gusto ${index}`} />
                  {showDeleteImage === index &&
                    <img
                      src="/images/usuarios/account/delete_img.svg"
                      alt="Eliminar"
                      className={styles.delete_icon}
                      onClick={() => setGustosImages(gustosImages.filter((_, i) => i !== index))}
                    />}
                </div>
              ))}
              {gustosImages.length < 3 && (
                <div className={styles.add_gusto}>
                  <img
                    src="/images/usuarios/account/add_img.svg"
                    alt="Editar vivienda"
                    onMouseEnter={() => setAddImageState(true)}
                    onMouseLeave={() => setAddImageState(false)}
                  />
                  {addImageState && <p className={styles.add_gusto_tooltip}>Añadir gusto personal</p>}
                </div>
              )}
            </article>
          </div>
        </form>
      </section>
    </>
  )

  return (
    <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
      <h2>EDITAR {mostrarCuenta ? "CUENTA" : "VIVIENDA"} </h2>

      {mostrarCuenta ? editarMiCuenta : editarVivienda}

      <div className={styles.modal_buttons}>
        <button onClick={() => setIsOpen(false)}>CANCELAR</button>
        <button onClick={() => setIsOpen(false)}>GUARDAR</button>
      </div>
    </dialog>
  );
}
