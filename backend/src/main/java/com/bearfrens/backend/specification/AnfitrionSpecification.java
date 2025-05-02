package com.bearfrens.backend.specification;

import com.bearfrens.backend.entity.user.Anfitrion;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

// Especificaciones usadas para buscar ciertos anfitriones
@AllArgsConstructor
public class AnfitrionSpecification implements Specification<Anfitrion> {

  private List<String> gustos; // Lista de gustos que queremos filtrar
  private Integer max;
  private Integer min;
  private Integer viajeros;
  private Integer habitaciones;
  private Integer camas;
  private Integer banios;
  private String ciudad;
  private String provincia;

  @Override
  public Predicate toPredicate(Root<Anfitrion> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
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

    // Filtro de rango de precios precio máximo
    if (min != null && max != null && max > 0 && min <= max) {
      predicates.add(cb.between(root.get("vivienda").get("precio_noche"), min, max));
    }

    // Filtro de ubicación
    if(ciudad != null && !ciudad.isEmpty()){
      if(provincia != null && !provincia.isEmpty()){
        predicates.add(cb.and(
          cb.equal(root.get("vivienda").get("ciudad"), ciudad),
          cb.equal(root.get("vivienda").get("provincia"), provincia)
        ));
      }
      else{
        predicates.add(cb.equal(root.get("vivienda").get("ciudad"), ciudad));
      }
    }

    // Filtro de número de viajeros
    if (viajeros != null) {
      predicates.add(viajeros == 4
        ? cb.greaterThanOrEqualTo(root.get("vivienda").get("viajeros"), viajeros)
        : cb.equal(root.get("vivienda").get("viajeros"), viajeros));
    }

    // Filtro de número de habitaciones
    if (habitaciones != null) {
      predicates.add(habitaciones == 4
        ? cb.greaterThanOrEqualTo(root.get("vivienda").get("habitaciones"), habitaciones)
        : cb.equal(root.get("vivienda").get("habitaciones"), habitaciones));
    }

    // Filtro de número de camas
    if (camas != null) {
      predicates.add(camas == 4
        ? cb.greaterThanOrEqualTo(root.get("vivienda").get("camas"), camas)
        : cb.equal(root.get("vivienda").get("camas"), camas));
    }

    // Filtro de número de baños
    if (banios != null) {
      predicates.add(banios == 4
        ? cb.greaterThanOrEqualTo(root.get("vivienda").get("banios"), banios)
        : cb.equal(root.get("vivienda").get("banios"), banios));
    }

    // Combina todos los predicados con `and`
    return cb.and(predicates.toArray(new Predicate[0]));
  }
}
