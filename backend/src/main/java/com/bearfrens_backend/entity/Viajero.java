package com.bearfrens_backend.entity;

public class Viajero extends Usuario{
  public final String rol_user = "viajero";

  public Viajero(String privateID, String nombre, String apellido, int edad, String email, String password) {
    super(privateID, nombre, apellido, edad, email, password);
  }

  public String getRol_user() {return rol_user;}

  @Override
  public String toString() {
    return super.toString() + " rol_user=" + rol_user + '\'' + ",\n}";
  }
}
