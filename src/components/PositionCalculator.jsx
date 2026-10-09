import React, { useState } from 'react';
import { Target, ArrowRight, AlertTriangle, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { ELEMENTS, PHASE3_STATES, calculateAttackerPlacement } from '../utils/timoLogic';

export default function PositionCalculator({ phase, groupSize }) {
  const [posTurn, setPosTurn] = useState(1); // Default Player 1 (Positioner)
  const [atkTurn, setAtkTurn] = useState(groupSize); // Default last player (Attacker)
  const [currentP2Element, setCurrentP2Element] = useState('water');
  const [currentP3StateIndex, setCurrentP3StateIndex] = useState(2); // Normal Water in P3

  if (phase === 4) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '24px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#e11d48', marginBottom: '8px' }}>
          🎯 Fase 4: Sin cálculo de Tótems para Daño
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto' }}>
          En la Fase 4, Timö ya no está en los tótems y es **vulnerable** directamente a cualquier tipo de daño. 
          ¡Ten cuidado! **TODOS los tótems del mapa son malditos** y causan 50% de daño de vida máxima al iniciar turno sobre ellos.
        </p>
      </div>
    );
  }

  const result = calculateAttackerPlacement(
    currentP2Element,
    currentP3StateIndex,
    posTurn,
    atkTurn,
    groupSize,
    phase
  );

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(192, 132, 252, 0.15)', padding: '8px', borderRadius: '10px' }}>
          <Target size={22} color="#c084fc" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
            Calculadora Rápida de Posición (Posicionador → Atacante)
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Calcula exactamente qué casilla de tótem debe colocar el posicionador **AHORA** para que el atacante inicie su turno con la energía correcta.
          </p>
        </div>
      </div>

      {/* Grid of Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* 1. Positioner Turn */}
        <div style={{ background: 'rgba(15, 10, 25, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            1. Turno del Posicionador:
          </label>
          <select 
            value={posTurn} 
            onChange={(e) => setPosTurn(Number(e.target.value))}
            className="glass-input"
            style={{ width: '100%' }}
          >
            {Array.from({ length: groupSize }, (_, i) => i + 1).map(p => (
              <option key={p} value={p} style={{ background: '#160e22', color: '#fff' }}>
                Jugador {p} (Turno {p})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Attacker Turn */}
        <div style={{ background: 'rgba(15, 10, 25, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            2. Turno del Atacante:
          </label>
          <select 
            value={atkTurn} 
            onChange={(e) => setAtkTurn(Number(e.target.value))}
            className="glass-input"
            style={{ width: '100%' }}
          >
            {Array.from({ length: groupSize }, (_, i) => i + 1).map(p => (
              <option key={p} value={p} style={{ background: '#160e22', color: '#fff' }}>
                Jugador {p} (Turno {p}) {p === groupSize ? '(Último)' : p === groupSize - 1 ? '(Penúltimo)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Timö's Current Totem State */}
        <div style={{ background: 'rgba(15, 10, 25, 0.4)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            3. Elemento del Tótem de Timö AHORA:
          </label>

          {phase !== 3 ? (
            <select 
              value={currentP2Element} 
              onChange={(e) => setCurrentP2Element(e.target.value)}
              className="glass-input"
              style={{ width: '100%' }}
            >
              {ELEMENTS.map(e => (
                <option key={e.id} value={e.id} style={{ background: '#160e22', color: '#fff' }}>
                  {e.icon} {e.name}
                </option>
              ))}
            </select>
          ) : (
            <select 
              value={currentP3StateIndex} 
              onChange={(e) => setCurrentP3StateIndex(Number(e.target.value))}
              className="glass-input"
              style={{ width: '100%' }}
            >
              {PHASE3_STATES.map(s => (
                <option key={s.index} value={s.index} style={{ background: '#160e22', color: s.isCursed ? '#ef4444' : '#fff' }}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Result Visualizer */}
      {result && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 14, 34, 0.9) 0%, rgba(30, 20, 48, 0.9) 100%)',
          borderRadius: '14px',
          padding: '20px',
          border: '1px solid rgba(192, 132, 252, 0.3)',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <Zap size={18} color="#c084fc" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>
              Resultado del Cálculo ({result.advances} avances de ciclo entre turnos):
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'center' }}>
            
            {/* Step 1: Timö Future Element */}
            <div style={{ background: 'rgba(15, 10, 25, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Timö en el turno del atacante:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: result.timoFutureState.element.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{result.timoFutureState.element.icon}</span>
                <span>{result.timoFutureState.element.name}</span>
              </div>
              {result.timoFutureState.isCursed && (
                <div style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px' }}>
                  (Tótem Maldito - Timö es vulnerable)
                </div>
              )}
            </div>

            {/* Step 2: Attacker Counter Needed */}
            <div style={{ background: 'rgba(15, 10, 25, 0.5)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Energía que necesita el atacante:
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: result.requiredCounterElement.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{result.requiredCounterElement.icon}</span>
                <span>{result.requiredCounterElement.name}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                (Contrarresta {result.timoFutureState.element.baseElement || result.timoFutureState.element.name})
              </div>
            </div>

            {/* Step 3: THE GOLDEN INSTRUCTION (Where to place RIGHT NOW) */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(16, 185, 129, 0.25) 100%)',
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid rgba(52, 211, 153, 0.5)',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} />
                Instrucción para el Posicionador:
              </div>
              <div style={{ fontSize: '0.88rem', color: '#f8fafc', marginBottom: '4px' }}>
                Poner al Atacante en casilla cuyo Tótem sea AHORA:
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: result.tileNowElement.color || '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{result.tileNowElement.icon}</span>
                <span>{result.tileNowElement.name}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a7f3d0', marginTop: '4px' }}>
                En {result.advances} avances rotará a <strong>{result.requiredCounterElement.name}</strong> justo cuando el atacante juegue.
              </div>
            </div>

          </div>

          {/* Phase 3 Warning */}
          {phase === 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', background: 'rgba(239, 68, 68, 0.12)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <span style={{ fontSize: '0.82rem', color: '#fca5a5' }}>
                <strong>Cuidado Fase 3:</strong> Asegúrate de que el atacante NO empiece su turno en un tótem amaldiçoado (💀), de lo contrario recibirá 50% de daño de vida máxima.
              </span>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
