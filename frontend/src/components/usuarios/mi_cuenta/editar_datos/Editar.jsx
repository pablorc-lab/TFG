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
        <h3>IMÁGENES (máximo 4)</h3>
        <article className={styles.modal_images}>
          {viviendasImages.map((path_img, index) => (
            <div key={index} className={styles.house_images}>
              <img src={path_img} alt={`Imagen ${index}`} />
              <img
                src="/images/usuarios/account/delete_img.svg"
                alt="delete img"
                onClick={() => setViviendasImages([...viviendasImages.slice(0, index), ...viviendasImages.slice(index + 1)])}
              />
            </div>
          ))}

          {/* Mostrar el label solo si hay menos de 4 imágenes */}
          {viviendasImages.length < 4 && (
            <div className={styles.file_input_wrapper}>
              <label className={styles.file_input_label} onMouseEnter={() => setAddImageState(true)} onMouseLeave={() => setAddImageState(false)}>
                <input type="file" accept="image/*" className={styles.file_input} />
                <img src="/images/usuarios/account/add_img.svg" alt="Editar vivienda" />
              </label>
              {addImageState && <p className={styles.add_image_tooltip}>Añadir imagen</p>}
            </div>
          )}
        </article>
      </section>

      <section className={styles.modal_sections}>
        <h3>DETALLES</h3>
        <form className={styles.input_container}>
          <div className={styles.input_div}>
            <p>Habitaciones</p>
            <input type="number" placeholder="1 - 16" min="1" max="16" />
          </div>
          <div className={styles.input_div}>
            <p>Baños</p>
            <input type="number" placeholder="1 - 8" min="1" max="8" />
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
            <input type="number" placeholder="45" />
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
            <input type="text" placeholder="Pablo" spellCheck="false"/>
          </div>
          <div className={styles.input_div}>
            <p>Apellido</p>
            <input type="text" placeholder="Ramblado" spellCheck="false"/>
          </div>
          <div className={styles.input_div}>
            <p>ID privado</p>
            <input type="text" placeholder="PabloID123" spellCheck="false"/>
          </div>
          <div className={styles.input_div}>
            <p>Edad</p>
            <input type="date" placeholder="Ramblado" spellCheck="false"/>
          </div>
        </form>
      </section>

      <section className={styles.modal_sections}>
        <h3>CONTACTO</h3>
        <form className={`${styles.input_container} ${styles.input_MiCuenta_contacto}`}>
          <div className={styles.input_div}>
            <p>Email</p>
            <input type="email" placeholder="Pablo@example.com" spellCheck="false"/>
          </div>
          <div className={styles.input_div}>
            <p>Teléfono</p>
            <input type="number" placeholder="666-777-999" spellCheck="false"/>
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
