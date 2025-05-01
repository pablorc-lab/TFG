package com.bearfrens.backend.specification;

import com.bearfrens.backend.entity.user.Viajero;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;


// Especificaciones usadas para buscar ciertos viajeros
@AllArgsConstructor
public class ViajeroSpecification implements Specification<Viajero> {

  private List<String> gustos; // Lista de gustos que queremos filtrar
  private List<String> tiempoEstancia;

  @Override
  public Predicate toPredicate(Root<Viajero> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
    List<Predicate> predicates = new ArrayList<>();

    // Filtro de gustos
    if (gustos != null && !gustos.isEmpty()) {
      // Verificar si alguno de los gustos en la lista coincide con gusto1, gusto2 o gusto3
      Predicate gusto1Predicate = root.get("gusto1").in(gustos);
      Predicate gusto2Predicate = root.get("gusto2").in(gustos);
      Predicate gusto3Predicate = root.get("gusto3").in(gustos);

      // Agrega las condiciones a la lista de predicados
      // cb.or() : Si cualquiera de las condiciones es verdadera, el Predicate completo será verdadero.
      predicates.add(cb.or(gusto1Predicate, gusto2Predicate, gusto3Predicate));
    }

    // Filtro de tiempo de estancia
    if (tiempoEstancia != null && !tiempoEstancia.isEmpty()) {
      predicates.add(root.get("tiempo_estancia").in(tiempoEstancia));
    }

    // Combina todos los predicados con `and`
    return cb.and(predicates.toArray(new Predicate[0]));
  }
}
