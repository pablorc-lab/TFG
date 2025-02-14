import styles from "./Editar.module.css"
import FilteredList from "../../../utilities/filteresCities/FilteredList";
import { useEffect, useRef, useState } from "react";

export default function EditarMiCuenta({ setIsOpen }) {
  const filteredListRef = useRef(null);
  const inputRef = useRef(null);
  const [editarStates, setEditarStates] = useState({
    locationFocus: false,
    location: ""
  })
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


  return (
    <dialog className={styles.modal} ref={(el) => el && el.showModal()}>
      <h2>EDITAR VIVIENDA</h2>

      <article className={styles.modal_articles}>
        <h3>IMÁGENES</h3>
      </article>

      <article className={styles.modal_articles}>
        <h3>DETALLES</h3>
        <div className={styles.input_container}>
          <div className={styles.input_div}>
            <p>Habitaciones</p>
            <input type="number" placeholder="1 - 16" min="1" max="16" />
          </div>
          <div className={styles.input_div}>
            <p>Baños</p>
            <input type="number" placeholder="1 - 16" />
          </div>
        </div>
      </article>

      <article className={styles.modal_articles}>
        <h3>UBICACIÓN</h3>
        <div className={`${styles.input_container} ${styles.input_ubicacion}`}>
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
        </div>
      </article>

      <div className={styles.modal_buttons}>
        <button onClick={() => setIsOpen(false)}>CANCELAR</button>
        <button onClick={() => setIsOpen(false)}>GUARDAR</button>
      </div>
    </dialog>
  );
}
