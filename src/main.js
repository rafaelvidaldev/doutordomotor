import './style.css';
import { CAUSES, SYMPTOMS, TYPES, GRAV, PLACA, CHECK, MAQUINAS, TERMOS, DICT_CATS } from './data/knowledgeBase.js';
import { mascot, boltIco } from './components/mascot.js';
import { parsePlateText } from './utils/plateParser.js';

/* ---------- Estado da Aplicação ---------- */
const S = {
  view: "home",
  type: null,
  sym: null,
  qi: 0,
  answers: [],
  placaField: null,
  // Calculadora de Polias
  rpmMotor: 1750,
  dMotor: 80,
  dMaq: 120,
  // Calculadora de Extensão
  distM: 50,
  fioMm: 2.5,
  potCv: 2,
  // Scanner de Placa (OCR)
  scanner: {
    status: "idle", // 'idle' | 'processing' | 'success' | 'empty' | 'error'
    previewUrl: null,
    progress: 0,
    stepMsg: "",
    detected: null,
    rawText: "",
    errMsg: ""
  },
  // Dicionário do Eletricista
  dictCat: "todos",
  dictSearch: ""
};

const $app = document.getElementById("app");
const $top = document.getElementById("top");
const sym = () => SYMPTOMS.find(x => x.id === S.sym);

function pts(v) {
  if (typeof v === "number") return v;
  if (S.type === "nao_sei") return Math.max(v.mono || 0, v.tri || 0);
  return v[S.type] || 0;
}

function allowed(id) {
  const c = CAUSES[id];
  if (!c) return false;
  return !c.only || S.type === "nao_sei" || c.only === S.type;
}

function diagnose() {
  const s = sym();
  if (!s) return { list: [], g: 1, red: false };
  if (s.urgent) return { list: s.urgentCauses.filter(allowed), g: 2, red: true };

  const score = {};
  const add = (c, v) => { score[c] = (score[c] || 0) + pts(v); };
  (s.base || []).forEach(b => add(b.c, b.v));

  let red = false;
  S.answers.forEach((ai, qi) => {
    const o = s.qs[qi]?.opts[ai];
    if (!o) return;
    Object.entries(o.fx).forEach(([c, v]) => add(c, v));
    if (o.red) red = true;
  });

  let list = Object.keys(score).filter(c => score[c] > 0 && allowed(c)).sort((a, b) => score[b] - score[a]).slice(0, 3);
  if (!list.length) list = s.fallback.filter(allowed).slice(0, 3);
  let g = list.length ? Math.max(...list.slice(0, 2).map(c => CAUSES[c].g)) : 1;
  if (red) g = 2;
  return { list, g, red };
}

function haptic(ms = 12) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(ms); } catch (e) {}
  }
}

/* ---------- Navegação ---------- */
function go(view) {
  S.view = view;
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(() => render());
  } else {
    render();
  }
}

function back() {
  const doBack = () => {
    const v = S.view;
    if (["type", "placa", "polias", "extensao", "roca", "check", "gira", "dicionario"].includes(v)) {
      return go("home");
    }
    if (v === "symptom") return go("type");
    if (v === "question") {
      if (S.qi === 0) return go("symptom");
      S.qi--;
      S.answers.pop();
      return render();
    }
    if (v === "result") {
      const s = sym();
      if (s.urgent) return go("symptom");
      S.qi = s.qs.length - 1;
      S.answers.pop();
      return go("question");
    }
  };

  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(doBack);
  } else {
    doBack();
  }
}

function topbar() {
  const showBack = S.view !== "home";
  $top.innerHTML = `
    ${showBack ? `<button class="iconbtn" data-act="back" aria-label="Voltar">←</button>` : ""}
    <button class="brand display brand-btn" data-act="home" aria-label="Voltar para a página inicial"><span class="brand-dot">${boltIco}</span>Doutor do Motor</button>`;
}

function progress() {
  const s = sym();
  const total = 2 + (s && !s.urgent ? s.qs.length : 3);
  const done = S.view === "type" ? 1 : S.view === "symptom" ? 2 : 2 + S.qi + 1;
  let bars = "";
  for (let i = 0; i < total; i++) {
    bars += `<span class="${i < done ? "on" : ""}"></span>`;
  }
  return `<p class="step-label">Passo ${done} de ${total}</p><div class="progress" aria-hidden="true">${bars}</div>`;
}

/* ---------- Telas ---------- */
function viewHome() {
  return `
  <section class="hero">
    ${mascot("happy")}
    <h1 class="display" tabindex="-1">Seu motor tá estranho?</h1>
    <p class="lead">Ferramenta prática pro produtor rural, marceneiro e oficinas. Descubra o defeito do motor da ordenha, ensiladeira ou serra sem enrolação!</p>
    <button class="btn btn-yellow btn-big" data-act="start"><span class="ico" aria-hidden="true">🩺</span><span class="t">Começar diagnóstico rápido</span></button>
  </section>

  <h2 class="section-title display">Ferramentas & Habilidades</h2>
  <p class="section-sub">Tudo o que você precisa saber pra cuidar do motor no sítio:</p>
  <div class="stack">
    <button class="btn" data-act="go" data-v="polias"><span class="ico" aria-hidden="true">⚙️</span><span><span class="t">Casamento de polias animado</span><span class="s">Calcule o diâmetro da correia e rotação (RPM)</span></span></button>
    <button class="btn" data-act="go" data-v="extensao"><span class="ico" aria-hidden="true">📏</span><span><span class="t">Teste de extensão da roça</span><span class="s">Veja se o fio fino tá roubando força da máquina</span></span></button>
    <button class="btn" data-act="go" data-v="roca"><span class="ico" aria-hidden="true">🚜</span><span><span class="t">Motores da Roça e Oficina</span><span class="s">Ordenheira, resfriador, picador e estufa de fumo</span></span></button>
    <button class="btn" data-act="go" data-v="placa"><span class="ico" aria-hidden="true">🏷️</span><span><span class="t">Ler a placa do motor</span><span class="s">O que significa cv, 220/380V, FS e IP55</span></span></button>
    <button class="btn" data-act="go" data-v="check"><span class="ico" aria-hidden="true">🧽</span><span><span class="t">Cuidados de rotina</span><span class="s">Checklist pra ele durar mais de 20 anos</span></span></button>
    <button class="btn" data-act="go" data-v="gira"><span class="ico" aria-hidden="true">🌀</span><span><span class="t">Como o motor gira por dentro</span><span class="s">A física da indução explicada em 1 minuto</span></span></button>
    <button class="btn" data-act="go" data-v="dicionario"><span class="ico" aria-hidden="true">📖</span><span><span class="t">Dicionário do eletricista</span><span class="s">Tradutor de termos técnicos pra língua da roça</span></span></button>
  </div>

  <div class="card note" style="margin-top:30px">
    <p><strong>⚠️ Segurança em primeiro lugar:</strong> Sempre desligue o disjuntor e tire o plugue da tomada antes de colocar a mão em correia, hélice ou carcaça. Este aplicativo é um guia amigo e não dispensa um profissional de elétrica.</p>
  </div>

  <footer class="foot">
    <p><strong>Doutor do Motor</strong> • Projeto de extensão universitária do curso de Engenharia Elétrica, disciplina Máquinas Elétricas e Acionamento.</p>
    <p>Idealizado por Rafael Vidal em prol do homem do campo e pequenos negócios.</p>
  </footer>`;
}

