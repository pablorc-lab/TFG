import Foros from "../../../components/foros/foros";
import AnfitrionFinalHeader from "../../../components/anfitriones/header/AnfitrionFinalHeader";
import Footer from "../../../components/footer/footer";

export default function ForosAnfPage() {
  return (
    <>
      <title>Foros</title>

      {/* CABECERA */}
      <AnfitrionFinalHeader defaultActive={"foros"} />

      <Foros tipoUsuario={2}/>

      <Footer />
    </>
  )
}