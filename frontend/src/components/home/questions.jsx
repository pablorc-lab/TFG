import React, { useState } from 'react';

export default function Question({styles,pregunta, respuesta }) {
  const [isOpen, setOpen] = useState(false); 
 
  return (
    <article className={styles.question_item}>

      <div className={`${styles.question_title} ${isOpen && styles.open}`} onClick={() => setOpen(!isOpen)}>
      <h3>{pregunta}</h3>
        <img
          src={isOpen ? "/images/landing_page/faq_minus.png" : "/images/landing_page/faq_plus.png"}
          alt={isOpen ? "Icono más" : "Icono menos"}
        />      
      </div>
      <div className={`${styles.question_content} ${isOpen && styles.open}`}>
        <p>{respuesta}</p>
      </div>
    </article>
  );
}