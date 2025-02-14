import { useState} from 'react';
import styles_mobile from "./ViajerosMobileHeader.module.css"
import FilteredList from '../../utilities/filteresCities/FilteredList';

export default function ViajerosMobileHeader({inputRef, filteredListRef, headerStates, updateHeaderStates}) {
  const [username, setUsername] = useState("");

  // Cada vez que se reenderiza el componente, se crean los arrays de los JSON
  const handleOnChange_searchUser = (e) => {
    if (e.target.value === '' || e.target.value[0] !== '@') {
      setUsername('@');
    }
    else
      setUsername(e.target.value);
  };

  // Obtener el "classname" del nav actual
  const getClassName = (nameSection) => {
    return (headerStates.activeSection === nameSection) ? styles_mobile.active_section : undefined;
  }
  
  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <div className={getClassName('alojamientos')}onClick={() => updateHeaderStates({activeSection : "alojamientos"})}>
            <img 
              src={`/images/viajeros/house_header.webp`} 
              width="50" 
              alt='icono casa' 
            />
            <span>Alojamientos</span>
          </div>
          <div className={getClassName('comunidades')} onClick={() => updateHeaderStates({activeSection : "comunidades"})}>
            <img 
              src={`/images/viajeros/comunidades_header.webp`} 
              width="50" 
              alt='icono comunidades' 
            />
            <span>Comunidades</span>
          </div>
          <img 
            className={getClassName('perfil')}
            src={`/images/viajeros/user_header.webp`} 
            width="55"
            alt='icono user' 
            onClick={() => updateHeaderStates({activeSection : "perfil"})}
          />
        </nav>
      </header>

      {/*Buscador siempre que estemos en alojamientos*/}
      {headerStates.activeSection === 'alojamientos' && (
        <article className={styles_mobile.search_form_container}>
          <form className={styles_mobile.search_form}>
            {/*BUSCAR DESTINO*/}
            <div > 
              <img src="/images/viajeros/lupa_mobile.webp" width="50" alt='icono lupa' />
              <input 
                ref={inputRef}
                type="text" 
                className={styles_mobile.searcher} 
                name="buscador" 
                placeholder="Destino" 
                spellCheck="false"
                value={headerStates.location}
                onChange={(e) =>  updateHeaderStates({location : e.currentTarget.value})}
                onFocus={() => updateHeaderStates({locationFocus : true})}
              />
              {headerStates.locationFocus && headerStates.location && 
                <FilteredList 
                  filteredListRef={filteredListRef} 
                  listStates={headerStates} 
                  updateListStates={updateHeaderStates}
                />
              }
            </div>

            {/*BUSCAR USUARIO*/}
            <div>
              <img src="/images/logos/search_user_active.webp" width="50" alt='icono usuario lupa' />
              <input 
                type="text" 
                className={styles_mobile.searcher} 
                name="buscador" 
                placeholder="@username" 
                spellCheck="false"
                value={username}
                onFocus={() => {username === '' && setUsername('@');}}
                onBlur={() => setUsername("")}
                onChange={handleOnChange_searchUser}
              />
            </div>
          </form>

          <img className={styles_mobile.filters} src="/images/viajeros/filtros.webp" width="50" alt='icono filtros' />
        </article>
      )}
     
    </>
  )
}

