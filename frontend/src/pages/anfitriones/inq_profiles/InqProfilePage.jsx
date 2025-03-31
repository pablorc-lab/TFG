import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../../components/footer/footer";
import UserPage from "../../../components/usuarios/user_page/UserPage";
import ViajeroService from "../../../services/users/ViajeroService";

export default function AnfProfilePage() {
  const [viajeroInfo, SetViajeroInfo] = useState([]);
  const [valoraciones, setValoraciones] = useState([]);
  const [Gustos_imgs, setGustos_imgs] = useState([]);
  const [idiomasUser, setIdiomasUser] = useState([]);

  const location = useLocation();
  const id = location.state?.id;

  // Obtener datos del usuario si no hay y se tiene su id
  useEffect(() => {
    if (id && anfitrionInfo.length === 0) {
      ViajeroService.getById(id).then(response => {
        console.log(response.data);
        SetViajeroInfo(response.data);
        setValoraciones(response.data.valoraciones);
        setIdiomasUser(response.data.biografia?.idiomas ? response.data.biografia.idiomas.trim().split(",") : ["Español"]);

        setGustos_imgs([
          response.data.usuario.gusto1,
          response.data.usuario.gusto2,
          response.data.usuario.gusto3
        ].filter(img => img != null));

      }
      ).catch(error => console.error("No se encontró el usuario " + error));
    }
  }, [id, anfitrionInfo])


  return (
    <>
      <UserPage
        usuarioData={viajeroInfo}
        valoraciones={valoraciones}
        Gustos_imgs={Gustos_imgs}
        idiomasUser={idiomasUser}
      />
      <Footer />
    </>
  )
}