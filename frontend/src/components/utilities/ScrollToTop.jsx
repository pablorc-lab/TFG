import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Cada vez que el path name cambie, nos posiciona en la parte superior de la web
// Esto es debido a que <React Router> no cambia la posición de la página al navegar
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
