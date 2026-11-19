import React from 'react';

// Questo è un componente separato che accetta dei "dati" (chiamati props)
export default function CardCasa({ nome, prezzo, citta }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px', maxWidth: '300px', margin: '10px auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#e11d48' }}>{nome}</h3>
      <p style={{ margin: '0 0 4px 0', color: '#666' }}>📍 {citta}</p>
      <p style={{ margin: '0', fontWeight: 'bold' }}>€{prezzo} / notte</p>
    </div>
  );
}