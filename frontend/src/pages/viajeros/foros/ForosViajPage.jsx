import Foros from "../../../components/foros/foros";
import ViajerosFinalHeader from "../../../components/viajeros/header/ViajerosFinalHeader";
import Footer from "../../../components/footer/footer";

export default function ForosViajPage() {
  return (
    <>
      <title>Foros</title>

      {/* CABECERA */}
      <ViajerosFinalHeader defaultActive={"foros"} />

      <Foros tipoUsuario={2}/>

      <Footer />
    </>
  )
}
