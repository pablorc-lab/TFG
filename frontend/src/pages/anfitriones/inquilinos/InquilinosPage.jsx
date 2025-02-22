import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader"
import ViajProfilesGallery from "../../../components/anfitriones/inquilinos/ViajProfilesGallery"

export default function InquilinosPage() {
  return (
    <>
      <title>Inquilinos | Anfitriones</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader />

      {/* PERFILES DE VIAJEROS  */}
      <ViajProfilesGallery/>
    </>
  )
}
