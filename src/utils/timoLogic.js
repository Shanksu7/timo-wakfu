// Timö Dungeon Mechanics & Calculation Logic

export const ELEMENTS = [
  { id: 'fire', name: 'Fogo', icon: '🔥', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', counter: 'water', counterName: 'Água' },
  { id: 'water', name: 'Água', icon: '💧', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: '#06b6d4', counter: 'fire', counterName: 'Fogo' },
  { id: 'earth', name: 'Terra', icon: '⛰️', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', counter: 'air', counterName: 'Ar' },
  { id: 'air', name: 'Ar', icon: '🌪️', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', counter: 'earth', counterName: 'Terra' },
];

export const ELEMENT_MAP = {
  fire: ELEMENTS[0],
  water: ELEMENTS[1],
  earth: ELEMENTS[2],
  air: ELEMENTS[3],
};

export const COUNTER_MAP = {
  fire: 'water',
  water: 'fire',
  earth: 'air',
  air: 'earth',
};

// Phase 3 States (8 total)
export const PHASE3_STATES = [
  { index: 0, id: 'fire', name: 'Fogo', baseElement: 'fire', isCursed: false, icon: '🔥', color: '#f97316' },
  { index: 1, id: 'fire_cursed', name: 'Fogo Maldito', baseElement: 'fire', isCursed: true, icon: '💀🔥', color: '#ef4444' },
  { index: 2, id: 'water', name: 'Água', baseElement: 'water', isCursed: false, icon: '💧', color: '#06b6d4' },
  { index: 3, id: 'water_cursed', name: 'Água Maldita', baseElement: 'water', isCursed: true, icon: '💀💧', color: '#3b82f6' },
  { index: 4, id: 'earth', name: 'Terra', baseElement: 'earth', isCursed: false, icon: '⛰️', color: '#10b981' },
  { index: 5, id: 'earth_cursed', name: 'Terra Maldita', baseElement: 'earth', isCursed: true, icon: '💀⛰️', color: '#15803d' },
  { index: 6, id: 'air', name: 'Ar', baseElement: 'air', isCursed: false, icon: '🌪️', color: '#a855f7' },
  { index: 7, id: 'air_cursed', name: 'Ar Maldito', baseElement: 'air', isCursed: true, icon: '💀🌪️', color: '#7e22ce' },
];

export const SUPREME_SPELLS = {
  fire: {
    name: 'Erupção',
    cost: '6 PA',
    target: 'Fuera del círculo de Tótems',
    danger: '-770 HP / Crit -963 HP',
    advice: 'Permanecer DENTRO del círculo de tótems para evitar el daño.',
    image: '/ultimates/erupcao.png'
  },
  water: {
    name: 'Tsunami',
    cost: '6 PA',
    target: 'Dentro del círculo de Tótems',
    danger: '-770 HP / Crit -963 HP',
    advice: 'Salir del círculo de tótems para evitar el daño.',
    image: '/ultimates/tsunami.png'
  },
  earth: {
    name: 'Terremoto',
    cost: '6 PA',
    target: 'Alrededor de cada jugador',
    danger: '-770 HP / Crit -963 HP',
    advice: 'No alinearse ni estar pegados entre aliados.',
    image: '/ultimates/terremoto.png'
  },
  air: {
    name: 'Tempestade',
    cost: '6 PA',
    target: 'En línea recta con cada Tótem',
    danger: '-770 HP / Crit -963 HP',
    advice: 'Evitar alinearse horizontal o verticalmente con los tótems.',
    image: '/ultimates/tempestade.png'
  },
};

/**
 * Calculates number of totem advances between positioner's active turn and attacker's turn.
 */
export function calculateAdvances(posTurnIndex, atkTurnIndex, groupSize = 6, phase = 2) {
  if (phase === 1) {
    return atkTurnIndex > posTurnIndex ? 0 : 1;
  }
  
  if (atkTurnIndex > posTurnIndex) {
    return atkTurnIndex - posTurnIndex;
  } else {
    return (groupSize + 1 - posTurnIndex) + atkTurnIndex;
  }
}

/**
 * Calculates Timö's totem state after N advances.
 */
export function getTimoStateAfterAdvances(initialElementId, initialP3StateIndex, advances, phase) {
  if (phase === 1) {
    const baseIdx = ELEMENTS.findIndex(e => e.id === initialElementId);
    const newIdx = (baseIdx + advances) % 4;
    return {
      element: ELEMENTS[newIdx],
      baseElementId: ELEMENTS[newIdx].id,
      isCursed: false,
      stateIndex: newIdx
    };
  }

  if (phase === 2) {
    const baseIdx = ELEMENTS.findIndex(e => e.id === initialElementId);
    const newIdx = (baseIdx + advances) % 4;
    return {
      element: ELEMENTS[newIdx],
      baseElementId: ELEMENTS[newIdx].id,
      isCursed: false,
      stateIndex: newIdx
    };
  }

  if (phase === 3) {
    const startIdx = initialP3StateIndex !== undefined ? initialP3StateIndex : (ELEMENTS.findIndex(e => e.id === initialElementId) * 2);
    const newIdx = (startIdx + advances) % 8;
    const p3State = PHASE3_STATES[newIdx];
    return {
      element: p3State,
      baseElementId: p3State.baseElement,
      isCursed: p3State.isCursed,
      stateIndex: newIdx
    };
  }

  return {
    element: { name: 'Sin Tótem (Vulnerable)', icon: '🎯', color: '#e11d48' },
    baseElementId: 'none',
    isCursed: true,
    stateIndex: -1
  };
}

/**
 * Calculates positioner requirement:
 * Returns what totem tile the positioner must put the attacker on RIGHT NOW.
 */
export function calculateAttackerPlacement(initialElementId, initialP3Index, posTurnIndex, atkTurnIndex, groupSize, phase) {
  const advances = calculateAdvances(posTurnIndex, atkTurnIndex, groupSize, phase);
  const timoFutureState = getTimoStateAfterAdvances(initialElementId, initialP3Index, advances, phase);
  
  const requiredCounterId = COUNTER_MAP[timoFutureState.baseElementId];
  const requiredCounterElement = ELEMENT_MAP[requiredCounterId];

  if (phase === 1 || phase === 2) {
    const requiredTargetIdx = ELEMENTS.findIndex(e => e.id === requiredCounterId);
    let tileNowIdx = (requiredTargetIdx - advances) % 4;
    if (tileNowIdx < 0) tileNowIdx += 4;

    const tileNowElement = ELEMENTS[tileNowIdx];

    return {
      advances,
      timoFutureState,
      requiredCounterElement,
      tileNowElement,
      isCursedWarning: false,
    };
  }

  if (phase === 3) {
    const requiredP3StateIdx = PHASE3_STATES.findIndex(s => s.baseElement === requiredCounterId && !s.isCursed);
    
    let tileNowP3Idx = (requiredP3StateIdx - advances) % 8;
    if (tileNowP3Idx < 0) tileNowP3Idx += 8;

    const tileNowState = PHASE3_STATES[tileNowP3Idx];

    return {
      advances,
      timoFutureState,
      requiredCounterElement,
      tileNowElement: tileNowState,
      isCursedWarning: false
    };
  }

  return null;
}

/**
 * Predicts Supreme Spells sequence for current and upcoming rounds.
 */
export function predictSupremeSpells(initialElementId, phase, roundCount = 4, groupSize = 6) {
  if (phase === 4) return [];

  const predictions = [];
  
  if (phase === 1) {
    let currentIdx = ELEMENTS.findIndex(e => e.id === initialElementId);
    for (let r = 1; r <= roundCount; r++) {
      const elem = ELEMENTS[currentIdx];
      predictions.push({
        round: r,
        element: elem,
        spell: SUPREME_SPELLS[elem.id]
      });
      currentIdx = (currentIdx + 1) % 4;
    }
    return predictions;
  }

  if (phase === 2) {
    const advPerRound = groupSize + 1;
    let currentIdx = ELEMENTS.findIndex(e => e.id === initialElementId);

    for (let r = 1; r <= roundCount; r++) {
      const elem = ELEMENTS[currentIdx];
      predictions.push({
        round: r,
        element: elem,
        spell: SUPREME_SPELLS[elem.id]
      });
      currentIdx = (currentIdx + advPerRound) % 4;
    }
    return predictions;
  }

  if (phase === 3) {
    const advPerRound = groupSize + 1;
    let currentStateIdx = ELEMENTS.findIndex(e => e.id === initialElementId) * 2;

    for (let r = 1; r <= roundCount; r++) {
      const p3State = PHASE3_STATES[currentStateIdx];
      const baseElem = ELEMENT_MAP[p3State.baseElement];
      predictions.push({
        round: r,
        p3State,
        element: baseElem,
        spell: SUPREME_SPELLS[baseElem.id]
      });
      currentStateIdx = (currentStateIdx + advPerRound) % 8;
    }
    return predictions;
  }

  return [];
}
