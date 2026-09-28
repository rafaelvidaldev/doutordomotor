/**
 * Parser de texto OCR para plaquetas de motores elétricos.
 * Extrai parâmetros padronizados: potência, tensão, rotação, corrente, IP, FS, etc.
 */

export function parsePlateText(rawText) {
  if (!rawText || typeof rawText !== "string") return {};

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const text = rawText.replace(/\r\n/g, "\n");
  const results = {};

  // 1. Tipo de Alimentação (Fases: Trifásico ou Monofásico)
  if (/\b(3\s*~|TRIF[AÁ]SICO|TRIF\b|3\s*PH|3\s*FASE)/i.test(text)) {
    results.fases = {
      val: "Trifásico (3~)",
      key: "3~",
      ico: "⚡",
      label: "Alimentação (Fases)",
      desc: "Motor trifásico: necessita de 3 fases vivas da rede (muito comum em granjas e oficinas com padrão trifásico)."
    };
  } else if (/\b(1\s*~|MONOF[AÁ]SICO|MONO\b|1\s*PH|1\s*FASE)/i.test(text)) {
    results.fases = {
      val: "Monofásico (1~)",
      key: "3~",
      ico: "⚡",
      label: "Alimentação (Fases)",
      desc: "Motor monofásico: funciona com duas pontas de fase ou fase + neutro. Típico de bombas de água e serras residenciais."
    };
  }

  // 2. Potência (cv, hp, kW)
  let potVal = null;
  // Procura padrões como "2 cv", "1.5 kW", "3 CV", "1/2 cv", "0.75 kw"
  const potMatch = text.match(/\b([0-9]+[.,][0-9]+|[0-9]+\/[0-9]+|[0-9]+)\s*(?:cv|hp|kw)\b/i);
  if (potMatch) {
    potVal = potMatch[0].trim();
  } else {
    // Procura na linha com prefixo KW ou CV ou POT
    for (const line of lines) {
      const m = line.match(/(?:KW|CV|HP|POT[EÊ]NCIA|POWER)[\s\:\-\(\)]+([0-9]+[.,]?[0-9]*|[0-9]+\/[0-9]+)/i);
      if (m) {
        potVal = `${m[1]} cv`;
        break;
      }
    }
  }
  if (potVal) {
    results.potencia = {
      val: potVal,
      key: "2 cv",
      ico: "🐎",
      label: "Potência no Eixo",
      desc: `Potência identificada: ${potVal}. Mede a força mecânica que o eixo entrega à carga (polia, lâmina, bomba) sem perder o embalo.`
    };
  }

  // 3. Tensão / Voltagem (V)
  let tensaoVal = null;
  // Ex: 220/380, 220/440, 380/660, 127/220
  const vMultiMatch = text.match(/\b([1-4][0-9]{2}\s*[\/\-]\s*[1-6][0-9]{2}(?:\s*[\/\-]\s*[6-8][0-9]{2})?)\s*V?\b/i);
  if (vMultiMatch) {
    tensaoVal = vMultiMatch[1].replace(/\s+/g, "") + " V";
  } else {
    const vSingleMatch = text.match(/\b([1-4][0-9]{2})\s*V\b/i) || text.match(/(?:TENS[AÃ]O|VOLTS?)\s*[:=]?\s*([1-4][0-9]{2})\b/i);
    if (vSingleMatch) {
      tensaoVal = (vSingleMatch[1] || vSingleMatch[2]) + " V";
    }
  }
  if (tensaoVal) {
    results.tensao = {
      val: tensaoVal,
      key: "220/380 V",
      ico: "🔌",
      label: "Tensão de Ligação",
      desc: `Tensão identificada: ${tensaoVal}. Voltagem da rede onde o motor pode trabalhar (ligação estrela ou triângulo).`
    };
  }

  // 4. Corrente Nominal (Amperes - A)
  let currVal = null;
  for (const line of lines) {
    const m = line.match(/^(?:A|IN|I_N|CORRENTE|AMPERES?)\b\s*[:=]?\s*([0-9]{1,3}(?:[.,][0-9]+)?(?:\s*[\/\-]\s*[0-9]{1,3}(?:[.,][0-9]+)?)*)\s*A?/i);
    if (m && (!m[1].includes("/") || Number(m[1].split("/")[0]) < 100)) {
      currVal = m[1].replace(/\s+/g, "") + " A";
      break;
    }
  }
  if (!currVal) {
    const currMatch = text.match(/\b([0-9]{1,2}(?:[.,][0-9]+)?\s*[\/\-]\s*[0-9]{1,2}(?:[.,][0-9]+)?)\s*A\b/i) ||
                      text.match(/(?:CORRENTE|IN|I_N)\s*[:=]?\s*([0-9]{1,3}(?:[.,][0-9]+)?)\s*A?\b/i);
    if (currMatch) {
      currVal = currMatch[1].replace(/\s+/g, "") + " A";
    }
  }
  if (currVal) {
    results.corrente = {
      val: currVal,
      key: "5,8/3,4 A",
      ico: "🔋",
      label: "Corrente Nominal (A)",
      desc: `Corrente identificada: ${currVal}. Amperagem de serviço em carga total, essencial para regular o relé térmico e o disjuntor.`
    };
  }

  // 5. Rotação (RPM)
  let rpmVal = null;
  const rpmMatch = text.match(/\b(3[3-6][0-9]{2}|1[6-8][0-9]{2}|1[1-2][0-9]{2}|8[5-9][0-9])\s*(?:RPM|min-1|\/min)?\b/i) ||
                   text.match(/(?:RPM|ROTA[CÇ][AÃ]O|MIN-1)\s*[:=]?\s*([0-9]{3,4})\b/i);
  if (rpmMatch) {
    const num = (rpmMatch[1] || rpmMatch[0]).match(/[0-9]{3,4}/);
    if (num) {
      rpmVal = num[0] + " RPM";
      results.rotacao = {
        val: rpmVal,
        key: "1730 rpm",
        ico: "🔄",
        label: "Rotação (RPM)",
        desc: `Rotação identificada: ${rpmVal}. Voltas por minuto do eixo em velocidade normal de operação com carga.`
      };
    }
  }

  // 6. Frequência (Hz)
  const hzMatch = text.match(/\b(50|60)\s*Hz\b/i) || text.match(/HZ\s*[:=]?\s*(50|60)\b/i);
  if (hzMatch) {
    const val = (hzMatch[1] || hzMatch[2] || "60") + " Hz";
    results.hz = {
      val,
      key: "60 Hz",
      ico: "⏱️",
      label: "Frequência da Rede",
      desc: `Frequência identificada: ${val}. Padrão oficial brasileiro de 60 ciclos por segundo.`
    };
  }

  // 7. Fator de Serviço (FS)
  const fsMatch = text.match(/(?:FS|S\.F\.|F\.S\.)\s*[:=]?\s*([0-9]+[.,][0-9]+)/i);
  if (fsMatch) {
    const val = "FS " + fsMatch[1].replace(",", ".");
    results.fs = {
      val,
      key: "FS 1,15",
      ico: "📈",
      label: "Fator de Serviço (FS)",
      desc: `Fator de serviço: ${val}. Capacidade de suportar esforço extra pontual acima do nominal sem queimar.`
    };
  }

  // 8. Grau de Proteção (IP)
  const ipMatch = text.match(/\bIP\s*[:=]?\s*([0-9]{2})\b/i);
  if (ipMatch) {
    const val = "IP" + ipMatch[1];
    results.ip = {
      val,
      key: "IP55",
      ico: "🛡️",
      label: "Grau de Proteção (IP)",
      desc: `Grau de proteção: ${val}. Resistência da carcaça contra poeira de pó/grão e jatos de água.`
    };
  }

  // 9. Classe de Isolamento
  const isolMatch = text.match(/(?:ISOL|CLASSE|CLASS)\s*[:.]?\s*([A-H])\b/i);
  if (isolMatch) {
    const val = "Isol. " + isolMatch[1].toUpperCase();
    results.isol = {
      val,
      key: "Isol. F",
      ico: "🌡️",
      label: "Classe de Isolamento",
      desc: `Isolamento: ${val}. Limite térmico do verniz dos fios de cobre (Classe F suporta até 155 °C contínuos).`
    };
  }

  // 10. Rendimento (η)
  const rendMatch = text.match(/(?:REND|RENDIMENTO|[ηn])\s*[:=]?\s*([0-9]{2}(?:[.,][0-9]+)?)\s*%/i) ||
                    text.match(/([0-9]{2}[.,][0-9]+)\s*%\s*(?:REND)?/i);
  if (rendMatch) {
    const val = rendMatch[1] + "%";
    results.rend = {
      val: "η " + val,
      key: "η 84%",
      ico: "🌱",
      label: "Rendimento",
      desc: `Rendimento identificado: ${val}. Porcentagem de energia elétrica aproveitada como movimento no eixo.`
    };
  }

  return results;
}
