import React, { useState, useEffect } from 'react';
import Viajeros_header from './viajeros_header';
import Viajeros_header_mobile from './viajeros_mobile_header';
import parentStyles from "./viaj_viviendas.module.css"
import Ciudades from "../../../data/countries/cities.json"
import Pronvicias from "../../../data/countries/states.json"
import Paises from "../../../data/countries/countries.json"

export default function Viajeros_Viviendas({ defaultActiveSection = "alojamientos" }) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);
  const [activeSection, setActiveSection] = useState(defaultActiveSection);

  const [locationFocus, setLocationFocus] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [location, setLocation] = useState('');

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
  
  // Lista de paises filtradas al buscar, que se pasará a las cabeceras
  const children = (
    filteredCities.length > 0 && locationFocus && (
      <ul className={parentStyles.filteredCities}>
        {filteredCities.map(({ id, name, id_state }) => {
          const provincia = provinceMap[id_state]; // O(1)
          const pais = countryMap[provincia.id_country]; // O(1)
          return (
            <li key={id} className={parentStyles.filteredList} onClick={() => setLocation(name)}> 
              <span>{name}</span>
              <span>{provincia.name}, {pais.name}</span>
            </li>
          );
        })}
      </ul>
    )
  );

  // Cambio al escribir en el input "Destino"
  const handleInputChange = (e) => {
    const city = e.target.value;
    setLocation(city);

    if(city.length > 0){
      const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      };

      // Dividir la entrada por la coma
      const input_city = city.split(',').map(part => part.trim().toLowerCase());
      const regex = new RegExp(`^${input_city[0]}`, 'i'); // Empezar por lo escrito, ignorando mayusculas (i)

      const matches = Ciudades.cities.filter(ciudad => {
        const cityMatch = regex.test(removeAccents(ciudad.name.toLowerCase()));
        
        if(input_city[1]){
          const provincia = removeAccents(provinceMap[ciudad.id_state].name.toLowerCase());
          return cityMatch && provincia.startsWith(input_city[1]);
        }
        return cityMatch;
      }).slice(0,5);
      setFilteredCities(matches);
    }
    else{
      setFilteredCities([]);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 770);
    };
    window.addEventListener('resize', handleResize);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {window.removeEventListener('resize', handleResize);};
  }, [isLargeScreen]);

  
  return(
    <>
      {isLargeScreen 
        ? <Viajeros_header 
            children={children} 
            handleInputChange={handleInputChange} 
            setLocationFocus={setLocationFocus}
            location={location}
            parentStyles={parentStyles}
          /> 
        : <Viajeros_header_mobile
            children={children} 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            parentStyles={parentStyles} 
            handleInputChange={handleInputChange}
            setLocationFocus={setLocationFocus}
            location={location}
          />
      }
    </>
  )
}