function viewType() {
  return `${progress()}
  <div class="qhead">${mascot("thinking", "sm")}</div>
  <div class="bubble"><h2 class="display" tabindex="-1">Que tipo de motor elétrico é?</h2><p>Isso define se vamos olhar capacitor, chave centrífuga ou fases da rede.</p></div>
  <div class="stack">
    ${Object.entries(TYPES).map(([k, o]) => `
      <button class="btn ${S.type === k ? "selected" : ""}" data-act="type" data-k="${k}">
        <span class="ico display">${o.ico}</span><span><span class="t">${o.t}</span><span class="s">${o.s}</span></span>
      </button>`).join("")}
  </div>
  <details class="hint">
    <summary>Como descobrir se é mono ou trifásico?</summary>
    <div class="in">
      <p>• <strong>Olhe a plaqueta de metal:</strong> se tiver escrito <strong>1~</strong> é monofásico; se tiver <strong>3~</strong> é trifásico.</p>
      <p>• <strong>Tem um 'bucho' cilíndrico preso em cima?</strong> Quase sempre é o capacitor do motor monofásico.</p>
      <p>• <strong>Quantos fios entram nele?</strong> Se entram 2 ou 3 fios finos na tomada comum é monofásico; se chega cabo grosso com 3 ou 4 condutores em chave pesada, costuma ser trifásico.</p>
    </div>
  </details>`;
}

function viewSymptom() {
  return `${progress()}
  <div class="qhead">${mascot("thinking", "sm")}</div>
  <div class="bubble"><h2 class="display" tabindex="-1">O que está acontecendo com ele?</h2><p>Escolha o sintoma mais parecido com a lida de agora:</p></div>
  <div class="grid2">
    ${SYMPTOMS.map(s => `
      <button class="btn ${s.urgent ? "btn-pink" : ""}" data-act="sym" data-k="${s.id}">
        <span class="ico" aria-hidden="true">${s.ico}</span><span class="t">${s.t}</span><span class="s">${s.s}</span>
      </button>`).join("")}
  </div>`;
}

function viewQuestion() {
  const s = sym();
  const q = s.qs[S.qi];
  return `${progress()}
  <div class="qhead">${mascot("thinking", "sm")}</div>
  <div class="bubble"><h2 class="display" tabindex="-1">${q.q}</h2>${q.h ? `<p>${q.h}</p>` : ""}</div>
  <div class="stack">
    ${q.opts.map((o, i) => `<button class="btn" data-act="ans" data-i="${i}"><span class="t">${o.t}</span></button>`).join("")}
  </div>`;
}

function causeCard(id, i) {
  const c = CAUSES[id];
  if (!c) return "";
  const tagCol = ["var(--green)", "var(--yellow)", "var(--red)"][c.g];
  const tagTxt = ["Simples / Regulagem", "Atenção / Manutenção", "Grave / Perigo"][c.g];
  return `<article class="card cause">
    <span class="rank ${i === 0 ? "first" : ""}">${i === 0 ? "Mais provável no seu caso" : "Também pode ser"}</span>
    <h3 class="display">${c.t}</h3>
    <span class="tag" style="background:${tagCol}">${tagTxt}</span>
    <h4>O que você mesmo pode conferir (com o motor desligado):</h4>
    <ul>${c.check.map(x => `<li>${x}</li>`).join("")}</ul>
    <h4>Quando e por que chamar o eletricista:</h4>
    <p class="pro">${c.pro}</p>
    <details><summary>Por que isso acontece? (Explicação simples)</summary><div class="in"><p>${c.why}</p></div></details>
  </article>`;
}

function viewResult() {
  const s = sym();
  const d = diagnose();
  const G = GRAV[d.g];
  const urgentBlock = s.urgent ? `
    <div class="card" style="margin-top:20px; border-color:var(--red); background:#FFF0F0">
      <h2 class="display" style="color:var(--red)">🚨 Ação Imediata (Faça Agora)</h2>
      <ol class="urgent-steps">
        <li><strong>Desligue o disjuntor geral</strong> daquele circuito imediatamente, sem tocar na carcaça do motor ou da máquina.</li>
        <li><strong>Não encoste</strong> em partes metálicas nem deixe animais ou outras pessoas chegarem perto.</li>
        ${s.id === "queimado" ? `<li><strong>Em caso de princípio de fogo:</strong> NUNCA jogue água em equipamento elétrico! Use extintor de Pó Químico (ABC) ou Gás Carbônico (CO₂). Se não tiver, ligue pros Bombeiros no 193.</li>` : `<li><strong>Choque elétrico:</strong> Indica fuga direta de corrente e falta de aterramento confiável.</li>`}
        <li>Chame um profissional de elétrica antes de tentar ligar de novo.</li>
      </ol>
    </div>` : "";

  return `
  <section class="verdict g${d.g}">
    ${mascot(G.mood)}
    <div><h2 class="display" tabindex="-1">${G.t}</h2><p>${G.s}</p></div>
  </section>
  ${urgentBlock}
  <div class="card safety"><span class="big" aria-hidden="true">🔒</span><p><strong>Aviso de segurança obrigatório:</strong> Antes de encostar em correia, polia ou abrir a tampa traseira, desligue o disjuntor e tire o plugue da tomada. Nunca abra a caixa de fiação com o motor ligado na rede!</p></div>
  <h2 class="section-title display" style="margin-top:16px">Causas prováveis apontadas pelo Doutor</h2>
  <div>${d.list.map(causeCard).join("")}</div>
  <div class="actions">
    <button class="btn btn-green btn-big" data-act="share"><span class="ico" aria-hidden="true">📤</span><span class="t">Enviar resumo pro eletricista</span></button>
    <a class="btn btn-big" href="https://wa.me/?text=${encodeURIComponent(summary())}" target="_blank" rel="noopener"><span class="ico" aria-hidden="true">💬</span><span class="t">Mandar direto no WhatsApp</span></a>
    <button class="btn btn-yellow btn-big" data-act="restart"><span class="ico" aria-hidden="true">🔄</span><span class="t">Fazer outro diagnóstico</span></button>
  </div>`;
}

