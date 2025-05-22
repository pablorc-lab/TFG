import { cities } from "../../../data/countries/cities.json"
import { states } from "../../../data/countries/states.json"
import { countries } from "../../../data/countries/countries.json"
import styles from "./FilteredList.module.css"
import { useEffect, useState } from "react";

// Usar MAP(id, localizacion) para mejorar el rendimiento
const stateMap = new Map(states.map(({ id, ...state }) => [id, state]));
const countryMap = new Map(countries.map(({ id, ...country }) => [id, country]));

// Ciudades mostradas al buscar
export default function FilteredList({ filteredListRef, listStates,  updateListStates, menuEdit = false, setRealizarBusqueda = null, scrollDesktop = false}) {
  const [filteredCities, setFilteredCities] = useState([]);

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Actualizar la lista de ciudades cada vez que se escribe
  useEffect(() => {
    // Dividir la entrada por la coma
    const input_city = listStates.location.split(',').map(part => part.trim().toLowerCase());
    const regex = new RegExp(`^${input_city[0]}`, 'i'); // Empezar por lo escrito, ignorando mayusculas (i)

    // Encontrar matches
    const matches = cities.filter(ciudad => {
      const cityMatch = regex.test(removeAccents(ciudad.name.toLowerCase()));
      if (input_city[1]) {
        const provincia = removeAccents(stateMap.get(ciudad.id_state).name.toLowerCase());
        return cityMatch && provincia.startsWith(input_city[1]);
      }
      return cityMatch;
    }).slice(0, menuEdit ? 3 : 5);
    
    setFilteredCities(matches);
  }, [listStates.location]);


  if(filteredCities.length === 0) return null;
  return (
    <ul className={`${styles.filteredCities} ${menuEdit ? styles.editarMenu : undefined}`} ref={filteredListRef} style={{ top: scrollDesktop ? '52px' : "" }}>
      {filteredCities.map(({ id, name, id_state }) => {
        const provincia = stateMap.get(id_state);
        const pais = countryMap.get(provincia.id_country);

        return (
          <li 
            key={id} 
            className={styles.filteredList} 
            onClick={() => {
              updateListStates({ location: `${name},${provincia.name}`, locationFocus: false });
              if(setRealizarBusqueda !== null) setRealizarBusqueda(true);
            }}
          >
            <span>{name}</span>
            <span>{provincia.name} ({pais.name})</span>
          </li>
        );
      })}
    </ul>
  )
}
