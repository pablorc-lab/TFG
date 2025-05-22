import styles_mobile from "./SearchAlojamiento.module.css";

export default function SearchAlojamiento({ inputRef, filteredListRef, FilteredList, setOpenFilterMenu, headerStates, updateHeaderStates, setRealizarBusqueda, filtrosActivos }) {
  return (
    <article className={styles_mobile.search_form_container}>
      <form className={styles_mobile.search_form}>
        {/*BUSCAR DESTINO*/}
        <div >
          <img src="/images/viajeros/lupa_mobile.webp" width="50" alt='icono lupa' onClick={() => setRealizarBusqueda(true)} />
          <input
            ref={inputRef}
            type="text"
            className={styles_mobile.searcher}
            name="buscador"
            placeholder="Destino o @usuario"
            spellCheck="false"
            value={headerStates.location}
            onChange={(e) => updateHeaderStates({ location: e.currentTarget.value })}
            onFocus={() => updateHeaderStates({ locationFocus: true })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Evita que el formulario se envíe
                setRealizarBusqueda(true);
              }
            }}
          />
          {headerStates.locationFocus && headerStates.location &&
            <FilteredList
              filteredListRef={filteredListRef}
              listStates={headerStates}
              updateListStates={updateHeaderStates}
              setRealizarBusqueda={setRealizarBusqueda}
              scrollDesktop={false}
            />
          }
        </div>
      </form>

      <div className={styles_mobile.filter_container}>
        <img
          className={`${styles_mobile.filters} ${filtrosActivos > 0 ? styles_mobile.filters_active : ""}`}
          src="/images/viajeros/filtros.webp"
          onClick={() => setOpenFilterMenu(true)}
          width="50"
          alt='icono filtros'
        />
        {filtrosActivos > 0 && <p>{filtrosActivos}</p>}
      </div>

    </article>
  )
}