/* ---------- SKILL: Casamento de Polias ---------- */
function viewPolias() {
  const rpmMotor = S.rpmMotor;
  const dM = S.dMotor;
  const dQ = S.dMaq;
  const rpmFinal = Math.round((rpmMotor * dM) / dQ);
  const relacao = (dM / dQ).toFixed(2);
  let statusTxt = "Rotação média tradicional";
  let statusBg = "var(--green)";
  if (rpmFinal > 3200) {
    statusTxt = "⚡ Alta rotação (cuidado com facas e pedras)";
    statusBg = "var(--yellow)";
  } else if (rpmFinal < 600) {
    statusTxt = "🐢 Redução forte (alta força de torque)";
    statusBg = "var(--lilac)";
  }

  const r1 = Math.min(Math.max(16, (dM / 200) * 44), 50);
  const r2 = Math.min(Math.max(16, (dQ / 200) * 44), 50);

  return `
  <h1 class="display" tabindex="-1">Casamento de Polias</h1>
  <p class="lead">Descubra a rotação exata da sua ensiladeira, serra ou moenda trocando o tamanho das polias.</p>
  
  <div class="card">
    <svg class="pulley-canvas" viewBox="0 0 320 150" role="img" aria-label="Duas polias conectadas por correia animada">
      <path class="belt-track" d="M 70 ${75 - r1} L 240 ${75 - r2} A ${r2} ${r2} 0 0 1 240 ${75 + r2} L 70 ${75 + r1} A ${r1} ${r1} 0 0 1 70 ${75 - r1} Z" fill="none" stroke="#000" stroke-width="6"/>
      <g transform="translate(70,75)">
        <circle cx="0" cy="0" r="${r1}" fill="#FFD23F" stroke="#000" stroke-width="4"/>
        <circle cx="0" cy="0" r="${Math.max(6, r1 * 0.4)}" fill="#CAD1D9" stroke="#000" stroke-width="3"/>
        <line x1="0" y1="${-r1 + 2}" x2="0" y2="${r1 - 2}" stroke="#000" stroke-width="3" stroke-linecap="round"/>
        <line x1="${-r1 + 2}" y1="0" x2="${r1 - 2}" y2="0" stroke="#000" stroke-width="3" stroke-linecap="round"/>
        <text x="0" y="${r1 + 24}" font-family="'Lilita One',Arial" font-size="12" text-anchor="middle" fill="#000">Motor: ${dM} mm</text>
      </g>
      <g transform="translate(240,75)">
        <circle cx="0" cy="0" r="${r2}" fill="#5AB0FF" stroke="#000" stroke-width="4"/>
        <circle cx="0" cy="0" r="${Math.max(6, r2 * 0.4)}" fill="#CAD1D9" stroke="#000" stroke-width="3"/>
        <line x1="0" y1="${-r2 + 2}" x2="0" y2="${r2 - 2}" stroke="#000" stroke-width="3" stroke-linecap="round"/>
        <line x1="${-r2 + 2}" y1="0" x2="${r2 - 2}" y2="0" stroke="#000" stroke-width="3" stroke-linecap="round"/>
        <text x="0" y="${r2 + 24}" font-family="'Lilita One',Arial" font-size="12" text-anchor="middle" fill="#000">Máquina: ${dQ} mm</text>
      </g>
    </svg>

    <div class="slider-box">
      <label><span>Polia no eixo do Motor:</span> <strong>${dM} mm</strong></label>
      <input type="range" min="40" max="250" step="5" value="${dM}" data-act="slide-motor">
    </div>

    <div class="slider-box">
      <label><span>Polia no eixo da Máquina:</span> <strong>${dQ} mm</strong></label>
      <input type="range" min="40" max="350" step="5" value="${dQ}" data-act="slide-maq">
    </div>

    <div class="slider-box">
      <label><span>Motor elétrico da roça:</span> <strong>${rpmMotor} RPM</strong></label>
      <div style="display:flex; gap:10px; margin-top:6px">
        <button class="field ${rpmMotor === 1750 ? "on" : ""}" style="flex:1" data-act="set-rpm" data-v="1750">1750 RPM (4 polos - padrão)</button>
        <button class="field ${rpmMotor === 3500 ? "on" : ""}" style="flex:1" data-act="set-rpm" data-v="3500">3500 RPM (2 polos - rápido)</button>
      </div>
    </div>

    <div class="rpm-meter">
      <div style="font-size:.9rem; color:#444; font-weight:700">Velocidade final que a máquina vai girar:</div>
      <div class="rpm-val">${rpmFinal} <span style="font-size:1.3rem">RPM</span></div>
      <div class="rpm-badge" style="background:${statusBg}">${statusTxt} • Proporção ${relacao}:1</div>
    </div>
  </div>

  <details class="hint" style="margin-top:16px">
    <summary>Dica de ouro: polia menor ou maior?</summary>
    <div class="in">
      <p>• <strong>Quer mais velocidade (ex.: serra circular):</strong> coloque polia MAIOR no motor e MENOR na serra.</p>
      <p>• <strong>Quer mais força e menos rotação (ex.: moenda de cana, ensiladeira grossa):</strong> coloque polia PEQUENA no motor e GRANDE na máquina.</p>
      <p>• <strong>Aviso de segurança:</strong> NUNCA use polia pequena demais no motor (abaixo de 60mm), pois a correia dobra muito forte e arrebenta rápido por fadiga.</p>
    </div>
  </details>`;
}

