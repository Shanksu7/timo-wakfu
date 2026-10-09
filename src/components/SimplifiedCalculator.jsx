import React, { useState } from 'react';
import { Target, Zap, Shield, AlertTriangle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { ELEMENTS, PHASE3_STATES, COUNTER_MAP, ELEMENT_MAP, SUPREME_SPELLS, getTimoStateAfterAdvances } from '../utils/timoLogic';

export default function SimplifiedCalculator({ phase, groupSize = 6 }) {
  // Primary input: Timö's current element/state
  const [selectedElementId, setSelectedElementId] = useState('water'); // Phase 1 & 2 default
  const [selectedP3Index, setSelectedP3Index] = useState(2); // Phase 3 default (Normal Water)
  
  // Turn offset: default 2 (Positioner to Attacker / last 2 players)
  const [turnOffset, setTurnOffset] = useState(2);

  if (phase === 4) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '28px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(225, 29, 72, 0.15)', display: 'inline-flex', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
          <Zap size={32} color="#f43f5e" />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e', marginBottom: '8px' }}>
          Fase 4: Duelo Final contra Timö
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 16px auto', lineHeight: '1.6' }}>
          En esta fase <strong>Timö sale de los tótems y es vulnerable a cualquier tipo de daño</strong>. Ya no usa Hechizos Supremos (Ultimate).
        </p>
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-block', textAlign: 'left' }}>
          <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '4px' }}>⚠️ Reglas de Supervivencia:</strong>
          <ul style={{ fontSize: '0.88rem', color: '#fecdd3', paddingLeft: '18px' }}>
            <li>No pises NINGÚN tótem: Todos causan 50% de daño Max HP.</li>
            <li>Timö se cura 1000% (10 veces el daño que causa). Evita recibir golpes.</li>
          </ul>
        </div>
      </div>
    );
  }

  // --- CALCULATION LOGIC ---

  // 1. Determine current Timö base element & state
  let currentBaseElementId = selectedElementId;
  let isCurrentCursed = false;

  if (phase === 3) {
    const p3State = PHASE3_STATES[selectedP3Index];
    currentBaseElementId = p3State.baseElement;
    isCurrentCursed = p3State.isCursed;
  }

  // 2. Counter Element needed by attacker
  const counterId = COUNTER_MAP[currentBaseElementId];
  const counterElement = ELEMENT_MAP[counterId];

  // 3. Advances calculation
  // In Phase 1: totems don't advance between player turns in the same round (advances = 0)
  // In Phase 2 & 3: totems advance by turnOffset
  const advances = phase === 1 ? 0 : turnOffset;

  // 4. Required initial tile where player MUST be placed RIGHT NOW
  let tileNowElement = null;

  if (phase === 1) {
    // In Phase 1, just place on the counter element
    tileNowElement = counterElement;
  } else if (phase === 2) {
    const counterIdx = ELEMENTS.findIndex(e => e.id === counterId);
    let tileIdx = (counterIdx - advances) % 4;
    if (tileIdx < 0) tileIdx += 4;
    tileNowElement = ELEMENTS[tileIdx];
  } else if (phase === 3) {
    // Phase 3: must land on non-cursed counter state (indices: Fire=0, Water=2, Earth=4, Air=6)
    const reqP3Idx = PHASE3_STATES.findIndex(s => s.baseElement === counterId && !s.isCursed);
    let tileP3Idx = (reqP3Idx - advances) % 8;
    if (tileP3Idx < 0) tileP3Idx += 8;
    tileNowElement = PHASE3_STATES[tileP3Idx];
  }

  // 5. Timö's Ultimate Spell next round
  // For Phase 1: 1 advance per round
  // For Phase 2: (groupSize + 1) advances per round = 7 advances
  // For Phase 3: 7 advances over 8 states
  const timoAdvForUltimate = phase === 1 ? 1 : (groupSize + 1);
  const futureTimoState = getTimoStateAfterAdvances(selectedElementId, selectedP3Index, timoAdvForUltimate, phase);
  const nextUltimateSpell = SUPREME_SPELLS[futureTimoState.baseElementId];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
      
      {/* Step 1: Input Selection Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#c084fc" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            ¿En qué elemento está Timö AHORA MISMO?
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Haz clic en el elemento actual de Timö para calcular al instante la posición y el próximo Ultimate.
        </p>
      </div>

      {/* Element Selector Buttons Grid */}
      {phase !== 3 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {ELEMENTS.map(elem => {
            const isSelected = selectedElementId === elem.id;
            return (
              <button
                key={elem.id}
                onClick={() => setSelectedElementId(elem.id)}
                style={{
                  background: isSelected ? elem.bg : 'rgba(15, 10, 25, 0.5)',
                  border: isSelected ? `2px solid ${elem.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? `0 0 20px ${elem.color}40` : 'none',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '2rem' }}>{elem.icon}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                  {elem.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Phase 3 Selector: 8 States */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '24px' }}>
          {PHASE3_STATES.map(s => {
            const isSelected = selectedP3Index === s.index;
            return (
              <button
                key={s.index}
                onClick={() => setSelectedP3Index(s.index)}
                style={{
                  background: isSelected ? (s.isCursed ? 'rgba(239, 68, 68, 0.2)' : 'rgba(192, 132, 252, 0.25)') : 'rgba(15, 10, 25, 0.5)',
                  border: isSelected ? `2px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 15px ${s.color}40` : 'none',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: s.isCursed ? '#fca5a5' : '#ffffff' }}>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Offset Selector (Phase 2 & 3) */}
      {phase !== 1 && (
        <div style={{ background: 'rgba(15, 10, 25, 0.4)', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
            ⏱️ Distancia de turnos (Posicionador → Atacante):
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { val: 1, label: '1 Turno después' },
              { val: 2, label: '2 Turnos (Recomendado)' },
              { val: 3, label: '3 Turnos después' },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setTurnOffset(opt.val)}
                style={{
                  background: turnOffset === opt.val ? 'rgba(192, 132, 252, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: turnOffset === opt.val ? '1px solid #c084fc' : '1px solid transparent',
                  color: turnOffset === opt.val ? '#ffffff' : '#94a3b8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN RESULT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* CARD 1: WHERE TO PLACE CHARACTER RIGHT NOW */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
          borderRadius: '16px',
          padding: '22px',
          border: '1.5px solid rgba(52, 211, 153, 0.5)',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={20} color="#34d399" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                1. CASILLA DONDE DEBES DEJAR AL PERSONAJE AHORA:
              </span>
            </div>

            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: tileNowElement?.color || '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
              <span style={{ fontSize: '2.2rem' }}>{tileNowElement?.icon}</span>
              <span>{tileNowElement?.name}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#d1fae5', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '10px', marginTop: '12px' }}>
            🛡️ Dará energía <strong>{counterElement.name}</strong> ({counterElement.icon}) para golpear a Timö cuando empiece el turno del atacante.
          </div>
        </div>

        {/* CARD 2: NEXT SUPREME SPELL (ULTIMATE) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(194, 65, 12, 0.25) 100%)',
          borderRadius: '16px',
          padding: '22px',
          border: '1.5px solid rgba(249, 115, 22, 0.5)',
          boxShadow: '0 8px 30px rgba(249, 115, 22, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={20} color="#fb923c" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffedd5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                2. PRÓXIMO ULTIMATE DE TIMÖ (SIGUIENTE RONDA):
              </span>
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
              <span>⚡ {nextUltimateSpell?.name}</span>
              <span style={{ fontSize: '0.85rem', color: '#fdba74', fontWeight: 600 }}>({futureTimoState.element.name})</span>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#ffedd5', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '10px', marginTop: '12px' }}>
            💡 <strong>Cómo esquivarlo:</strong> {nextUltimateSpell?.advice}
          </div>
        </div>

      </div>

    </div>
  );
}
