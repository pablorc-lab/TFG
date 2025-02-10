import styles from "./Score.module.css"

const ScoreMiCuenta = ({miCuenta = false}) => {
  return (
    <article className={`${styles.user_score} ${miCuenta && styles.mi_cuenta}`}>
      <div>
        <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
        <h3>4.9</h3>
      </div>
      <p>- 67 opiniones</p>
    </article>
  );
}

export default ScoreMiCuenta;