/* ---------- SKILL: Teste de Extensão (NBR 5410) ---------- */
function viewExtensao() {
  const I = S.potCv * 5.5;
  const R = (0.0178 * S.distM * 2) / S.fioMm;
  const quedaV = Math.round(I * R);
  const vFinal = Math.max(120, 220 - quedaV);
  const percQueda = ((quedaV / 220) * 100).toFixed(1);

  let voltCor = "var(--green)";
  let voltMsg = "Tensão excelente! Queda dentro do limite de 4% da NBR 5410. O motor trabalha frio e rende toda a força no eixo.";
  let voltStatus = "Normal (até 4% pela NBR 5410)";

  if (vFinal < 211 && vFinal >= 205) {
    voltCor = "var(--yellow)";
    voltMsg = "Atenção: Queda entre 4% e 7%. Aceitável no limite da norma NBR 5410, mas o motor já pode esquentar em esforço contínuo ou na partida.";
    voltStatus = "Atenção (4% a 7% pela NBR 5410)";
  } else if (vFinal < 205) {
    voltCor = "var(--red)";
    voltMsg = "Perigo de subtensão! Queda acima de 7% (reprovado pela NBR 5410). O motor vai puxar mais corrente, perder torque e superaquecer o verniz das bobinas.";
    voltStatus = "Crítico (queda acima de 7%)";
  }

  const angulo = Math.min(42, Math.max(-62, (vFinal - 220) * 1.67 + 40));

  return `
  <h1 class="display" tabindex="-1">Extensão & Fio na Roça</h1>
  <p class="lead">Descubra se o fio fino tá roubando a força do motor no açude, paiol ou galinheiro.</p>

  <div class="card">
    <div class="volt-box">
      <svg class="volt-svg" viewBox="0 0 220 120" role="img" aria-label="Voltímetro analógico marcando a voltagem da ponta">
        <path d="M 20 105 A 90 90 0 0 1 200 105 Z" fill="#FFF4C2" stroke="#000" stroke-width="4"/>
        <path d="M 32 105 A 78 78 0 0 1 130 30" fill="none" stroke="#FF5A52" stroke-width="12"/>
        <path d="M 130 30 A 78 78 0 0 1 144 34" fill="none" stroke="#FFD23F" stroke-width="12"/>
        <path d="M 144 34 A 78 78 0 0 1 170 52" fill="none" stroke="#4BE08B" stroke-width="12"/>
        <line x1="110" y1="105" x2="110" y2="30" stroke="#000" stroke-width="2" stroke-dasharray="2 3"/>
        <text x="36" y="98" font-family="'Lilita One',Arial" font-size="11" fill="#000">&lt;180V</text>
        <text x="108" y="24" font-family="'Lilita One',Arial" font-size="11" text-anchor="middle" fill="#000">205V</text>
        <text x="146" y="24" font-family="'Lilita One',Arial" font-size="11" text-anchor="middle" fill="#000">211V</text>
        <text x="178" y="66" font-family="'Lilita One',Arial" font-size="11" fill="#000">220V</text>
        <g class="meter-hand" style="transform:rotate(${angulo}deg)">
          <line x1="110" y1="105" x2="110" y2="36" stroke="#000" stroke-width="4" stroke-linecap="round"/>
          <circle cx="110" cy="105" r="9" fill="#000"/>
        </g>
      </svg>
      <div style="font-family:'Lilita One',Arial; font-size:2.2rem; color:#000; margin-top:4px">${vFinal} Volts</div>
      <div style="font-size:.9rem; font-weight:700; color:#444">Queda de ${quedaV} V (${percQueda}%) na ponta • ${voltStatus}</div>
    </div>

    <div class="slider-box">
      <label><span>Distância da tomada até o motor:</span> <strong>${S.distM} metros</strong></label>
      <input type="range" min="5" max="300" step="5" value="${S.distM}" data-act="slide-dist">
    </div>

    <div class="slider-box">
      <label><span>Bitola (grossura) do cabo de cobre:</span> <strong>${S.fioMm} mm²</strong></label>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-top:6px">
        ${[1.5, 2.5, 4.0, 6.0, 10.0].map(mm => `
          <button class="field ${S.fioMm === mm ? "on" : ""}" data-act="set-fio" data-v="${mm}">${mm} mm²</button>
        `).join("")}
      </div>
    </div>

    <div class="slider-box">
      <label><span>Potência do motor:</span> <strong>${S.potCv} cv (cavalos)</strong></label>
      <div style="display:flex; gap:6px; margin-top:6px">
        ${[1, 2, 3, 5, 7.5].map(cv => `
          <button class="field ${S.potCv === cv ? "on" : ""}" style="flex:1" data-act="set-cv" data-v="${cv}">${cv} cv</button>
        `).join("")}
      </div>
    </div>

    <div style="background:${voltCor}; border:3px solid var(--line); border-radius:12px; padding:12px; margin-top:14px; font-weight:700">
      ${voltMsg}
    </div>
  </div>

  <details class="hint" style="margin-top:16px">
    <summary>O que diz a norma NBR 5410 sobre queda de tensão?</summary>
    <div class="in">
      <p>• <strong>Até 4% de queda (≥ 211 V):</strong> É o limite recomendado para circuitos terminais. O motor parte rápido, não perde torque e mantém a temperatura dentro do projeto.</p>
      <p>• <strong>De 4% a 7% de queda (205 V a 210 V):</strong> Zona de atenção. Aceitável em situações no limite da norma, mas na partida ou com carga pesada o motor já vai sofrer com aquecimento extra.</p>
      <p>• <strong>Acima de 7% de queda (< 205 V):</strong> Reprovado! O enrolamento puxa corrente excessiva para compensar a voltagem baixa. O calor queima o verniz do cobre com o tempo.</p>
      <p>• <strong>Solução na prática:</strong> Se a distância for longa, aumente a bitola do fio (por exemplo, trocar 2,5 mm² por 6 mm² ou 10 mm²).</p>
    </div>
  </details>`;
}

