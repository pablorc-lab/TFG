import React, { useState } from 'react';

export default function Question({ pregunta, respuesta }) {
  const [isOpen, setOpen] = useState(false); 

  return (
    <article className="question_item">
      <div className={`question_title ${isOpen ? 'open' : ''}`} onClick={() => setOpen(!isOpen)}>
      <h3>{pregunta}</h3>
        <img
          src={isOpen ? "/images/landing_page/faq_minus.png" : "/images/landing_page/faq_plus.png"}
          alt={isOpen ? "Icono más" : "Icono menos"}
        />      
      </div>
      <div className={`question_content ${isOpen ? 'open' : ''}`}>
        <p>{respuesta}</p>
      </div>
    </article>
  );
}