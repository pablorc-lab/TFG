/* ===========================================================================
  Este componente se encargará de crear todas las funciones correspondientes
  a la verificación de los distintos campos del "log in" o del "registri"
============================================================================= */
export const validateEmail = (email) => {
  // Expresión regular
	var RegexEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  return RegexEmail.test(email);
}

export const validateNames = (name) => {
  const RegexName = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  return RegexName.test(name);
}

export const validateIdUser = (id) => {
  const RegexID = /^[a-zA-Z0-9]+$/;
  return RegexID.test(id);
}

export const validateAge = (date) => {
  const today = new Date();
  const inputDate = new Date(date);

  // Verificar que la fecha ingresada no sea futura
  return inputDate <= today;
}
