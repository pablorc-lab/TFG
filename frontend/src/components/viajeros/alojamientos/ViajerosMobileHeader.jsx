import { useState} from 'react';
import styles_mobile from "./ViajerosMobileHeader.module.css"


export default function ViajerosMobileHeader({ filteredList, activeSection, setActiveSection, handleInputChange, setLocationFocus, location }) {
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
    return activeSection === nameSection && styles_mobile.active_section;
  }
  
  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <div className={getClassName('alojamientos')} onClick={() => setActiveSection('alojamientos')} >
            <img 
              src={`/images/viajeros/house_header.webp`} 
              width="50" 
              alt='icono casa' 
            />
            <span>Alojamientos</span>
          </div>
          <div className={getClassName('comunidades')} onClick={() => setActiveSection('comunidades')}>
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
            onClick={() => setActiveSection('perfil')}
          />
        </nav>
      </header>

      {/*Buscador siempre que estemos en alojamientos*/}
      {activeSection === 'alojamientos' && (
        <article className={styles_mobile.search_form_container}>
          <form className={styles_mobile.search_form}>
            {/*BUSCAR DESTINO*/}
            <div > 
              <img src="/images/viajeros/lupa_mobile.webp" width="50" alt='icono lupa' />
              <input 
                type="text" 
                className={styles_mobile.searcher} 
                name="buscador" 
                placeholder="Destino" 
                spellCheck="false"
                value={location}
                onChange={handleInputChange}
                onFocus={() => setLocationFocus(true)}
                onBlur={() => {setTimeout(() => setLocationFocus(false), 200);}}
              />
              {filteredList}
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