/* ---------- SKILL: Motores da Roça e Oficina ---------- */
function viewRoca() {
  return `
  <h1 class="display" tabindex="-1">Motores da Roça e Oficina</h1>
  <p class="lead">Particularidades e segredos dos motores elétricos nas atividades práticas do dia a dia:</p>
  <div>
    ${MAQUINAS.map(m => `
      <div class="farm-card">
        <div class="farm-ico">${m.ico}</div>
        <div>
          <h3 class="display">${m.t}</h3>
          <p>${m.d}</p>
        </div>
      </div>
    `).join("")}
  </div>
  <div class="card note" style="margin-top:20px">
    <p><strong>💡 Dica do Eletricista Rural:</strong> Guarde sempre o telefone de um rebobinador e do plantão da empresa de energia anotado na porta do quadro de energia do galpão.</p>
  </div>`;
}

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function preprocessImage(img, maxDim = 1200) {
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      const contrasted = Math.min(255, Math.max(0, (gray - 128) * 1.35 + 128));
      d[i] = contrasted;
      d[i + 1] = contrasted;
      d[i + 2] = contrasted;
    }
    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn("Aviso ao aplicar contraste no canvas:", e);
  }
  return canvas;
}

function resetScanner() {
  if (S.scanner.previewUrl) {
    try { URL.revokeObjectURL(S.scanner.previewUrl); } catch (e) {}
  }
  S.scanner.status = "idle";
  S.scanner.previewUrl = null;
  S.scanner.progress = 0;
  S.scanner.stepMsg = "";
  S.scanner.detected = null;
  S.scanner.rawText = "";
  S.scanner.errMsg = "";
  render(true);
}

async function runPlateOCR(file) {
  if (!file) return;

  const objectUrl = URL.createObjectURL(file);
  S.scanner.status = "processing";
  S.scanner.previewUrl = objectUrl;
  S.scanner.progress = 10;
  S.scanner.stepMsg = "Carregando foto e preparando...";
  S.scanner.detected = null;
  S.scanner.rawText = "";
  S.scanner.errMsg = "";
  render(true);

  try {
    // 1. Carrega imagem e pré-processa
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Falha ao abrir a foto da placa."));
      img.src = objectUrl;
    });

    const preprocessedCanvas = preprocessImage(img);

    S.scanner.progress = 25;
    S.scanner.stepMsg = "Iniciando leitor óptico...";
    render(true);

    // 2. Importação dinâmica do Tesseract.js (mantém o bundle inicial leve)
    const { recognize } = await import("tesseract.js");

    S.scanner.progress = 35;
    S.scanner.stepMsg = "Lendo texto da chapa metálica...";
    render(true);

    const res = await recognize(preprocessedCanvas, "por+eng", {
      logger: m => {
        if (m.status === "recognizing text") {
          const p = Math.round((m.progress || 0) * 100);
          S.scanner.progress = 35 + Math.round((m.progress || 0) * 60);
          S.scanner.stepMsg = `Lendo chapa metálica... ${p}%`;
          const pText = document.getElementById("ocr-step-msg");
          if (pText) pText.textContent = S.scanner.stepMsg;
          const pBar = document.getElementById("ocr-progress-bar");
          if (pBar) pBar.style.width = `${S.scanner.progress}%`;
        }
      }
    });

    const rawText = res?.data?.text || "";
    const detected = parsePlateText(rawText);

    if (Object.keys(detected).length > 0) {
      S.scanner.status = "success";
      S.scanner.detected = detected;
      S.scanner.rawText = rawText;
      // Seleciona o primeiro campo detectado para exibir imediatamente a explicação
      const firstKey = detected[Object.keys(detected)[0]].key;
      S.placaField = firstKey;
      toast("Placa lida com sucesso!");
    } else {
      S.scanner.status = "empty";
      S.scanner.detected = null;
      S.scanner.rawText = rawText;
    }
  } catch (err) {
    console.error("Erro no OCR:", err);
    S.scanner.status = "error";
    S.scanner.errMsg = err?.message || "Não foi possível ler a imagem.";
  }

  render(true);
}

