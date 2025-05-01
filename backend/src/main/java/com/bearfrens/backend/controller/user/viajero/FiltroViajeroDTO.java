package com.bearfrens.backend.controller.user.viajero;

import lombok.Getter;

import java.util.List;

@Getter
public class FiltroViajeroDTO {
  private List<String> gustos;
  private List<String> tiempo_estancia;
  private List<String> idiomas;
}
