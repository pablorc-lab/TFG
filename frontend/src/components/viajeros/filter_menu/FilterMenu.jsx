import { useState } from "react";
import styles from "./FilterMenu.module.css";


export default function FilterMenu({ setOpenFilterMenu }) {
  const [gustos_actuales, SetGustos_actuales] = useState([]);
  const [mouseEnter, SetMouseEnter] = useState(null);

  const [rango, setRango] = useState({ min: 0, max: 120 });

  const [showDeleteImage, setShowDeleteImage] = useState(null);

  const gustosImages = [
    "baseball", "costura", "natacion", "pesca",
    "poker", "social", "correr", "futbol",
    "animales", "videojuegos", "comer", "cafe",
    "lectura", "peliculas", "musica", "ajedrez",
    "pintura", "cocina", "plantas", "camping",
    "ciclismo", "fotografia", "viajar", "gym"
  ];

  const handleRangoChange = (e, tipo) => {
    const valor = e.target.value.replace(/[^\d]/g, ""); // Eliminar todo lo que NO sea dígito
    setRango({ ...rango, [tipo]: Number(valor) });
  };

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
              <label for="min">Mínimo</label>
              <input
                id="min"
                type="text"
                value={"€ " + rango.min}
                onChange={(e) => handleRangoChange(e, "min")}
              />
            </div>
            <div>
              <label for="max">Máximo</label>
              <input
                id="max"
                type="text"
                value={"€ " + rango.max}
                onChange={(e) => handleRangoChange(e, "max")}
              />
            </div>
          </article>
        </section>

        <section>
          <h2>Habitaciones y camas</h2>

          <article className={styles.input_habitaciones}>
            <div>
              <label>Viajeros</label>
              <div className={styles.contador}>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div>
              <label>Habitaciones</label>
              <div className={styles.contador}>
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>
            </div>
            <div>
              <label>Camas</label>
              <div className={styles.contador}>
                <button>-</button>
                <span>2</span>
                <button>+</button>
              </div>
            </div>
          </article>
          <div>
            <label>Baños</label>
            <div className={styles.contador}>
              <button>-</button>
              <span>1</span>
              <button>+</button>
            </div>
          </div>
        </section>

      </main>

      <div className={styles.button_filtros}>
        <button >
          Mostrar viviendas
        </button>
      </div>

    </dialog>
  )
}