/* ---------- SKILL: Ler a Placa do Motor ---------- */
function viewPlaca() {
  const f = PLACA.find(p => p.k === S.placaField);
  const sc = S.scanner;

  let scannerHtml = "";

  if (sc.status === "idle") {
    scannerHtml = `
    <div class="scanner-card">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:14px">
        <div style="font-size:2.2rem; line-height:1">📸</div>
        <div>
          <h2 class="display" style="font-size:1.35rem">Leitor de Placa Inteligente</h2>
          <p style="margin:2px 0 0; font-size:.92rem; color:var(--on-bg-soft)">Tire uma foto da chapa de metal do seu motor que o Doutor lê os dados pra você!</p>
        </div>
      </div>
      <button class="btn btn-yellow btn-big" data-act="trigger-camera" style="width:100%">
        <span class="ico" aria-hidden="true">📷</span>
        <span class="t">Tirar foto da placa</span>
      </button>
      <p style="text-align:center; font-size:.85rem; color:var(--on-bg-soft); margin:8px 0 0">
        Abre a câmera do celular ou permite escolher uma foto da galeria.
      </p>
    </div>`;
  } else if (sc.status === "processing") {
    scannerHtml = `
    <div class="scanner-card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px">
        <div class="scanner-badge pulse">⚡ Analisando Placa...</div>
        <span style="font-size:.85rem; font-weight:700">${sc.progress}%</span>
      </div>

      <div class="scanner-viewfinder">
        <div class="viewfinder-corners">
          <span class="viewfinder-corner-tr"></span>
          <span class="viewfinder-corner-bl"></span>
        </div>
        <div class="scanner-laser"></div>
        <img class="scanner-img" src="${sc.previewUrl}" alt="Foto da placa em análise">
      </div>

      <div class="progress" style="margin:10px 0 8px">
        <span id="ocr-progress-bar" style="width:${sc.progress}%; background:var(--green)"></span>
      </div>

      <p id="ocr-step-msg" style="text-align:center; font-weight:700; font-size:.95rem; margin:6px 0 2px">
        ${sc.stepMsg || "Processando chapa metálica..."}
      </p>
      <p style="text-align:center; font-size:.82rem; color:var(--on-bg-soft); margin:0">
        Aguarde alguns segundos enquanto a inteligência óptica examina os números.
      </p>
    </div>`;
  } else if (sc.status === "success") {
    const keys = Object.keys(sc.detected || {});
    scannerHtml = `
    <div class="scanner-card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px">
        <div class="scanner-badge success">✅ ${keys.length} dados identificados!</div>
        <button class="iconbtn" data-act="reset-scanner" title="Fechar ou tirar outra foto" style="font-size:.95rem; width:34px; height:34px">✕</button>
      </div>

      <p style="margin:0 0 10px; font-size:.92rem; color:var(--on-bg-soft)">
        Toque em qualquer dado lido para ver a explicação detalhada abaixo:
      </p>

      <div class="detected-grid">
        ${keys.map(k => {
          const item = sc.detected[k];
          const isSel = S.placaField === item.key;
          return `
          <button class="detected-item ${isSel ? "active" : ""}" data-act="field" data-k="${item.key}">
            <div class="item-info">
              <span class="item-lbl">${item.label}</span>
              <span class="item-val">${item.val}</span>
            </div>
            <span class="item-ico">${item.ico}</span>
          </button>`;
        }).join("")}
      </div>

      <div style="display:flex; gap:8px; margin-top:10px">
        <button class="btn btn-yellow" data-act="trigger-camera" style="flex:1; padding:8px 12px; font-size:.95rem">
          <span class="ico">📸</span><span><span class="t">Tirar outra foto da placa</span></span>
        </button>
      </div>

      <details class="hint" style="margin-top:12px">
        <summary>Ver texto bruto detectado pelo scanner</summary>
        <div class="in">
          <div class="ocr-raw-box">${escapeHtml(sc.rawText) || "Nenhum texto visível."}</div>
        </div>
      </details>
    </div>`;
  } else if (sc.status === "empty") {
    scannerHtml = `
    <div class="scanner-card">
      <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px">
        ${mascot("worried", "sm")}
        <div>
          <h2 class="display" style="font-size:1.25rem">Não conseguimos ler os dados</h2>
          <p style="margin:2px 0 0; font-size:.9rem; color:var(--on-bg-soft)">A foto pode ter ficado escura, com reflexo ou fora de foco.</p>
        </div>
      </div>

      <div class="card note" style="padding:10px 12px; margin-bottom:12px; font-size:.88rem">
        <p style="margin:0 0 6px"><strong>💡 Dicas para a leitura funcionar:</strong></p>
        <p style="margin:0 0 4px">• Limpe a poeira e a graxa da placa com um pano seco.</p>
        <p style="margin:0 0 4px">• Ligue a lanterna do celular para destacar os números gravados no metal.</p>
        <p style="margin:0">• Aproxime a câmera e enquadre a plaqueta de frente, sem inclinar.</p>
      </div>

      <div style="display:flex; gap:8px">
        <button class="btn btn-yellow btn-big" data-act="trigger-camera" style="flex:1">
          <span class="ico">📷</span><span class="t">Tentar outra foto</span>
        </button>
        <button class="btn" data-act="reset-scanner" style="flex:1">
          <span class="t">Fechar</span>
        </button>
      </div>
    </div>`;
  } else if (sc.status === "error") {
    scannerHtml = `
    <div class="scanner-card">
      <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px">
        ${mascot("danger", "sm")}
        <div>
          <h2 class="display" style="font-size:1.25rem">Ocorreu um problema no leitor</h2>
          <p style="margin:2px 0 0; font-size:.9rem; color:var(--red)">${escapeHtml(sc.errMsg) || "Não foi possível carregar a imagem."}</p>
        </div>
      </div>
      <button class="btn btn-yellow" data-act="trigger-camera" style="width:100%">
        <span class="ico">🔄</span><span class="t">Tentar novamente</span>
      </button>
    </div>`;
  }

  const detectedKeys = sc.detected ? Object.values(sc.detected).map(v => v.key) : [];

  return `
  <h1 class="display" tabindex="-1">Ler a Placa do Motor</h1>
  <p class="lead">Toda placa de motor traz esses dados padronizados. Tire uma foto da placa ou toque nos campos abaixo:</p>

  ${scannerHtml}

  <input type="file" id="plate-photo-input" accept="image/*" capture="environment" style="display:none">

  <h2 class="display" style="font-size:1.3rem; margin:22px 0 10px">Placa Interativa Padrão</h2>
  <div class="placa">
    <span class="screw tl"></span><span class="screw tr"></span>
    <span class="screw bl"></span><span class="screw br"></span>
    <p class="placa-brand">MOTOR DE INDUÇÃO TRIFÁSICO</p>
    <div class="fields">
      ${PLACA.map(p => {
        const isDetected = detectedKeys.includes(p.k);
        const isOn = S.placaField === p.k;
        return `<button class="field ${isOn ? "on" : ""} ${isDetected ? "has-detected" : ""}" data-act="field" data-k="${p.k}" aria-pressed="${isOn}">${p.k}</button>`;
      }).join("")}
    </div>
  </div>

  <div class="card explain" id="placa-explain">
    ${f ? `<h3 class="display">${f.t}</h3><p>${f.d}</p>` : `<h3 class="display">Toque num número da placa</h3><p class="muted">A explicação simples e para que serve aparece aqui sem recarregar a tela.</p>`}
  </div>`;
}

/* ---------- SKILL: Checklist Cuidados de Rotina ---------- */
function loadChecks() {
  try {
    return JSON.parse(localStorage.getItem("ddm-check-v2")) || {};
  } catch (e) {
    return {};
  }
}

function saveChecks(o) {
  try {
    localStorage.setItem("ddm-check-v2", JSON.stringify(o));
  } catch (e) {}
}

function viewCheck() {
  const st = loadChecks();
  return `
  <h1 class="display" tabindex="-1">Cuidados de Rotina</h1>
  <p class="lead">Motor elétrico bem cuidado no sítio dura 20 a 30 anos sem queimar. Marque o que você já fez:</p>
  ${CHECK.map((grp, gi) => `
    <section class="card">
      <h2 class="display">${grp.g}</h2>
      ${grp.items.map((it, ii) => {
        const id = `c${gi}-${ii}`;
        return `
        <label class="chk"><input type="checkbox" data-act="chk" data-k="${id}" ${st[id] ? "checked" : ""}><span>${it}</span></label>`;
      }).join("")}
    </section>`).join("")}
  <div class="actions"><button class="btn btn-big" data-act="resetchk"><span class="ico" aria-hidden="true">🧹</span><span class="t">Desmarcar tudo</span></button></div>`;
}

