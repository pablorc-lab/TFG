import Comentarios from "./Comentarios";

const ShowAllComentarios = ({ styles, valoraciones = [], setActiveShowMore }) => {
  return (
    <dialog ref={(el) => el && el.showModal()} className={styles.dialog_container}>
      <img src="/images/usuarios/close_menu.svg" alt="Cerrar menú" className={styles.cerra_menu} onClick={() => setActiveShowMore(false)}/>

      <h1>Mostrando {valoraciones.length} opiniones</h1>
      <section className={styles.dialog_main}>
        {valoraciones.map((valoracion, index) => (
          <Comentarios
            key={index}
            profileImg={valoracion.emisor_profile_img}
            nombre={`${valoracion.emisor_nombre}`}
            fecha={valoracion.fecha}
            nota={valoracion.num_valoracion}
            descripcion={valoracion.descripcion}
          />
        ))}
      </section>

    </dialog>
  );
}

export default ShowAllComentarios;
