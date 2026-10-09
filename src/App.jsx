import React, { useState } from 'react';
import Header from './components/Header';
import RoundTable from './components/RoundTable';
import Phase4Guide from './components/Phase4Guide';
import { ExternalLink } from 'lucide-react';

export default function App() {
  const [phase, setPhase] = useState(2); // Default to Phase 2
  const [stasis, setStasis] = useState(2);
  const [groupSize, setGroupSize] = useState(6);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* App Header & Navigation */}
      <Header 
        phase={phase}
        setPhase={setPhase}
        stasis={stasis}
        setStasis={setStasis}
        groupSize={groupSize}
        setGroupSize={setGroupSize}
      />

      {/* Main Content Area */}
      <main>
        {/* Phase 4 Special Guide Banner if Phase 4 is selected */}
        {phase === 4 && <Phase4Guide />}

        {/* HERO FEATURE: All-in-One Round Positioning Table */}
        <RoundTable phase={phase} groupSize={groupSize} />
      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ padding: '16px 24px', textAlign: 'center', marginTop: '32px' }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <span>
            Wakfu MMORPG — Tabla de Posicionamiento para <strong>Timö, o Possuído (Lvl 248)</strong>
          </span>
          <span>•</span>
          <a 
            href="https://bestiariodoneze.com.br/monstro.php?monstro=681&lvl=248&s=2" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: '#c084fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            Ver fuente Bestiário Doneze <ExternalLink size={14} />
          </a>
        </div>
      </footer>

    </div>
  );
}