/* ---------- SKILL: Como o Motor Gira ---------- */
function viewGira() {
  return `
  <h1 class="display" tabindex="-1">Como o Motor Gira</h1>
  <p class="lead">Sem contas difíceis. A mágica da eletricidade em 3 passos:</p>
  <div class="card">
    <svg class="field-anim" viewBox="0 0 180 180" role="img" aria-label="Animação do campo magnético girando e rotor acompanhando">
      <circle cx="90" cy="90" r="82" fill="#FFF4C2" stroke="#000" stroke-width="5"/>
      <g stroke="#000" stroke-width="4" fill="#5AB0FF">
        <rect x="78" y="10" width="24" height="24" rx="5"/>
        <rect x="78" y="146" width="24" height="24" rx="5"/>
        <rect x="10" y="78" width="24" height="24" rx="5"/>
        <rect x="146" y="78" width="24" height="24" rx="5"/>
      </g>
      <circle cx="90" cy="90" r="58" fill="none" stroke="#000" stroke-width="2.5" stroke-dasharray="5 5" opacity=".4"/>
      <g class="spin">
        <circle cx="90" cy="90" r="40" fill="#FFD23F" stroke="#000" stroke-width="5"/>
        <line x1="90" y1="52" x2="90" y2="128" stroke="#000" stroke-width="3" stroke-linecap="round" opacity=".5"/>
        <line x1="52" y1="90" x2="128" y2="90" stroke="#000" stroke-width="3" stroke-linecap="round" opacity=".5"/>
        <path d="M90 90 L90 54" stroke="#000" stroke-width="7" stroke-linecap="round"/>
        <path d="M78 62 L90 48 L102 62 Z" fill="#FF5A52" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
      </g>
      <circle cx="90" cy="90" r="8" fill="#000"/>
    </svg>

    <ol class="steps">
      <li><strong>As bobinas viram eletroímãs:</strong> Quando a energia elétrica entra nos fios de cobre do estator (a parte parada), cria uma força magnética invisível.</li>
      <li><strong>O campo magnético fica rodando:</strong> Como a corrente é alternada e muda 60 vezes por segundo, o magnetismo pula de uma bobina para outra em círculo, dando 1.800 ou 3.600 voltas por minuto.</li>
      <li><strong>O rotor corre atrás do campo:</strong> O rotor (a parte do meio que gira) é arrastado por esse magnetismo. Ele gira um pouquinho mais devagar que o campo (a 1.730 RPM). Esse pequeno atraso se chama <em>escorregamento</em> e é ele que produz a força de arrasto!</li>
    </ol>
  </div>

  <details class="hint" style="margin-top:22px">
    <summary>E por que o motor monofásico precisa de capacitor?</summary>
    <div class="in"><p>No monofásico (2 fios), a corrente só vai e vem numa linha reta, sem girar sozinha. É como um pedal de bicicleta parado em pé no topo: você não sabe se vai pra frente ou pra trás. O capacitor cria um empurrãozinho numa segunda bobina torta, forçando o rotor a escolher o sentido correto e começar a girar.</p></div>
  </details>
  <details class="hint" style="margin-top:14px">
    <summary>Por que o motor esquenta tanto na partida?</summary>
    <div class="in"><p>Quando o eixo está parado no primeiro segundo, não existe contra-força magnética interna. Por um instante, é quase como se a tomada estivesse em curto-circuito direto. O motor puxa até 8 vezes mais corrente do que o normal até pegar velocidade!</p></div>
  </details>`;
}

/* ---------- SKILL: Dicionário do Eletricista ---------- */
function viewDicionario() {
  const query = (S.dictSearch || "").trim().toLowerCase();
  const cat = S.dictCat || "todos";

  const filtered = TERMOS.filter(x => {
    const matchesCat = cat === "todos" || x.cat === cat;
    if (!matchesCat) return false;
    if (!query) return true;
    return (
      x.t.toLowerCase().includes(query) ||
      (x.alias && x.alias.toLowerCase().includes(query)) ||
      (x.d && x.d.toLowerCase().includes(query)) ||
      (x.bad && x.bad.toLowerCase().includes(query)) ||
      (x.tip && x.tip.toLowerCase().includes(query))
    );
  });

  return `
  <h1 class="display" tabindex="-1">Dicionário do Eletricista</h1>
  <p class="lead">30 termos práticos explicados em bom português pra você conversar de igual pra igual na oficina e na loja de peças:</p>

  <div class="dict-search-box">
    <input
      type="search"
      class="dict-search-input"
      placeholder="🔍 Buscar termo (ex.: capacitor, relé, escorregamento...)"
      value="${escapeHtml(S.dictSearch)}"
      data-act="search-dict"
      aria-label="Buscar termo no dicionário"
    >
    ${S.dictSearch ? `<button class="dict-search-clear" data-act="clear-dict" title="Limpar busca">✕</button>` : ""}
  </div>

  <div class="dict-pills" role="tablist" aria-label="Categorias do dicionário">
    ${DICT_CATS.map(c => `
      <button
        class="dict-pill ${cat === c.id ? "active" : ""}"
        data-act="set-dict-cat"
        data-k="${c.id}"
        role="tab"
        aria-selected="${cat === c.id}"
      >
        <span>${c.ico}</span>
        <span>${c.t}</span>
      </button>
    `).join("")}
  </div>

  <div class="dict-count">
    Mostrando <strong>${filtered.length}</strong> de ${TERMOS.length} termos ${cat !== "todos" ? `em <em>${DICT_CATS.find(c => c.id === cat)?.t}</em>` : ""}
  </div>

  ${filtered.length === 0 ? `
    <div class="card" style="text-align:center; padding:30px 16px; margin-top:14px">
      ${mascot("worried", "sm")}
      <h3 class="display" style="font-size:1.25rem; margin:10px 0 6px">Nenhum termo encontrado</h3>
      <p style="margin:0 0 14px; font-size:.92rem; color:var(--on-bg-soft)">Não achamos nada com "${escapeHtml(S.dictSearch)}".</p>
      <button class="btn btn-yellow" data-act="clear-dict"><span class="t">Limpar filtro de busca</span></button>
    </div>
  ` : `
    <div class="stack">
      ${filtered.map(x => {
        const catInfo = DICT_CATS.find(c => c.id === x.cat);
        return `
        <article class="dict-card">
          <div class="dict-card-head">
            <div class="dict-card-ico" aria-hidden="true">${x.ico}</div>
            <div class="dict-card-title">
              <h3 class="display">${x.t}</h3>
              ${x.alias ? `<span class="dict-card-alias">${x.alias}</span>` : ""}
              ${catInfo ? `<span class="dict-cat-tag">${catInfo.ico} ${catInfo.t}</span>` : ""}
            </div>
          </div>

          <div class="dict-box what">
            <span class="dict-box-lbl">💡 O que é na prática</span>
            ${x.d}
          </div>

          ${x.bad ? `
          <div class="dict-box bad">
            <span class="dict-box-lbl">⚠️ Como saber se estragou</span>
            ${x.bad}
          </div>
          ` : ""}

          ${x.tip ? `
          <div class="dict-box tip">
            <span class="dict-box-lbl">🔧 Dica de ouro do técnico</span>
            ${x.tip}
          </div>
          ` : ""}
        </article>`;
      }).join("")}
    </div>
  `}`;
}

