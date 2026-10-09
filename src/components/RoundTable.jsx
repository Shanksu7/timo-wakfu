import React, { useState } from 'react';
import { ELEMENTS, PHASE3_STATES, COUNTER_MAP, ELEMENT_MAP, SUPREME_SPELLS, getTimoStateAfterAdvances } from '../utils/timoLogic';
import { Shield, Zap, AlertTriangle, Sparkles, CheckCircle2, User } from 'lucide-react';

const PLAYER_ROLES = [
  { num: 1, name: 'Soporte 1', badge: 'S1', color: '#38bdf8' },
  { num: 2, name: 'Soporte 2', badge: 'S2', color: '#38bdf8' },
  { num: 3, name: 'Soporte 3', badge: 'S3', color: '#38bdf8' },
  { num: 4, name: 'Posicionador', badge: 'POS', color: '#c084fc' },
  { num: 5, name: 'DPS 1', badge: 'DPS1', color: '#f43f5e' },
  { num: 6, name: 'DPS 2', badge: 'DPS2', color: '#f43f5e' },
];

export default function RoundTable({ phase, groupSize = 6 }) {
  const [selectedElementId, setSelectedElementId] = useState('fire'); // Phase 1 & 2 default
  const [selectedP3Index, setSelectedP3Index] = useState(0); // Phase 3 default (Normal Fire)

  if (phase === 4) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(225, 29, 72, 0.15)', display: 'inline-flex', padding: '14px', borderRadius: '50%', marginBottom: '12px' }}>
          <Zap size={36} color="#f43f5e" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f43f5e', marginBottom: '8px' }}>
          Fase 4: Duelo Final contra Timö
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 16px auto', lineHeight: '1.6' }}>
          En esta fase <strong>Timö ya no usa tótems y es vulnerable a cualquier tipo de daño</strong>. Tampoco usa Hechizos Supremos (Ultimates).
        </p>
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-block', textAlign: 'left' }}>
          <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '6px', fontSize: '0.95rem' }}>⚠️ Reglas de Supervivencia:</strong>
          <ul style={{ fontSize: '0.9rem', color: '#fecdd3', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>¡NO PISES TÓTEMS!</strong> Todos causan 50% de daño de vida máxima al iniciar turno sobre ellos.</li>
            <li>Timö tiene <strong>1000% Robo de Vida</strong> (se cura 10x del daño causado). Mantente alejado si no vas a atacar.</li>
          </ul>
        </div>
      </div>
    );
  }

  // Calculate table rows for each player (1 to groupSize)
  const playersRows = Array.from({ length: groupSize }, (_, i) => {
    const playerNum = i + 1;
    const roleInfo = PLAYER_ROLES[i] || { name: `Jugador ${playerNum}`, badge: `J${playerNum}`, color: '#38bdf8' };
    
    // Advances from start of round when Timö starts turn 0:
    // In Phase 1: 0 advances during players' turns
    // In Phase 2 & 3: playerNum advances (1 after Timö, 2 after P1, etc.)
    const advances = phase === 1 ? 0 : playerNum;

    // Timö's state during this player's turn
    const timoState = getTimoStateAfterAdvances(selectedElementId, selectedP3Index, advances, phase);
    
    // Counter element needed by player to deal damage
    const counterId = COUNTER_MAP[timoState.baseElementId];
    const counterElement = ELEMENT_MAP[counterId];

    // Required tile element/state where player MUST be positioned BEFORE the advances
    let tileNow = null;

    if (phase === 1) {
      tileNow = counterElement;
    } else if (phase === 2) {
      const counterIdx = ELEMENTS.findIndex(e => e.id === counterId);
      let tileIdx = (counterIdx - advances) % 4;
      if (tileIdx < 0) tileIdx += 4;
      tileNow = ELEMENTS[tileIdx];
    } else if (phase === 3) {
      // Must land on non-cursed counter state
      const reqP3Idx = PHASE3_STATES.findIndex(s => s.baseElement === counterId && !s.isCursed);
      let tileP3Idx = (reqP3Idx - advances) % 8;
      if (tileP3Idx < 0) tileP3Idx += 8;
      tileNow = PHASE3_STATES[tileP3Idx];
    }

    return {
      playerNum,
      roleInfo,
      advances,
      timoState,
      counterElement,
      tileNow
    };
  });

  // --- ULTIMATE SPELL CALCULATION FOR CURRENT ROUND ---
  // Phase 1: same element (advances = 0)
  // Phase 2 & 3: next element (advances = 1)
  const ultimateAdvances = phase === 1 ? 0 : 1;
  const currentRoundTimoState = getTimoStateAfterAdvances(selectedElementId, selectedP3Index, ultimateAdvances, phase);
  const currentUltimateSpell = SUPREME_SPELLS[currentRoundTimoState.baseElementId];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '28px', marginBottom: '24px' }}>
      
      {/* Selector Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Sparkles size={22} color="#c084fc" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
            Selecciona el Elemento donde INICIA Timö la ronda:
          </h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Haz clic en el tótem de Timö al iniciar la ronda para ver la **tabla completa de posiciones** de los integrantes del grupo.
        </p>
      </div>

      {/* Selector Buttons */}
      {phase !== 3 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {ELEMENTS.map(elem => {
            const isSelected = selectedElementId === elem.id;
            return (
              <button
                key={elem.id}
                onClick={() => setSelectedElementId(elem.id)}
                style={{
                  background: isSelected ? elem.bg : 'rgba(15, 10, 25, 0.5)',
                  border: isSelected ? `2.5px solid ${elem.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? `0 0 24px ${elem.color}50` : 'none',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '2.2rem' }}>{elem.icon}</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                  {elem.name}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Phase 3 States (8 buttons) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '28px' }}>
          {PHASE3_STATES.map(s => {
            const isSelected = selectedP3Index === s.index;
            return (
              <button
                key={s.index}
                onClick={() => setSelectedP3Index(s.index)}
                style={{
                  background: isSelected ? (s.isCursed ? 'rgba(239, 68, 68, 0.25)' : 'rgba(192, 132, 252, 0.25)') : 'rgba(15, 10, 25, 0.5)',
                  border: isSelected ? `2.5px solid ${s.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? `0 0 18px ${s.color}50` : 'none',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: s.isCursed ? '#fca5a5' : '#ffffff' }}>
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* SINGLE HERO ULTIMATE BANNER (CURRENT ROUND) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(194, 65, 12, 0.28) 100%)',
        borderRadius: '16px',
        padding: '20px',
        border: '1.5px solid rgba(249, 115, 22, 0.5)',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 300px' }}>
          <div style={{ background: 'rgba(249, 115, 22, 0.25)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.5)' }}>
            <Zap size={28} color="#fb923c" />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#fdba74', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
              ULTIMATE DE LA RONDA ACTUAL:
            </span>
            <strong style={{ fontSize: '1.35rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ {currentUltimateSpell?.name} 
              <span style={{ fontSize: '0.9rem', color: '#fdba74', fontWeight: 600 }}>({currentRoundTimoState.element.name})</span>
            </strong>
            <div style={{ fontSize: '0.85rem', color: '#ffedd5', marginTop: '4px' }}>
              💡 <strong>Cómo esquivarlo:</strong> {currentUltimateSpell?.advice}
            </div>
          </div>
        </div>

        {currentUltimateSpell?.image && (
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)', background: '#000', flexShrink: 0 }}>
            <img 
              src={currentUltimateSpell.image} 
              alt={`Área de ${currentUltimateSpell.name}`}
              style={{ maxHeight: '100px', maxWidth: '180px', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* THE MAIN POSITIONING TABLE */}
      <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: 'rgba(30, 20, 48, 0.9)', color: '#c084fc', borderBottom: '2px solid rgba(192, 132, 252, 0.3)', fontSize: '0.88rem' }}>
              <th style={{ padding: '14px 16px', width: '22%' }}>👤 Rol / Integrante</th>
              <th style={{ padding: '14px 16px', width: '23%' }}>👑 Estado de Timö</th>
              <th style={{ padding: '14px 16px', width: '23%' }}>🎯 Energía Necesaria</th>
              <th style={{ padding: '14px 16px', width: '32%' }}>📍 Casilla donde DEBE quedar colocación</th>
            </tr>
          </thead>
          <tbody>
            {playersRows.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr 
                  key={row.playerNum}
                  style={{
                    background: isEven ? 'rgba(15, 10, 25, 0.4)' : 'rgba(22, 14, 34, 0.6)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {/* Player Role Column */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: `${row.roleInfo.color}25`, border: `1px solid ${row.roleInfo.color}60`, minWidth: '40px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: row.roleInfo.color, fontSize: '0.8rem', padding: '0 6px' }}>
                        {row.roleInfo.badge}
                      </div>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: '0.98rem' }}>{row.roleInfo.name}</strong>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8' }}>Turno {row.playerNum} {phase !== 1 ? `(${row.advances} Avances)` : ''}</span>
                      </div>
                    </div>
                  </td>

                  {/* Timö State Column */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, color: row.timoState.element.color }}>
                      <span style={{ fontSize: '1.4rem' }}>{row.timoState.element.icon}</span>
                      <span>{row.timoState.element.name}</span>
                    </div>
                  </td>

                  {/* Counter Energy Column */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, color: row.counterElement.color }}>
                      <span style={{ fontSize: '1.4rem' }}>{row.counterElement.icon}</span>
                      <span>Energía {row.counterElement.name}</span>
                    </div>
                  </td>

                  {/* Required Starting Tile Column (HIGHLIGHTED) */}
                  <td style={{ padding: '16px' }}>
                    <div style={{
                      background: `linear-gradient(135deg, ${row.tileNow.color || '#10b981'}25 0%, ${row.tileNow.color || '#10b981'}40 100%)`,
                      border: `1.5px solid ${row.tileNow.color || '#10b981'}`,
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: `0 0 12px ${row.tileNow.color || '#10b981'}25`
                    }}>
                      <span style={{ fontSize: '1.6rem' }}>{row.tileNow.icon}</span>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                          Ir a casilla de Tótem:
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                          {row.tileNow.name}
                        </strong>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
