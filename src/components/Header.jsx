import React from 'react';
import { Shield, Sparkles, Users, Activity } from 'lucide-react';

export default function Header({ phase, setPhase, stasis, setStasis, groupSize, setGroupSize }) {
  return (
    <header className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        
        {/* Title & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}>
            <Shield size={28} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff 0%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Timülador Pro
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Calculadora de Tótems & Posicionamiento — Wakfu Boss Nivel 248
            </p>
          </div>
        </div>

        {/* Global Controls: Stasis & Group Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(15, 10, 25, 0.5)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(192, 132, 252, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#c084fc" />
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>Estasis:</label>
            <select 
              value={stasis} 
              onChange={(e) => setStasis(Number(e.target.value))}
              className="glass-input"
              style={{ padding: '4px 8px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                <option key={s} value={s} style={{ background: '#160e22', color: '#fff' }}>
                  Stasis {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#38bdf8" />
            <label style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>Jugadores:</label>
            <select 
              value={groupSize} 
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="glass-input"
              style={{ padding: '4px 8px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {[1, 2, 3, 4, 5, 6].map(g => (
                <option key={g} value={g} style={{ background: '#160e22', color: '#fff' }}>
                  {g} Jugadores
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Phase Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '20px' }}>
        {[
          { id: 1, name: 'Fase 1', sub: 'Invulnerabilidad Base', desc: '1 avance por ronda' },
          { id: 2, name: 'Fase 2', sub: 'Aceleración (7 Avances)', desc: 'Totem cambia tras cada turno' },
          { id: 3, name: 'Fase 3', sub: 'Tótems Malditos (8 Estados)', desc: 'Cuidado: 50% Daño Max HP' },
          { id: 4, name: 'Fase 4', sub: 'Duelo vs Timö', desc: 'Vulnerable / 1000% Robo de Vida' },
        ].map(p => {
          const isActive = phase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPhase(p.id)}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(192, 132, 252, 0.25) 0%, rgba(147, 51, 234, 0.35) 100%)' 
                  : 'rgba(15, 10, 25, 0.4)',
                border: isActive ? '1px solid rgba(192, 132, 252, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '12px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 16px rgba(192, 132, 252, 0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isActive ? '#ffffff' : '#cbd5e1' }}>
                  {p.name}
                </span>
                {isActive && <Sparkles size={14} color="#c084fc" />}
              </div>
              <div style={{ fontSize: '0.78rem', color: isActive ? '#e2e8f0' : '#64748b', fontWeight: 600 }}>
                {p.sub}
              </div>
              <div style={{ fontSize: '0.72rem', color: isActive ? '#c084fc' : '#475569', marginTop: '2px' }}>
                {p.desc}
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
}
