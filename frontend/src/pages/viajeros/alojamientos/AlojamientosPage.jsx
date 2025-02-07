import AnfProfilesGallery from '../../../components/viajeros/alojamientos/AnfProfilesGallery';
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/alojamientos/ViajerosFinalHeader';

export default function AlojamientosPage({ defaultActiveSection = "alojamientos" }) {

  return(
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader defaultActiveSection={defaultActiveSection}/>}

      {/* PERFILES DE VIAJEROS  */}
      <AnfProfilesGallery />

      {/*Pie de pagina*/}
      <Footer/>
    </>
  )
}