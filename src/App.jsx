import React, { useState, useEffect } from 'react';
import api from './api/axios';
const BACKEND_URL = 'http://127.0.0.1:8000';


export default function App() {
  const [struttura, setStruttura] = useState(null);
  const [caricamento, setCaricamento] = useState(true);

  // Campi del form di prenotazione
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [ospiti, setOspiti] = useState(2);

  // Preventivo e gestione errori
  const [preventivo, setPreventivo] = useState(null);
  const [errorePreventivo, setErrorePreventivo] = useState('');

  // Dati ospite per conferma
  const [nomeOspite, setNomeOspite] = useState('');
  const [emailOspite, setEmailOspite] = useState('');
  const [telefonoOspite, setTelefonoOspite] = useState('');
  const [richiestaCulla, setRichiestaCulla] = useState(false);
  const [noteOspite, setNoteOspite] = useState('');
  const [messaggioSuccesso, setMessaggioSuccesso] = useState('');

  useEffect(() => {
    api.get('/struttura')
      .then(response => {
        setStruttura(response.data.struttura);
        setCaricamento(false);
      })
      .catch(error => {
        console.error("Errore di connessione a Laravel:", error);
        setCaricamento(false);
      });
  }, []);

  const calcolaPreventivo = async (e) => {
    e.preventDefault();
    setErrorePreventivo('');
    setMessaggioSuccesso('');

    try {
      const response = await api.post('/prenotazioni/preventivo', {
        check_in: checkIn,
        check_out: checkOut,
        ospiti: ospiti
      });
      setPreventivo(response.data);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorePreventivo(error.response.data.message);
      } else {
        setErrorePreventivo('Errore nel calcolo del preventivo. Controlla le date.');
      }
      setPreventivo(null);
    }
  };

  const inviaPrenotazione = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/prenotazioni', {
        nome_ospite: nomeOspite,
        email_ospite: emailOspite,
        telefono_ospite: telefonoOspite,
        check_in: checkIn,
        check_out: checkOut,
        numero_ospiti: ospiti,
        richiesta_culla: richiestaCulla,
        note: noteOspite
      });
      setMessaggioSuccesso(response.data.messaggio);
      setPreventivo(null);
    } catch (error) {
      alert("Errore durante l'invio della prenotazione.");
    }
  };

  if (caricamento) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-muted">
        <div className="spinner-border text-danger me-2" role="status"></div>
        Caricamento Casa Lulù...
      </div>
    );
  }

  if (!struttura) {
    return (
      <div className="container py-5 text-center text-danger">
        <h4>Impossibile connettersi al backend Laravel.</h4>
        <p>Verifica che <code>php artisan serve</code> sia attivo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-dark min-vh-100">
      {/* Navbar Minimal e Pulita */}
      <nav className="navbar navbar-light bg-white border-bottom py-3 sticky-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold text-danger fs-3 tracking-tight" style={{ letterSpacing: '-0.5px' }}>
            {struttura.nome}
          </span>
          <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small fw-medium">
            CIN: {struttura.codice_cin}
          </span>
        </div>
      </nav>

      {/* Contenuto Principale */}
      <div className="container py-4">
        {/* Titolo e Valutazioni */}
        <h1 className="h2 fw-bold mb-2">{struttura.sottotitolo}</h1>
        <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-4">
          <div className="fw-bold text-dark">
            ★ {struttura.valutazione} <span className="text-decoration-underline ms-1 text-secondary fw-normal">({struttura.numero_recensioni} recensioni)</span>
          </div>
          <span>•</span>
          <div>📍 {struttura.quartiere}, {struttura.citta}</div>
        </div>

        {/* Griglia Foto Stile Portale Turistico */}
        {struttura.foto && struttura.foto.length > 0 && (
          <div className="row g-2 mb-5 rounded-4 overflow-hidden shadow-sm" style={{ height: '420px' }}>
            <div className="col-md-7 h-100 p-0">

              <img
                src={`${BACKEND_URL}${struttura.foto[0].url}`}
                alt="Copertina"
                className="w-100 h-100 object-fit-cover hover-zoom"
                style={{ cursor: 'pointer' }}
              />

            </div>
            <div className="col-md-5 h-100 d-none d-md-block p-0 ps-2">
              <div className="row g-2 h-100">
                {struttura.foto.slice(1, 5).map((foto, idx) => (
                  <div key={idx} className="col-6 h-50">

                    <img
                      src={`${BACKEND_URL}${foto.url}`}
                      alt={foto.didascalia}
                      className="w-100 h-100 object-fit-cover rounded-2"
                      style={{ cursor: 'pointer' }}
                    />

                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Layout a Due Colonne: Info a sinistra, Box Prenotazione a destra */}
        <div className="row g-5">
          {/* Colonna Sinistra */}
          <div className="col-lg-8">
            {/* Riepilogo Posto */}
            <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
              <div>
                <h3 className="h5 fw-bold mb-1">Intero alloggio: casa vacanze</h3>
                <p className="text-muted small mb-0">
                  {struttura.ospiti_massimi} ospiti • {struttura.camere_da_letto} camera da letto • {struttura.letti} letti • {struttura.bagni} bagni
                </p>
              </div>
              <div className="bg-light rounded-circle p-3 text-danger fw-bold fs-4">🏠</div>
            </div>

            {/* Descrizione Breve */}
            <div className="border-bottom pb-4 mb-4">
              <h5 className="fw-bold mb-2">💡 Dettagli in evidenza</h5>
              <p className="text-secondary small leading-relaxed">{struttura.descrizione_breve}</p>
            </div>

            {/* Spazio */}
            <div className="border-bottom pb-4 mb-4">
              <h5 className="fw-bold mb-3">Lo Spazio</h5>
              <p className="text-secondary small" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                {struttura.descrizione_spazio}
              </p>
            </div>

            {/* Servizi */}
            <div className="border-bottom pb-4 mb-4">
              <h5 className="fw-bold mb-4">Cosa troverai</h5>
              <div className="row g-3">
                {struttura.servizi.map((servizio) => (
                  <div key={servizio.id} className="col-md-6 d-flex align-items-center gap-2 text-secondary small">
                    <span className="text-danger fw-bold">✓</span>
                    <span>{servizio.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonna Destra: Card Preventivo / Prenotazione */}
          <div className="col-lg-4">
            <div className="card shadow border-0 rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <div>
                  <span className="fs-3 fw-bold text-dark">€{struttura.prezzo_base_notte}</span>
                  <span className="text-muted small"> / notte</span>
                </div>
                <div className="small fw-bold bg-light px-2 py-1 rounded-2">★ {struttura.valutazione}</div>
              </div>

              {messaggioSuccesso ? (
                <div className="alert alert-success text-center small py-3 rounded-3" role="alert">
                  {messaggioSuccesso}
                </div>
              ) : (
                <form onSubmit={preventivo ? inviaPrenotazione : calcolaPreventivo}>
                  <div className="border rounded-3 p-2 mb-3 bg-light">
                    <div className="row g-0">
                      <div className="col-6 border-end pe-2">
                        <label className="form-label text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Check-in</label>
                        <input
                          type="date"
                          required
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none"
                        />
                      </div>
                      <div className="col-6 ps-2">
                        <label className="form-label text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Check-out</label>
                        <input
                          type="date"
                          required
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-3 p-2 mb-3 bg-light">
                    <label className="form-label text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>Ospiti</label>
                    <select
                      value={ospiti}
                      onChange={(e) => setOspiti(Number(e.target.value))}
                      className="form-select form-select-sm border-0 bg-transparent p-0 shadow-none"
                    >
                      {[...Array(struttura.ospiti_massimi)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} ospit{i > 0 ? 'i' : 'e'}</option>
                      ))}
                    </select>
                  </div>

                  {errorePreventivo && (
                    <div className="alert alert-danger py-2 small mb-3 text-center" role="alert">
                      {errorePreventivo}
                    </div>
                  )}

                  {!preventivo ? (
                    <button type="submit" className="btn btn-danger w-100 py-3 fw-semibold rounded-3 shadow-sm">
                      Verifica disponibilità
                    </button>
                  ) : (
                    <div>
                      <div className="bg-light p-3 rounded-3 small mb-3 border">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary">€{preventivo.tariffa_media_notte} × {preventivo.notti} notti</span>
                          <span className="fw-semibold">€{preventivo.subtotale_notti}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary">Costi di pulizia</span>
                          <span className="fw-semibold">€{preventivo.costo_pulizie}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-secondary">Tassa di soggiorno</span>
                          <span className="fw-semibold">€{preventivo.tassa_soggiorno}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between fw-bold fs-6 text-dark">
                          <span>Totale complessivo</span>
                          <span>€{preventivo.totale_prezzo}</span>
                        </div>
                      </div>

                      <div className="vstack gap-2 mb-3">
                        <input
                          type="text" required placeholder="Nome e Cognome"
                          value={nomeOspite} onChange={(e) => setNomeOspite(e.target.value)}
                          className="form-control form-control-sm py-2"
                        />
                        <input
                          type="email" required placeholder="Indirizzo email"
                          value={emailOspite} onChange={(e) => setEmailOspite(e.target.value)}
                          className="form-control form-control-sm py-2"
                        />
                        <input
                          type="tel" required placeholder="Numero di telefono"
                          value={telefonoOspite} onChange={(e) => setTelefonoOspite(e.target.value)}
                          className="form-control form-control-sm py-2"
                        />
                        <div className="form-check small text-secondary mt-1">
                          <input type="checkbox" className="form-check-input" id="culla" checked={richiestaCulla} onChange={(e) => setRichiestaCulla(e.target.checked)} />
                          <label className="form-check-label" htmlFor="culla">Richiedi culla e seggiolone gratuiti</label>
                        </div>
                        <textarea
                          placeholder="Note o orario previsto di arrivo..."
                          value={noteOspite} onChange={(e) => setNoteOspite(e.target.value)}
                          className="form-control form-control-sm" rows="2"
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-danger w-100 py-3 fw-semibold rounded-3 shadow-sm mb-2">
                        Invia richiesta di prenotazione
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreventivo(null)}
                        className="btn btn-link text-muted small w-100 text-decoration-none"
                      >
                        Indietro / Modifica date
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sezione Recensioni */}
        <div className="mt-5 pt-5 border-top">
          <h3 className="h4 fw-bold mb-4 d-flex align-items-center gap-2">
            <span>★</span> {struttura.valutazione} • {struttura.numero_recensioni} recensioni verificate
          </h3>
          <div className="row g-4">
            {struttura.recensioni.map((recensione) => (
              <div key={recensione.id} className="col-md-6">
                <div className="p-4 border rounded-4 bg-light h-100 shadow-sm">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style={{ width: '45px', height: '45px' }}>
                      {recensione.nome_ospite.charAt(0)}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{recensione.nome_ospite}</h6>
                      <small className="text-muted">{recensione.periodo_soggiorno}</small>
                    </div>
                  </div>
                  <p className="text-secondary small mb-0 leading-relaxed">"{recensione.commento}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}