package com.bearfrens.backend.controller.user.anfitrion;

import lombok.Getter;

import java.util.List;

@Getter
public class FiltroAnfitrionDTO {
  private List<String> gustos;
  private Integer max;
  private Integer min;
  private Integer viajeros;
  private Integer habitaciones;
  private Integer camas;
  private Integer banios;
  private List<String> idiomas;
  private String ciudad;
  private String provincia;

  @Override
  public String toString() {
    return "FiltroAnfitrionDTO{" +
      "gustos=" + gustos +
      ", max=" + max +
      ", min=" + min +
      ", viajeros=" + viajeros +
      ", habitaciones=" + habitaciones +
      ", camas=" + camas +
      ", banios=" + banios +
      ", idiomas=" + idiomas +
      ", ciudad=" + ciudad +
      ", provincia=" + provincia +
      '}';
  }
}
