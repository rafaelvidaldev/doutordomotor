# Doutor do Motor 🩺⚡

> Ferramenta interativa de diagnóstico e dimensionamento de motores elétricos voltada para leigos, produtores rurais, marcenarias, serralherias e pequenas oficinas.

Faz parte de um projeto de extensão universitária do curso de **Engenharia Elétrica**, disciplina de **Máquinas Elétricas e Acionamento**.

---

## 🚀 Sobre o Projeto

O **Doutor do Motor** foi desenvolvido com foco em acessibilidade e facilidade de uso em dispositivos móveis via link direto de WhatsApp. Utiliza linguagem simples, direta e sem jargões técnicos, permitindo que quem está na lida diária descubra a causa provável de defeitos em motores elétricos e tome decisões seguras.

### ✨ Funcionalidades Principais

1. **🩺 Diagnóstico Passo a Passo:**
   - Apoio para motores **Monofásicos** e **Trifásicos**.
   - Identificação rápida de 7 sintomas comuns (não liga, esquenta, barulho/vibração, desarma disjuntor, perde força, cheiro de queimado e choque).
   - Semáforo pedagógico de gravidade (Verde = simples, Amarelo = atenção, Vermelho = perigo).
   - Card *"Faça Agora"* para situações urgentes e avisos de segurança prioritários.
   - Envio automático de resumo detalhado via **WhatsApp** ou **Compartilhar** do celular para o eletricista.

2. **⚙️ Casamento de Polias Animado:**
   - Calculadora interativa com animação em tempo real de correia e rotação (RPM).
   - Ajuste de diâmetro das polias do motor e da máquina para saber a velocidade final.

3. **📏 Teste de Extensão & Voltímetro Animado:**
   - Simulação visual analógica de queda de tensão em função da distância (metros), espessura do cabo (mm²) e potência do motor (cv).
   - Alertas visuais contra o problema de subtensão em redes longas.

4. **🚜 Guia de Aplicações Práticas:**
   - Dicas e cuidados para ordenhadeiras, resfriadores de leite, ensiladeiras, picadores, estufas e bombas de água.

5. **🏷️ Leitura Interativa da Placa do Motor:**
   - Plaqueta metálica com 10 campos clicáveis explicando cv, rotação, tensões (220/380V), fator de serviço (FS) e índice de proteção (IP55).

6. **🧽 Cuidados de Rotina (Checklist):**
   - Lista semanal, mensal e anual com salvamento local no aparelho.

7. **🌀 Como o Motor Gira por Dentro:**
   - Infográfico animado em SVG demonstrando campo girante, eletroímãs e o princípio de escorregamento do rotor de indução.

8. **📖 Dicionário do Eletricista:**
   - Tradução de termos técnicos (relé térmico, capacitor de partida, disjuntor curva C, chave estrela-triângulo) para analogias do cotidiano.

---

## 🎨 Design e Stack

- **Stack 100% nativa:** Único arquivo `index.html` contendo HTML5, CSS3 e Vanilla JavaScript inline. Sem build, sem bundler e sem dependências externas pesadas.
- **Identidade Visual Neobrutalista Cartunesca:** Bordas pretas grossas (3px), sombras chapadas sólidas, cores vibrantes com alto contraste e botões de toque com resposta tátil de afundamento.
- **Mascote Original SVG:** Motorzinho com expressões dinâmicas para 4 humores (*feliz*, *pensativo*, *preocupado* e *em perigo*).
- **Acessibilidade:** Suporte a modo escuro (`prefers-color-scheme`), contraste elevado, áreas de toque ≥ 48px e respeito a movimento reduzido (`prefers-reduced-motion`).

---

## 📦 Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador moderno (computador ou celular) ou disponibilizar o arquivo em serviços de hospedagem estática como GitHub Pages, Vercel ou Netlify.

---

## 👤 Autor

- **Rafael Vidal**
- Projeto de extensão universitária de Engenharia Elétrica — Máquinas Elétricas e Acionamento.
