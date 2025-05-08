package com.bearfrens.backend.entity.foros;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Foros {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // tipoUsuario: 1 = Anfitrión, 2 = Viajero.
  // Este campo se usa para distinguir entre los dos tipos de usuario en el sistema.
  @Column(name = "tipo_usuario", nullable = false) // Tipo de usuario
  private int tipoUsuario; // 1 = Anfitrión, 2 = Viajero

  @Column(name = "usuario_id", nullable = false) // ID Usuario
  private Long usuarioID;

  @Column
  private Integer num_respuestas = 0;

  @ManyToOne
  @JoinColumn(name = "foro_padre_id", nullable = true)
  private Foros foroPadre;

  @OneToMany(mappedBy = "foroPadre", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Foros> respuestas = new ArrayList<>();

  @Lob // Large Object
  @Column(columnDefinition = "TEXT", nullable = false)
  private String descripcion;

  @Column
  private LocalDate fecha;

  @Transient // Se obtiene dinámicamente
  private String usuario_profile_img; // Imagen de perfil del usuario

  @Transient // Se obtiene dinámicamente
  private String usuario_nombre;

  @Transient // Se obtiene dinámicamente
  private String usuario_private_id; // ID privado del usuario
}
