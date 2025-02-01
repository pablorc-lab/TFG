import AnfProfilesGallery from '../../../components/viajeros/alojamientos/AnfProfilesGallery';
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/alojamientos/ViajerosFinalHeader';
import { useEffect } from 'react';

export default function Viajeros_Alojamientos({ defaultActiveSection = "alojamientos" }) {
  useEffect(() => {
    // Cambia el título solo al montar el componente
    document.title = "Viajeros Alojamientos | Beafrens";
  }, []);

  return(
    <>
      {/* CABECERA */}
      {<ViajerosFinalHeader defaultActiveSection={defaultActiveSection}/>}

      {/* PERFILES DE VIAJEROS  */}
      <AnfProfilesGallery />

      {/*Pie de pagina*/}
      <Footer/>
    </>
  )
}