import { useState} from 'react';
import styles_mobile from "./viaj_viviendas_mobile.module.css"
import Ciudades from "../../../data/countries/cities.json"
import Pronvicias from "../../../data/countries/states.json"
import Paises from "../../../data/countries/countries.json"

export default function Viajeros_header_mobile({ activeSection, setActiveSection }) {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState('');
  const [locationFocus, setLocationFocus] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

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
  
  // Cambio al escribir en el input "Destino"
  const handleInputChange = (e) => {
    const city = e.target.value;
    setLocation(city);

    if(city.length > 0){
      const matches = Ciudades.cities
      .filter(ciudad => ciudad.name.toLowerCase().includes(city.toLowerCase()))
      .slice(0,3);
      setFilteredCities(matches);
    }
    else{
      setFilteredCities([]);
    }
  }

  // Almacenar las provincias para mejorar su eficiencia al buscar
  const provinceMap = {};
  Pronvicias.states.forEach(state => {
    provinceMap[state.id] = state;
  });

  // Almacenar los paises para mejorar su eficiencia al buscar
  const countryMap = {};
  Paises.countries.forEach(country => {
    countryMap[country.id] = country;
  });


  return (
    <>
      {/*Cabecera*/}
      <header className={styles_mobile.header}>
        <nav className={styles_mobile.search_nav}>
          <div className={getClassName('alojamientos')} onClick={() => setActiveSection('alojamientos')} >
            <img 
              src={`images/viajeros/house_header.webp`} 
              width="50" 
              alt='icono casa' 
            />
            <span>Alojamientos</span>
          </div>

          <div className={getClassName('comunidades')} onClick={() => setActiveSection('comunidades')}>
            <img 
              src={`images/viajeros/comunidades_header.webp`} 
              width="50" 
              alt='icono comunidades' 
            />
            <span>Comunidades</span>
          </div>

          <img 
            className={getClassName('perfil')}
            src={`images/viajeros/user_header.webp`} 
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
              <img src="images/viajeros/lupa_mobile.webp" width="50" alt='icono lupa' />
              <input 
                type="text" 
                className={styles_mobile.searcher} 
                name="buscador" 
                placeholder="Destino" 
                value={location}
                onChange={handleInputChange}
                onFocus={() => setLocationFocus(true)}
                onBlur={() => setLocationFocus(false)}
              />
              {filteredCities.length > 0 && locationFocus && (
                <ul className={styles_mobile.filteredCities} >
                  {filteredCities.map(({id, name, id_state}) => {
                    const provincia = provinceMap[id_state]; // O(1)
                    const pais = countryMap[provincia.id_country]; // O(1)                  
                    return (
                      <li key={id} className={styles_mobile.filteredList} onClick={() => setLocation(name)}> 
                        <span>{name}</span>
                        <span>{provincia.name}, {pais.name }</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/*BUSCAR USUARIO*/}
            <div>
              <img src="images/logos/search_user_active.webp" width="50" alt='icono usuario lupa' />
              <input 
                type="text" 
                className={styles_mobile.searcher} 
                name="buscador" 
                placeholder="@username" 
                value={username}
                onFocus={() => {username === '' && setUsername('@');}}
                onBlur={() => setUsername("")}
                onChange={handleOnChange_searchUser}
              />
            </div>
          </form>

          <img className={styles_mobile.filters} src="images/viajeros/filtros.webp" width="50" alt='icono filtros' />
        </article>
      )}
     
    </>
  )
}

