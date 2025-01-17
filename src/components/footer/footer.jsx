import styles from "./footer.module.css"

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        {/*Logo*/}
        <figure className={styles.logo_footer}>
          <img
            src="images/logos/logo_blanco.png"
            alt="Logo Bearfrens"
            width={150}
          />
          <figcaption>Bearfrens</figcaption>
        </figure>
        {/*Información de contacto*/}
        <div className={styles.contact_info}>
          <div className={styles.text_info}>
            <p>Email: <strong>pabloramblado@correo.ugr.es</strong></p>
            <p>Teléfono: <strong>+34 666-666-666</strong></p>
          </div>
          <div className={styles.social_media}>
            <img
              src="./images/logos/instagram_logo.png"
              alt="instagram_logo"
              width={50}
            />
            <img src="./images/logos/x_logo.png" alt="x_logo" width={50} />
            <img
              src="./images/logos/youtube_logo.png"
              alt="youtube_logo"
              width={50}
            />
            <img
              src="./images/logos/facebook_logo.png"
              alt="facebook_logo"
              width={50}
            />
          </div>
        </div>
        {/*Políticias de privacidad*/}
        <div className={styles.privacy_policy}>
          <a href="/politicas-privacidad">Políticas de Privacidad</a>
        </div>
      </footer>
    </>
  )
}