/* ---------- Resumo ---------- */
function summary() {
  const s = sym();
  if (!s) return "";
  const d = diagnose();
  let t = `Doutor do Motor - Resumo do Diagnóstico\n\n`;
  t += `🔧 Tipo do Motor: ${TYPES[S.type]?.t || "Não informado"}\n`;
  t += `⚠️ Sintoma observado: ${s.t}\n\n`;
  if (!s.urgent && s.qs) {
    t += `Perguntas e respostas:\n`;
    s.qs.forEach((q, i) => {
      if (S.answers[i] !== undefined && q.opts[S.answers[i]]) {
        t += `• ${q.q} → ${q.opts[S.answers[i]].t}\n`;
      }
    });
    t += `\n`;
  }
  t += `🚦 Gravidade apontada: ${GRAV[d.g].t}\n\n`;
  t += `🔍 Causas mais prováveis:\n`;
  t += d.list.map((c, i) => `${i + 1}. ${CAUSES[c].t}`).join("\n");
  t += `\n\nGerado pelo app Doutor do Motor • Extensão Universitária de Engenharia Elétrica`;
  return t;
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2400);
}

async function copyText(txt) {
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

async function share() {
  const txt = summary();
  if (navigator.share) {
    try {
      await navigator.share({ title: "Doutor do Motor - Diagnóstico", text: txt });
      return;
    } catch (e) {
      if (e && e.name === "AbortError") return;
    }
  }
  toast(await copyText(txt) ? "Resumo copiado com sucesso!" : "Não foi possível copiar");
}

/* ---------- Renderização e Eventos ---------- */
function render(keep) {
  topbar();
  const map = {
    home: viewHome,
    type: viewType,
    symptom: viewSymptom,
    question: viewQuestion,
    result: viewResult,
    placa: viewPlaca,
    polias: viewPolias,
    extensao: viewExtensao,
    roca: viewRoca,
    check: viewCheck,
    gira: viewGira,
    dicionario: viewDicionario
  };
  $app.innerHTML = map[S.view] ? map[S.view]() : viewHome();
  if (keep) return;
  window.scrollTo(0, 0);
  const h = $app.querySelector("[tabindex='-1']");
  if (h) h.focus({ preventScroll: true });
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act;
  haptic(10);

  if (a === "back") back();
  else if (a === "home") go("home");
  else if (a === "start") { S.type = null; S.sym = null; S.qi = 0; S.answers = []; go("type"); }
  else if (a === "go") go(b.dataset.v);
  else if (a === "type") { S.type = b.dataset.k; go("symptom"); }
  else if (a === "sym") { S.sym = b.dataset.k; S.qi = 0; S.answers = []; go(sym().urgent ? "result" : "question"); }
  else if (a === "ans") {
    S.answers[S.qi] = +b.dataset.i;
    if (S.qi < sym().qs.length - 1) { S.qi++; render(); } else go("result");
  }
  else if (a === "share") share();
  else if (a === "restart") { S.type = null; S.sym = null; S.qi = 0; S.answers = []; go("type"); }
  else if (a === "field") {
    S.placaField = b.dataset.k;
    render(true);
    const expl = document.getElementById("placa-explain");
    if (expl) expl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const x = $app.querySelector(`.field[data-k="${CSS.escape(S.placaField)}"]`);
    if (x) x.focus();
  }
  else if (a === "trigger-camera") {
    const inp = document.getElementById("plate-photo-input");
    if (inp) inp.click();
  }
  else if (a === "reset-scanner") {
    resetScanner();
  }
  else if (a === "resetchk") { saveChecks({}); render(true); toast("Checklist zerado!"); }
  else if (a === "set-rpm") { S.rpmMotor = +b.dataset.v; render(true); }
  else if (a === "set-fio") { S.fioMm = +b.dataset.v; render(true); }
  else if (a === "set-cv") { S.potCv = +b.dataset.v; render(true); }
  else if (a === "set-dict-cat") { S.dictCat = b.dataset.k; render(true); }
  else if (a === "clear-dict") {
    S.dictSearch = "";
    render(true);
    const inp = document.querySelector(".dict-search-input");
    if (inp) inp.focus();
  }
});

document.addEventListener("input", e => {
  const el = e.target;
  if (!el.dataset) return;
  if (el.dataset.act === "slide-motor") { S.dMotor = +el.value; render(true); }
  else if (el.dataset.act === "slide-maq") { S.dMaq = +el.value; render(true); }
  else if (el.dataset.act === "slide-dist") { S.distM = +el.value; render(true); }
  else if (el.dataset.act === "search-dict") {
    S.dictSearch = el.value;
    render(true);
    const inp = document.querySelector(".dict-search-input");
    if (inp) {
      inp.focus();
      const len = inp.value.length;
      inp.setSelectionRange(len, len);
    }
  }
});

document.addEventListener("change", e => {
  const el = e.target;
  if (el.id === "plate-photo-input" && el.files && el.files[0]) {
    runPlateOCR(el.files[0]);
    el.value = "";
    return;
  }
  if (el.dataset && el.dataset.act === "chk") {
    const st = loadChecks();
    st[el.dataset.k] = el.checked;
    saveChecks(st);
  }
});

// Inicialização
render();
