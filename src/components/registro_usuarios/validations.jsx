/* ===========================================================================
  Este componente se encargará de crear todas las funciones correspondientes
  a la verificación de los distintos campos del "log in" o del "registri"
============================================================================= */
export const validateEmail = (email) => {
  // Expresión regular
	var RegexEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  return RegexEmail.test(email);
}
