import { useState } from "react";
import styles from "./FilterMenu.module.css";


export default function FilterMenu({ setOpenFilterMenu, filterOptions, setFilterOptions, setBuscarFiltrado, setViajerosFiltrados, setFiltrosActivos }) {
  const [mouseEnter, SetMouseEnter] = useState(null);

  const [tiempoEstanciaEstimado, SetTiempoEstanciaEstimado] = useState(filterOptions.tiempo_estancia);

  const [gustos_actuales, SetGustos_actuales] = useState(filterOptions.gustos);
  const [showDeleteImage, setShowDeleteImage] = useState(null);
  const gustosImages = [
    "baseball", "costura", "natacion", "pesca",
    "poker", "social", "correr", "futbol",
    "animales", "videojuegos", "comer", "cafe",
    "lectura", "peliculas", "musica", "ajedrez",
    "pintura", "cocina", "plantas", "camping",
    "ciclismo", "fotografia", "viajar", "gimnasio"
  ];

  const [UserIdiomas, setUserIdiomas] = useState(filterOptions.idiomas);
  const inputIdiomas = ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués", "Chino", "Árabe", "Ruso", "Japonés"];

  const handleChangeIdioma = (idiomaValue) => {
    UserIdiomas.includes(idiomaValue)
      ? setUserIdiomas(UserIdiomas.filter(value => value !== idiomaValue))
      : setUserIdiomas([...UserIdiomas, idiomaValue]);
  }

  const handleChangeTiempoEstancia = (tiempo_estancia) => {
    tiempoEstanciaEstimado.includes(tiempo_estancia)
      ? SetTiempoEstanciaEstimado(tiempoEstanciaEstimado.filter(value => value !== tiempo_estancia))
      : SetTiempoEstanciaEstimado([...tiempoEstanciaEstimado, tiempo_estancia]);
  }

  const saveFilter = () => {
    setFilterOptions({
      gustos: gustos_actuales,
      idiomas: UserIdiomas,
      tiempo_estancia : tiempoEstanciaEstimado
    });

    let filtros_activos = gustos_actuales.length + UserIdiomas.length + tiempoEstanciaEstimado.length;
    
    setFiltrosActivos(filtros_activos);
    setBuscarFiltrado(filtros_activos > 0);
    setOpenFilterMenu(false);
  }

  const deleteFilters = () => {
    setFilterOptions({
      gustos: [],
      idiomas: [],
      tiempo_estancia : []
    });

    setFiltrosActivos(0);
    setOpenFilterMenu(false);
    setBuscarFiltrado(false);
    setViajerosFiltrados([]);
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
          <h2>Tiempo de estancia</h2>

          <article className={styles.input_idioma}>
            {["< 1 mes", "1 - 3 meses", "3 - 6 meses", "6 - 12 meses", "> 1 año"].map((tiempo_estancia, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.idioma_opcion} ${tiempoEstanciaEstimado.includes(tiempo_estancia) ? styles.idioma_active : undefined}`}
                onClick={() => handleChangeTiempoEstancia(tiempo_estancia)}
              >{tiempo_estancia}</button>
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
          Mostrar inquilinos
        </button>
      </div>

    </dialog>
  )
}
