import styles from "./Score.module.css"

const ScoreMiCuenta = ({miCuenta = false, nota_media = 0.1, valoraciones = []}) => {
  return (
    <article className={`${styles.user_score} ${miCuenta && styles.mi_cuenta}`}>
      <div>
        <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
        <h3>{nota_media % 1 === 0 ? `${nota_media}.0` : nota_media}</h3>
        </div>
      <p>- {valoraciones.length} opiniones</p>
    </article>
  );
}

export default ScoreMiCuenta;
