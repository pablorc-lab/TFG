import React, { useState } from 'react';

export default function Question({ pregunta, respuesta }) {
  const [isOpen, setOpen] = useState(false); 

  return (
    <article className="question_item" onClick={() => setOpen(!isOpen)}>
      <div className="question_title">
        <h3>{pregunta}</h3>
        <img
          src={isOpen ? "/images/landing_page/faq_minus.png" : "/images/landing_page/faq_plus.png"}
          alt={isOpen ? "Icono más" : "Icono menos"}
        />      
      </div>
      {isOpen && ( 
        <div className="question_content">
          <p>{respuesta}</p>
        </div>
      )}
    </article>
  );
}