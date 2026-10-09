import React, { useState } from 'react';
import { Clock, ChevronRight, Play, Pause, RotateCcw, User, Shield } from 'lucide-react';
import { ELEMENTS, PHASE3_STATES, getTimoStateAfterAdvances } from '../utils/timoLogic';

export default function TimelineViewer({ phase, groupSize }) {
  const [activeStep, setActiveStep] = useState(0); // 0 = Timö, 1 = P1, etc.
  const [initialP2Element, setInitialP2Element] = useState('water');
  const [initialP3StateIndex, setInitialP3StateIndex] = useState(2); // Normal Water

  if (phase === 4) {
    return null; // Timeline not applicable to Phase 4
  }

  // Total entities in timeline = Timö (0) + Players (1 to groupSize)
  const totalEntities = groupSize + 1;

  const timelineSteps = Array.from({ length: totalEntities }, (_, i) => {
    const isTimo = i === 0;
    const name = isTimo ? 'Timö (Jefe)' : `Jugador ${i}`;
    // Number of advances at start of entity i's turn:
    // Phase 1: 0 advances during players' turns, 1 advance at end of Timö's turn
    // Phase 2 & 3: i advances
    const advances = phase === 1 ? 0 : i;
    
    const timoState = getTimoStateAfterAdvances(initialP2Element, initialP3StateIndex, advances, phase);

    return {
      stepIndex: i,
      name,
      isTimo,
      advances,
      timoState
    };
  });

  const currentStep = timelineSteps[activeStep] || timelineSteps[0];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Title & Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '8px', borderRadius: '10px' }}>
            <Clock size={22} color="#38bdf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Línea de Tiempo Interactiva del Ciclo de Tótems
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Visualiza paso a paso cómo cambia el elemento de Timö y los tótems al final de cada turno.
            </p>
          </div>
        </div>

        {/* Initial Element Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
            Elemento Inicial de Timö:
          </label>
          {phase !== 3 ? (
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
          ) : (
            <select
              value={initialP3StateIndex}
              onChange={(e) => setInitialP3StateIndex(Number(e.target.value))}
              className="glass-input"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
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

      {/* Step Buttons (Entity Pipeline) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {timelineSteps.map((step) => {
          const isActive = activeStep === step.stepIndex;
          return (
            <button
              key={step.stepIndex}
              onClick={() => setActiveStep(step.stepIndex)}
              style={{
                flex: '1 0 120px',
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(59, 130, 246, 0.35) 100%)' 
                  : 'rgba(15, 10, 25, 0.5)',
                border: isActive ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {step.isTimo ? <Shield size={14} color="#c084fc" /> : <User size={14} color="#38bdf8" />}
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#ffffff' : '#cbd5e1' }}>
                  {step.name}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: isActive ? '#7dd3fc' : '#64748b' }}>
                {step.advances} Avances
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Card */}
      <div style={{
        background: 'rgba(15, 10, 25, 0.6)',
        borderRadius: '14px',
        padding: '20px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estado de los Tótems en el turno de: <strong style={{ color: '#f8fafc' }}>{currentStep.name}</strong>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Tótem de Timö: </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: currentStep.timoState.element.color }}>
                {currentStep.timoState.element.icon} {currentStep.timoState.element.name}
              </span>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />

            <div>
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Los monstruos reciben daño de: </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                Energía {currentStep.timoState.element.baseElement === 'fire' ? '💧 Água' : currentStep.timoState.element.baseElement === 'water' ? '🔥 Fogo' : currentStep.timoState.element.baseElement === 'earth' ? '🌪️ Ar' : '⛰️ Terra'}
              </span>
            </div>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveStep(prev => (prev > 0 ? prev - 1 : totalEntities - 1))}
            className="glass-button"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            Anterior
          </button>
          <button 
            onClick={() => setActiveStep(prev => (prev < totalEntities - 1 ? prev + 1 : 0))}
            className="glass-button"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
