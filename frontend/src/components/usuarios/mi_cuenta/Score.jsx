import styles from "./Score.module.css"

const ScoreMiCuenta = () => {
  return (
    <article className={styles.user_score}>
      <div>
        <img src="/images/usuarios/estrella.webp" alt="Ícono de estrella" />
        <h3>4.9</h3>
      </div>
      <p>- 67 opiniones</p>
    </article>
  );
}

export default ScoreMiCuenta;
