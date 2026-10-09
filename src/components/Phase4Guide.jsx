import React from 'react';
import { Skull, Heart, ShieldAlert, Zap, Award } from 'lucide-react';

export default function Phase4Guide() {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '24px', border: '1.5px solid rgba(225, 29, 72, 0.4)' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(225, 29, 72, 0.2)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(225, 29, 72, 0.5)' }}>
          <Skull size={26} color="#fb7185" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f43f5e' }}>
            Guía de Supervivencia: Fase 4 — Duelo Final vs Timö
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#fda4af' }}>
            Timö sale de los tótems, se vuelve vulnerable y se teletransporta cerca de un jugador.
          </p>
        </div>
      </div>

      {/* Rules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        
        {/* Rule 1: Vulnerability & Lifesteal */}
        <div style={{ background: 'rgba(15, 10, 25, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
            <Heart size={18} />
            1000% Robo de Vida
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
            Timö se cura <strong>10 veces el daño que inflige</strong>. Evitar recibir daños innecesarios es crítico para evitar que el jefe recupere toda su vida.
          </p>
        </div>

        {/* Rule 2: Cursed Totems */}
        <div style={{ background: 'rgba(15, 10, 25, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
            <ShieldAlert size={18} />
            Tótems Permanentemente Malditos
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
            Nadie debe empezar el turno en una casilla de tótem. Hacerlo inflige <strong>50% de daño de vida máxima</strong> que cuenta como provocado por Timö (¡curándolo 500% de tu HP!).
          </p>
        </div>

        {/* Rule 3: Summoner Archetype Triggers */}
        <div style={{ background: 'rgba(15, 10, 25, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
            <Zap size={18} />
            Arquétipo Invocador (Buffs)
          </div>
          <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li><strong>Turnos 4, 7, 10...:</strong> +5% daño acumulable por cada mob muerto + 50% daño si HP &gt; 75%.</li>
            <li><strong>Turnos 7, 13, 19...:</strong> Elimina automáticamente invocaciones de jugadores a 5 casillas o menos.</li>
          </ul>
        </div>

      </div>

    </div>
  );
}
