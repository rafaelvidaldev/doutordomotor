export function mascot(mood = "happy", cls = "") {
  const pupil = { happy: [0, 2], thinking: [4, -4], worried: [0, 4] }[mood] || [0, 2];
  let face = "", extra = "";

  if (mood === "danger") {
    face = `<path d="M68 78 L88 98 M88 78 L68 98 M112 78 L132 98 M132 78 L112 98" stroke="#000" stroke-width="6" stroke-linecap="round"/>
            <path d="M76 122 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    extra = `<g class="smoke" fill="#555" stroke="#000" stroke-width="4">
              <circle cx="146" cy="22" r="11"/>
              <circle cx="166" cy="10" r="8" style="animation-delay:.5s"/>
              <circle cx="132" cy="12" r="7" style="animation-delay:.9s"/>
            </g>
            <path class="sparkle" d="M178 60 L188 68 L178 76 L186 90 L172 82 Z" fill="#FFD23F" stroke="#000" stroke-width="3"/>`;
  } else {
    face = `<circle cx="78" cy="88" r="14" fill="#fff" stroke="#000" stroke-width="4"/>
            <circle cx="122" cy="88" r="14" fill="#fff" stroke="#000" stroke-width="4"/>
            <circle cx="${78 + pupil[0]}" cy="${88 + pupil[1]}" r="6" fill="#000"/>
            <circle cx="${122 + pupil[0]}" cy="${88 + pupil[1]}" r="6" fill="#000"/>
            <circle cx="${78 + pupil[0] - 2}" cy="${88 + pupil[1] - 2}" r="2" fill="#fff"/>
            <circle cx="${122 + pupil[0] - 2}" cy="${88 + pupil[1] - 2}" r="2" fill="#fff"/>`;

    if (mood === "happy") {
      face += `<circle class="blush" cx="58" cy="112" r="8" fill="#FFA3D1" stroke="#000" stroke-width="2"/>
               <circle class="blush" cx="142" cy="112" r="8" fill="#FFA3D1" stroke="#000" stroke-width="2"/>
               <path d="M82 112 Q100 134 118 112" fill="#000" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
               <path d="M92 122 Q100 128 108 122" fill="#FF5A52"/>`;
    } else if (mood === "thinking") {
      face += `<path d="M66 70 Q78 64 90 70 M110 70 Q122 64 134 70" stroke="#000" stroke-width="5" stroke-linecap="round"/>
               <path d="M88 120 Q102 114 114 120" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>`;
      extra = `<path class="sparkle" d="M152 28 L158 14 L164 28 L178 34 L164 40 L158 54 L152 40 L138 34 Z" fill="#FFD23F" stroke="#000" stroke-width="3"/>`;
    } else if (mood === "worried") {
      face += `<path d="M64 68 L90 76 M136 68 L110 76" stroke="#000" stroke-width="5" stroke-linecap="round"/>
               <path d="M80 122 Q90 112 100 122 T120 122" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>`;
      extra = `<path class="sweat" d="M158 50 q-9 14 0 20 q9 -6 0 -20z" fill="#5AB0FF" stroke="#000" stroke-width="3.5" stroke-linejoin="round"/>`;
    }
  }

  const label = {
    happy: "Doutor do Motor sorrindo e feliz",
    thinking: "Doutor do Motor pensativo analisando",
    worried: "Doutor do Motor preocupado suando",
    danger: "Doutor do Motor fumegando em perigo"
  }[mood] || "Doutor do Motor";

  return `<svg class="mascot ${cls} ${mood === "danger" ? "shake" : ""}" viewBox="0 0 200 160" role="img" aria-label="${label}">
    <g class="bob">
      <!-- Eixo de saída à direita -->
      <rect x="160" y="80" width="34" height="20" rx="4" fill="#CAD1D9" stroke="#000" stroke-width="5"/>
      <line x1="166" y1="88" x2="188" y2="88" stroke="#000" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Base preta com sapatas de fixação -->
      <rect x="40" y="134" width="120" height="18" rx="6" fill="#000"/>
      <circle cx="54" cy="143" r="3.5" fill="#CAD1D9"/>
      <circle cx="146" cy="143" r="3.5" fill="#CAD1D9"/>
      <!-- Caixa de ligação superior com cruz vermelha de socorrista -->
      <rect x="72" y="18" width="56" height="32" rx="8" fill="#fff" stroke="#000" stroke-width="5"/>
      <path d="M100 24 V44 M90 34 H110" stroke="#FF5A52" stroke-width="6" stroke-linecap="round"/>
      <!-- Corpo amarelo do motor com aletas de resfriamento -->
      <rect x="22" y="44" width="144" height="96" rx="28" fill="#FFD23F" stroke="#000" stroke-width="5"/>
      <path d="M36 64 V120 M48 56 V128 M138 56 V128 M150 64 V120" stroke="#000" stroke-width="4.5" stroke-linecap="round" opacity=".22"/>
      ${face}
      ${extra}
    </g>
  </svg>`;
}

export const boltIco = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 1 L3 9 H8 L7 15 L13 7 H8 Z" fill="#000"/></svg>`;
