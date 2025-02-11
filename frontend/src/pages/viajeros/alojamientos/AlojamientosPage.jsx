import AnfProfilesGallery from '../../../components/viajeros/alojamientos/AnfProfilesGallery';
import Footer from '../../../components/footer/footer';
import ViajerosFinalHeader from '../../../components/viajeros/header/ViajerosFinalHeader';

export default function AlojamientosPage() {

  return(
    <>
      <title>Alojamientos | Viajeros</title>
      {/* CABECERA */}
      {<ViajerosFinalHeader/>}

      {/* PERFILES DE VIAJEROS  */}
      <AnfProfilesGallery/>

      {/*Pie de pagina*/}
      <Footer/>
    </>
  )
}