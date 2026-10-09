import React, { useState } from 'react';
import { Flame, ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { ELEMENTS, PHASE3_STATES, predictSupremeSpells } from '../utils/timoLogic';

export default function SupremeSpellPredictor({ phase, groupSize }) {
  const [initialP2Element, setInitialP2Element] = useState('fire');

  if (phase === 4) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={20} />
          Fase 4: Timö desactiva sus Hechizos Supremos
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px' }}>
          En la Fase 4, Timö ya no usa Erupção, Tsunami, Terremoto ni Tempestade. En su lugar, ataca con <strong>Choque Infernal</strong> (hasta 4 ataques a distancia con rebotes) y <strong>Possessão de Alma</strong> en cuerpo a cuerpo.
        </p>
      </div>
    );
  }

  const predictions = predictSupremeSpells(initialP2Element, phase, 4, groupSize);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(249, 115, 22, 0.15)', padding: '8px', borderRadius: '10px' }}>
            <Flame size={22} color="#f97316" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Predictor del Hechizo Supremo & Estrategia de Esquiva
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Predice qué Hechizo Supremo lanzará Timö en las próximas rondas y cómo posicionarse para no recibir daño.
            </p>
          </div>
        </div>

        {/* Initial Element Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            Elemento Inicial de Timö (Ronda 1):
          </label>
          <select
            value={initialP2Element}
            onChange={(e) => setInitialP2Element(e.target.value)}
            className="glass-input"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            {ELEMENTS.map(e => (
              <option key={e.id} value={e.id} style={{ background: '#160e22', color: '#fff' }}>
                {e.icon} {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rounds Predictions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {predictions.map((item) => (
          <div 
            key={item.round}
            style={{
              background: 'rgba(15, 10, 25, 0.6)',
              borderRadius: '14px',
              padding: '16px',
              border: `1px solid ${item.element.color}40`,
              boxShadow: `0 4px 20px ${item.element.color}15`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Ronda {item.round} {item.round === 1 ? '(Sin supremo turno 1)' : ''}
              </span>
              <span 
                className={`element-badge ${item.element.id}`}
                style={{ fontSize: '0.78rem', padding: '3px 8px' }}
              >
                {item.element.icon} {item.element.name}
              </span>
            </div>

            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              ⚡ {item.spell.name}
            </div>

            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '8px' }}>
              🎯 Alcance: <strong>{item.spell.target}</strong>
            </div>

            <div style={{
              background: 'rgba(52, 211, 153, 0.1)',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              fontSize: '0.78rem',
              color: '#a7f3d0'
            }}>
              💡 <strong>Cómo esquivar:</strong> {item.spell.advice}
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Rule Summary Box */}
      <div style={{ marginTop: '20px', background: 'rgba(192, 132, 252, 0.08)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(192, 132, 252, 0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AlertCircle size={20} color="#c084fc" />
        <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
          {phase === 1 && <span><strong>Patrón Fase 1:</strong> Los hechizos supremos avanzan normalmente (Fogo &rarr; Água &rarr; Terra &rarr; Ar).</span>}
          {phase === 2 && <span><strong>Patrón Fase 2:</strong> Al haber 7 avances por ronda (con 6 jugadores), los hechizos supremos siguen orden <strong>inverso</strong>: Ar &rarr; Terra &rarr; Água &rarr; Fogo.</span>}
          {phase === 3 && <span><strong>Patrón Fase 3:</strong> Al haber 7 avances sobre 8 tótems, los hechizos supremos se <strong>repiten en parejas</strong>: Ar &rarr; Ar &rarr; Terra &rarr; Terra &rarr; Água &rarr; Água &rarr; Fogo &rarr; Fogo.</span>}
        </span>
      </div>

    </div>
  );
}
