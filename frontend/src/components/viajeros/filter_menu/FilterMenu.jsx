import { useState } from "react";
import styles from "./FilterMenu.module.css";


export default function FilterMenu({ setOpenFilterMenu, filterOptions, setFilterOptions, setBuscarFiltrado }) {
  const [mouseEnter, SetMouseEnter] = useState(null);

  const [rango, setRango] = useState({ min: filterOptions.min, max: filterOptions.max });

  const opcionesVivienda = [
    { label: "Viajeros", clave: "viajeros" },
    { label: "Habitaciones", clave: "habitaciones" },
    { label: "Camas", clave: "camas" },
    { label: "Baños", clave: "baños" },
  ];
  const [opcionesViviendaEscogida, SetOpcionesViviendaEscogida] = useState([
    filterOptions.viajeros,
    filterOptions.habitaciones,
    filterOptions.camas,
    filterOptions.banios
  ]);

  const [gustos_actuales, SetGustos_actuales] = useState(filterOptions.gustos);
  const [showDeleteImage, setShowDeleteImage] = useState(null);
  const gustosImages = [
    "baseball", "costura", "natacion", "pesca",
    "poker", "social", "correr", "futbol",
    "animales", "videojuegos", "comer", "cafe",
    "lectura", "peliculas", "musica", "ajedrez",
    "pintura", "cocina", "plantas", "camping",
    "ciclismo", "fotografia", "viajar", "gym"
  ];

  const [UserIdiomas, setUserIdiomas] = useState(filterOptions.idiomas);
  const inputIdiomas = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Chino", "Árabe", "Ruso", "Japonés"];

  const handleChangeRango = (e, tipo) => {
    const valor = e.target.value.replace(/[^\d]/g, ""); // Eliminar todo lo que NO sea dígito
    if (tipo === "min" && Number(valor) > rango.max) {
      setRango({ min: Number(valor), max: Number(valor) });

    }
    else {
      setRango({ ...rango, [tipo]: Number(valor) });
    }
  };

  const handleChangeIdioma = (idiomaValue) => {
    UserIdiomas.includes(idiomaValue)
      ? setUserIdiomas(UserIdiomas.filter(value => value !== idiomaValue))
      : setUserIdiomas([...UserIdiomas, idiomaValue]);
  }

  const handleChangeViviendaValue = (index, item) => {
    SetOpcionesViviendaEscogida(prev => ({
      ...prev,
      [index]: opcionesViviendaEscogida[index] === -1 ? item : -1
    }))
  }

  const saveFilter = () => {
    setFilterOptions({
      gustos: gustos_actuales,
      max: rango.max,
      min: rango.min,
      viajeros: opcionesViviendaEscogida[0],
      habitaciones: opcionesViviendaEscogida[1],
      camas: opcionesViviendaEscogida[2],
      banios: opcionesViviendaEscogida[3],
      idiomas: UserIdiomas,
    });

    const isFilterChanged = rango.max !== 0 ||
      opcionesViviendaEscogida[0] !== -1 ||
      opcionesViviendaEscogida[1] !== -1 ||
      opcionesViviendaEscogida[2] !== -1 ||
      opcionesViviendaEscogida[3] !== -1 ||
      gustos_actuales.length > 0 ||
      UserIdiomas.length > 0;

    setBuscarFiltrado(isFilterChanged);
    setOpenFilterMenu(false);
  }

  const deleteFilters = () => {
    setFilterOptions({
      gustos: [],
      max: 0,
      min: 0,
      viajeros: -1,
      habitaciones: -1,
      camas: -1,
      banios: -1,
      idiomas: [],
    });
    setBuscarFiltrado(false);
    setOpenFilterMenu(false);
  }

  return (
    <dialog className={styles.dialog} ref={(el) => el && el.showModal()}>
      <section className={styles.titulo}>
        <img src="/images/usuarios/close_menu.svg" alt="Cerrar" className={styles.cerra_menu} onClick={() => setOpenFilterMenu(false)} />
        <h1>Filtros</h1>
      </section>

      <main className={styles.main}>
        <section>
          <h2>Gustos</h2>
          <article className={styles.input_MiCuenta_gustos}>
            {gustosImages.map((img, index) => (
              <div
                key={index}
                className={`${gustos_actuales.includes(img) ? styles.gusto_active : undefined} ${gustos_actuales.includes(img) && mouseEnter !== index ? styles.gusto_delete : undefined}`}
                onMouseEnter={() => { setShowDeleteImage(index); SetMouseEnter(!gustos_actuales.includes(img) && index) }}
                onMouseLeave={() => { setShowDeleteImage(null); SetMouseEnter(false) }}
                onClick={() => SetGustos_actuales(prev => prev.includes(img) ? prev.filter(g => g !== img) : [...prev, img])}
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
        </section>

        <section>
          <h2>Rango de precio</h2>
          <article className={styles.input_Rango}>
            <div>
              <label htmlFor="min">Mínimo</label>
              <input
                id="min"
                type="text"
                value={"€ " + rango.min}
                onChange={(e) => handleChangeRango(e, "min")}
              />
            </div>
            <div className={styles.line_range}></div>
            <div>
              <label htmlFor="max">Máximo</label>
              <input
                id="max"
                type="text"
                value={"€ " + rango.max}
                onChange={(e) => handleChangeRango(e, "max")}
              />
            </div>
          </article>
        </section>

        <section>
          <h2>Habitaciones y camas</h2>
          <article className={styles.input_habitaciones}>
            {opcionesVivienda.map((opcion, index) => (
              <div key={index}>
                <label>{opcion.label}</label>
                <ul className={styles.lista_botones}>
                  {[1, 2, 3, "4+"].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleChangeViviendaValue(index, item)}
                        className={opcionesViviendaEscogida[index] === item ? styles.opcion_activa : ""}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
        </section>

        <section>
          <h2>Idiomas</h2>

          <article className={styles.input_idioma}>
            {inputIdiomas.map((idioma, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.idioma_opcion} ${UserIdiomas.includes(idioma) ? styles.idioma_active : undefined}`}
                onClick={() => handleChangeIdioma(idioma)}
              >{idioma}</button>
            ))}
          </article>
        </section>
      </main>

      <div className={styles.button_filtros}>
        <p onClick={() => deleteFilters()}>Borrar filtros</p>
        <button onClick={() => saveFilter()}>
          Mostrar viviendas
        </button>
      </div>

    </dialog>
  )
}
