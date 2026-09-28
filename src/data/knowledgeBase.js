export const CAUSES = {
  sem_energia: {
    t: "A energia não está chegando ao motor",
    g: 1,
    check: [
      "Veja se o disjuntor do galpão ou da casa desarmou.",
      "Confira se o plugue na tomada está firme e se a tomada funciona ligando outro aparelho.",
      "Se usa chave alavanca ou botão liga/desliga, veja se não quebrou por dentro."
    ],
    pro: "Se a tomada tem energia e o disjuntor está armado, o problema pode estar no botão, na fiação até o motor ou dentro da carcaça. Chame o eletricista.",
    why: "Silêncio total significa que a corrente elétrica nem entra nas bobinas. Sem corrente não existe campo magnético, e sem campo o motor não sai do lugar."
  },
  capacitor: {
    t: "Capacitor fraco ou queimado",
    g: 1,
    only: "mono",
    check: [
      "Com o motor fora da tomada, olhe aquele cilindro preto ou prata preso em cima da carcaça.",
      "Sinais clássicos de defeito: estufado parecendo lata de cerveja amassada, trincado, vazando óleo ou cheirando a queimado."
    ],
    pro: "A peça é barata na agropecuária ou loja elétrica, mas o capacitor guarda choque mesmo desligado! Peça para o eletricista descarregar e colocar outro do mesmo valor de microfarads (µF) e voltagem.",
    why: "O motor monofásico de 2 fios sozinho não sabe para qual lado girar. O capacitor atrasa a corrente numa bobina auxiliar e dá o 'empurrão' de partida. Quando estraga, o motor só ronca e esquenta até queimar."
  },
  centrifuga: {
    t: "Chave centrífuga suja ou travada",
    g: 1,
    only: "mono",
    check: [
      "Desconfie dela se o motor zumbe e só pega no tranco, ou se esquenta fervendo logo depois de ligar.",
      "Não abra o motor: essa pecinha com molas e platinado fica escondida na tampa traseira."
    ],
    pro: "Comum pegar serragem, poeira de ração ou fuligem no contato. Precisa abrir a tampa traseira para lixar ou trocar a chave centrífuga e o platinado.",
    why: "A chave centrífuga liga a bobina de partida no começo e desliga com a força centrífuga quando o motor atinge 75% da rotação. Se travar aberta, não parte; se travar fechada, a bobina de partida cozinha."
  },
  falta_fase: {
    t: "Falta de uma das fases (motor em 2 fases)",
    g: 2,
    only: "tri",
    check: [
      "Desligue imediatamente! Motor trifásico funcionando em duas fases queima em poucos minutos.",
      "Veja no quadro se um fusível queimou ou se caiu um polo do disjuntor tripolar.",
      "Pergunte ao vizinho se a rede elétrica da região está oscilando ou com problemas."
    ],
    pro: "O eletricista vai medir a tensão entre as três fases com multímetro. Se a falta vier da rede da concessionária, ligue para a empresa de energia da sua região.",
    why: "O motor trifásico precisa das 3 fases alternadas para criar o campo magnético que gira sozinho. Faltando uma, o rotor fica puxando corrente absurda nas outras duas bobinas até derreter o verniz."
  },
  travado: {
    t: "Eixo travado ou carga pesada demais",
    g: 1,
    check: [
      "Com o motor DESLIGADO da tomada, tente girar o eixo com a mão.",
      "Se tiver correia, tire a correia e gire o motor solto. Se ficar leve, o problema é a máquina (ensiladeira, picador, moenda) e não o motor!",
      "Procure pedaço de madeira, pedra, cordão, sabugo ou ração empedrada travando a navalha."
    ],
    pro: "Se o eixo do motor continuar pesado mesmo sem correia e sem nada preso, o rolamento interno fundiu.",
    why: "Na hora de sair do zero, o motor puxa de 6 a 8 vezes a corrente normal para vencer a inércia. Se a máquina está travada, essa corrente monstruosa não baixa e queima o motor em segundos."
  },
  rolamento: {
    t: "Rolamento gasto ou estragado",
    g: 1,
    check: [
      "Motor desligado da energia: gire o eixo devagar com a mão. Sente arranhar como se tivesse areia dentro?",
      "Tente chacoalhar o eixo para cima e para baixo. Não pode ter nenhuma folga ou jogo."
    ],
    pro: "A troca dos rolamentos (ex.: 6204, 6205) é rápida com saca-polia. Não espere: rolamento ruim deixa o rotor raspar no estator e destrói o motor por dentro.",
    why: "O rolamento deixa o rotor girar no centro com mínimo atrito. Quando as esferas gastam, o atrito gera calor brutal e o rotor raspa nas bobinas."
  },
  subtensao: {
    t: "Queda de tensão (fim de linha na roça ou fio fino)",
    g: 1,
    check: [
      "Usa extensão comprida de fio fino (1,5mm ou 2,5mm)? Evite ao máximo.",
      "Repare se a luz do galpão amarela e enfraquece na hora que liga o motor.",
      "Piora no fim da tarde, quando vizinhos ligam resfriadores de leite e chuveiros."
    ],
    pro: "O eletricista mede a voltagem com o motor roncando. Se cair para menos do limite da NBR 5410, precisa engrossar os fios da instalação ou solicitar reforço de transformador à distribuidora.",
    why: "Para entregar a mesma força com menos voltagem, a física exige que a corrente (amperes) aumente. E o calor gerado no fio sobe com o QUADRADO da corrente. Fio fino na roça ferve motor!"
  },
  sobrecarga: {
    t: "Motor trabalhando além do que aguenta",
    g: 1,
    check: [
      "A máquina está pedindo mais força do que o normal? Lâmina do triturador cega, correia esticada como corda de violão, madeira muito dura e verde?",
      "Confira se o motor tem cavalos (cv) suficientes para a máquina."
    ],
    pro: "O eletricista coloca o alicate amperímetro no fio com a máquina operando e confere se a corrente passou da amperagem nominal indicada na placa.",
    why: "Quanto mais peso o motor empurra, mais corrente ele puxa. Passou do limite da placa, as bobinas esquentam além do limite térmico do verniz isolante."
  },
  ventilacao: {
    t: "Ventilação entupida com poeira ou palha",
    g: 0,
    check: [
      "Com o motor frio e desligado, olhe as aletas de ferro e a grade da hélice atrás.",
      "Em galpão de fumo, marcenaria ou paiol, palha, serragem e teia de aranha tampam a passagem de ar.",
      "Passe uma escova ou pincel seco para tirar a crosta de sujeira."
    ],
    pro: "Se as aletas estão limpas e o motor continua fervendo em menos de 10 minutos, o defeito é elétrico ou mecânico.",
    why: "A hélice traseira sopra vento pelas aletas de ferro da carcaça. Uma camada de pó de 2 milímetros funciona como um cobertor térmico: o calor fica preso e cozinha o motor."
  },
  partidas: {
    t: "Liga e desliga vezes demais sem descanso",
    g: 1,
    check: [
      "Conte quantas partidas ele dá por hora.",
      "Em bomba d'água de poço ou cisterna, veja se a boia elétrica não está oscilando ou se o pressostato está desregulado."
    ],
    pro: "Um eletricista pode instalar relé temporizador ou partida suave (soft-starter) para proteger a rede da propriedade.",
    why: "Toda partida puxa um pico brutal de corrente que esquenta os fios. Muitas partidas seguidas não dão tempo de esfriar, acumulando calor até derreter o isolamento."
  },
  correia: {
    t: "Correia frouxa, gasta ou desalinhada",
    g: 0,
    check: [
      "Com a máquina desligada, aperte a correia no meio com o polegar: deve ceder de 1 a 2 cm.",
      "Se tiver pó preto no chão ou a correia estiver espelhada e brilhando, ela está patinando.",
      "Use uma régua encostada nas duas polias para ver se estão retinhas."
    ],
    pro: "Troque a correia por uma nova do perfil correto (tipo A, B ou V). Se as polias estiverem gastas em fundo de garganta, troque a polia.",
    why: "Correia frouxa patina e o motor perde rendimento; correia apertada demais mói o rolamento e empena a ponta do eixo."
  },
  base_solta: {
    t: "Base ou parafusos frouxos vibrando",
    g: 0,
    check: [
      "Motor desligado: aperte com chave os parafusos que prendem as sapatas do motor na bancada.",
      "Veja se o esticador do motor não trincou ou se a tábua da base não apodreceu."
    ],
    pro: "Se apertar os parafusos não sumir a vibração, o defeito pode ser desbalanceamento ou rolamento.",
    why: "Motor de alta rotação solto vibra e vai afrouxando fiações e conexões elétricas, além de quebrar as sapatas de ferro fundido."
  },
  desbalanceamento: {
    t: "Hélice, navalha ou disco desbalanceado",
    g: 1,
    check: [
      "Veja se a navalha da ensiladeira quebrou um dente, ou se a serra está faltando pastilha de metal duro.",
      "Pedaço de barro ou massa de graxa grudada de um lado só da polia também desbalanceia."
    ],
    pro: "Lâminas de alta rotação precisam ser balanceadas aos pares com balança ou gabarito.",
    why: "A 1.750 ou 3.500 voltas por minuto, qualquer grama de diferença de peso puxa o eixo com força centrífuga brutal, destruindo rolamentos e mancais."
  },
  isolamento: {
    t: "Umidade ou verniz das bobinas estragado",
    g: 2,
    check: [
      "O motor tomou chuva, inundação de sanga ou ficou muito tempo em galpão úmido e mofado?",
      "NUNCA ligue motor molhado direto na tomada!"
    ],
    pro: "O eletricista mede o isolamento com o aparelho Megômetro. Se for só umidade, basta estufar o motor numa lâmpada ou estufa por 24h para secar.",
    why: "O fio de cobre é coberto por verniz microscópico. Umidade penetra nas microfissuras e faz a corrente vazar para a carcaça de ferro, desarmando o DR e dando choque mortal."
  },
  curto: {
    t: "Bobina queimada ou em curto-circuito",
    g: 2,
    check: [
      "Sinais claros: cheiro forte de verniz queimado (cheiro acre inconfundível), fumaça preta ou disjuntor caindo na hora que bate a chave.",
      "Não tente ligar de novo para não derreter o restante dos fios."
    ],
    pro: "Leve para uma oficina de rebobinamento de confiança. Eles vão trocar os enrolamentos de cobre e isolar novamente.",
    why: "O verniz derreteu pelo calor e fios vivos encostaram direto uns nos outros. A corrente dá um salto curto e gera fogo instantâneo."
  },
  protecao: {
    t: "Disjuntor ou relé térmico inadequado",
    g: 1,
    check: [
      "O disjuntor foi trocado por um qualquer? Motor elétrico precisa de disjuntor de curva 'C' ou 'D', que aguenta o pico inicial de partida sem desarmar.",
      "Confira a amperagem na placa do motor."
    ],
    pro: "O eletricista ajusta o relé térmico da contatora exatamente no valor da corrente nominal de serviço indicada na placa.",
    why: "Disjuntor residencial comum curva B cai com qualquer pico de motor. Já colocar disjuntor exagerado (ex: 50A para motor de 10A) não protege nada e deixa o motor queimar sem cair a chave."
  },
  aterramento: {
    t: "Falta de fio terra (risco grave de choque)",
    g: 2,
    check: [
      "Pare de tocar na carcaça! O motor está perigoso.",
      "Existe fio verde ou verde-amarelo conectado à haste de cobre fincada na terra? Se não tem, a carcaça fica eletrificada."
    ],
    pro: "Chame o eletricista com urgência para instalar a haste de terra e o disjuntor DR (Diferencial Residual).",
    why: "Sem o fio terra, se houver qualquer fuga de eletricidade da bobina para a carcaça de ferro, quem encostar no motor vira o caminho da corrente até o chão."
  }
};

export const SYMPTOMS = [
  {
    id: "nao_parte",
    ico: "🔌",
    t: "Não liga ou só zumbe",
    s: "Bate a chave e o motor não gira",
    fallback: ["sem_energia", "capacitor", "falta_fase"],
    qs: [
      {
        q: "Quando você liga a chave, o que acontece?",
        opts: [
          { t: "Faz um zumbido 'hummm', mas não sai do lugar", fx: { capacitor: 3, falta_fase: 3, travado: 2, centrifuga: 1 } },
          { t: "Silêncio total, nem sinal de vida", fx: { sem_energia: 5 } },
          { t: "Começa a rodar bem devagarinho e logo para ou cai o disjuntor", fx: { sobrecarga: 2, travado: 2, subtensao: 2, capacitor: 1 } }
        ]
      },
      {
        q: "Com o motor fora da tomada, o eixo gira leve com a mão?",
        h: "Cuidado: tire da energia antes de encostar a mão no eixo ou polia.",
        opts: [
          { t: "Sim, gira solto e levinho", fx: { capacitor: 1, falta_fase: 1, centrifuga: 1 } },
          { t: "Não, está pesado, travado ou arranhando", fx: { travado: 3, rolamento: 2 } },
          { t: "Não sei dizer", fx: {} }
        ]
      },
      {
        q: "As lâmpadas do galpão ou outros aparelhos também estão fracos?",
        opts: [
          { t: "Sim, a luz amarela ou a rede toda enfraquece", fx: { subtensao: 2, falta_fase: 2, sem_energia: 1 } },
          { t: "Não, só o motor está com problema", fx: { capacitor: 1, centrifuga: 1 } },
          { t: "Não reparei", fx: {} }
        ]
      }
    ]
  },
  {
    id: "esquenta",
    ico: "🔥",
    t: "Esquenta demais",
    s: "Não dá nem para deixar a mão na carcaça",
    fallback: ["ventilacao", "sobrecarga", "subtensao"],
    base: [{ c: "falta_fase", v: 1 }],
    qs: [
      {
        q: "Onde esse motor trabalha no sítio?",
        opts: [
          { t: "Lugar com pó de serra, palha de milho, fumo ou dentro de caixa", fx: { ventilacao: 3 } },
          { t: "Lugar limpo, ventilado e arejado", fx: { sobrecarga: 1 } }
        ]
      },
      {
        q: "Ele fica ligando e desligando toda hora?",
        opts: [
          { t: "Sim, muitas vezes por hora (ex.: bomba ou compressor)", fx: { partidas: 3 } },
          { t: "Não, trabalha direto", fx: {} },
          { t: "Não sei", fx: {} }
        ]
      },
      {
        q: "Usa extensão comprida ou fica longe do transformador da rede?",
        h: "Propriedades no fim da rede rural costumam ter esse problema.",
        opts: [
          { t: "Sim, fica longe ou usa extensão de fio fino", fx: { subtensao: 3 } },
          { t: "Não, fiação grossa e perto do quadro", fx: {} }
        ]
      },
      {
        q: "A máquina está exigindo mais força do que antes?",
        h: "Lâmina cega no triturador, correia muito esticada, bomba puxando com sujeira.",
        opts: [
          { t: "Sim, o serviço está mais pesado", fx: { sobrecarga: 3 } },
          { t: "Não, serviço normal de sempre", fx: {} },
          { t: "Não reparei", fx: {} }
        ]
      },
      {
        q: "Além do calor, o motor faz barulho estranho?",
        opts: [
          { t: "Sim, chia como se tivesse areia ou ronca forte", fx: { rolamento: 2, falta_fase: { tri: 2 } } },
          { t: "Não, barulho parece normal", fx: {} }
        ]
      }
    ]
  },
  {
    id: "barulho",
    ico: "📢",
    t: "Barulho ou vibração",
    s: "Ronca, chia, apita ou treme a bancada",
    fallback: ["rolamento", "base_solta", "desbalanceamento"],
    qs: [
      {
        q: "Como é o som do barulho?",
        opts: [
          { t: "Chiado, apito contínuo ou raspado de areia", fx: { rolamento: 3 } },
          { t: "Pancada, trepidação ou chacoalho", fx: { base_solta: 2, desbalanceamento: 2, correia: 1 } },
          { t: "Zumbido elétrico forte e ele esquenta rápido", fx: { falta_fase: 3, centrifuga: 2, subtensao: 1 } }
        ]
      },
      {
        q: "Com o motor desligado da tomada, o eixo tem jogo ou folga?",
        opts: [
          { t: "Sim, balança para os lados ou arranha", fx: { rolamento: 3 } },
          { t: "Não, parece firme", fx: { base_solta: 1, desbalanceamento: 1 } },
          { t: "Não sei avaliar", fx: {} }
        ]
      },
      {
        q: "Você trocou ou mexeu em alguma peça recentemente?",
        h: "Troca de polia, lâmina, faca da forrageira ou correia.",
        opts: [
          { t: "Sim, mexi há pouco tempo", fx: { desbalanceamento: 2, correia: 2, base_solta: 1 } },
          { t: "Não, tudo igual há meses", fx: {} }
        ]
      },
      {
        q: "Os parafusos que seguram o motor na base estão bem apertados?",
        opts: [
          { t: "Sim, bem firmes", fx: {} },
          { t: "Estão frouxos, com tábua podre ou não sei", fx: { base_solta: 2 } }
        ]
      }
    ]
  },
  {
    id: "desarma",
    ico: "⚡",
    t: "Desarma o disjuntor",
    s: "Bate a chave e o disjuntor cai na hora ou depois",
    fallback: ["protecao", "sobrecarga", "isolamento"],
    qs: [
      {
        q: "Em que momento o disjuntor cai?",
        opts: [
          { t: "No exato segundo em que liga a chave", fx: { curto: 2, protecao: 2, travado: 1 } },
          { t: "Depois de alguns minutos trabalhando no esforço", fx: { sobrecarga: 2, subtensao: 1, ventilacao: 1 } },
          { t: "Desarma o DR, ou só cai em dias de chuva e cerração", fx: { isolamento: 3 } }
        ]
      },
      {
        q: "O motor pegou umidade, chuva ou ficou meses parado no galpão?",
        opts: [
          { t: "Sim, ficou no úmido ou muito tempo sem uso", fx: { isolamento: 3 } },
          { t: "Não, galpão seco e trabalha sempre", fx: {} }
        ]
      },
      {
        q: "O disjuntor foi trocado há pouco tempo por outro?",
        opts: [
          { t: "Sim, trocou recentemente", fx: { protecao: 3 } },
          { t: "Não, é o mesmo antigo", fx: {} },
          { t: "Não sei", fx: {} }
        ]
      },
      {
        q: "Sentiu cheiro forte de queimado ou viu fumaça saindo?",
        opts: [
          { t: "Sim, cheiro forte ou fumacinha", fx: { curto: 5 }, red: true },
          { t: "Não, nada de fumaça", fx: {} }
        ]
      }
    ]
  },
  {
    id: "fraco",
    ico: "🐢",
    t: "Perde força no serviço",
    s: "Engasga quando bota peso ou perde o embalo",
    fallback: ["subtensao", "sobrecarga", "correia"],
    base: [{ c: "capacitor", v: 2 }],
    qs: [
      {
        q: "Usa extensão de fio ou o motor fica longe do quadro?",
        h: "Fio fino e longo rouba muita força do motor.",
        opts: [
          { t: "Sim, extensão comprida ou fio fino", fx: { subtensao: 3 } },
          { t: "Não, cabo grosso e curto", fx: {} }
        ]
      },
      {
        q: "As lâmpadas da propriedade enfraquecem quando o motor pega?",
        opts: [
          { t: "Sim, a luz cai na hora", fx: { subtensao: 2 } },
          { t: "Não, fica estável", fx: {} },
          { t: "Não reparei", fx: {} }
        ]
      },
      {
        q: "Ele toca a máquina por correia?",
        opts: [
          { t: "Sim, e a correia chia, escorrega ou tem pó preto", fx: { correia: 3 } },
          { t: "Sim, mas a correia parece boa", fx: { sobrecarga: 1 } },
          { t: "Não usa correia (eixo direto)", fx: {} }
        ]
      },
      {
        q: "A máquina está exigindo mais do que a capacidade normal?",
        opts: [
          { t: "Sim, navalha cega, carga pesada ou forçando", fx: { sobrecarga: 3 } },
          { t: "Não, carga leve de costume", fx: {} }
        ]
      }
    ]
  },
  {
    id: "queimado",
    ico: "💨",
    t: "Cheiro de queimado",
    s: "Cheiro de verniz frito ou fumaça visível",
    urgent: true,
    urgentCauses: ["curto", "sobrecarga", "isolamento"]
  },
  {
    id: "choque",
    ico: "⚠️",
    t: "Dá choque na carcaça",
    s: "Formiga ou dá tranco ao encostar na máquina",
    urgent: true,
    urgentCauses: ["aterramento", "isolamento"]
  }
];

export const TYPES = {
  mono: { t: "Monofásico", s: "Chegam 2 fios (fase + neutro ou duas fases, mais terra). Muito comum em ordenhadeiras, picadeiras e marcenarias pequenas.", ico: "1~" },
  tri: { t: "Trifásico", s: "Chegam 3 fios de energia (mais o terra). Usado em granjas, aviários, indústrias e motores mais fortes da roça.", ico: "3~" },
  nao_sei: { t: "Não sei ao certo", s: "Sem problema! O Doutor do Motor vai investigar as causas que servem para os dois.", ico: "?" }
};

export const GRAV = [
  { t: "Dá pra resolver fácil", s: "Parece coisa simples. Faça as conferências com calma e com o motor desligado.", mood: "happy" },
  { t: "Atenção no motor!", s: "Se continuar forçando assim ele queima. Veja os itens e, se não resolver, chame o eletricista.", mood: "worried" },
  { t: "Pare de usar agora!", s: "Risco grave de queimar o motor, dar choque ou iniciar incêndio. Desligue da tomada!", mood: "danger" }
];

export const PLACA = [
  { k: "3~", t: "Tipo de alimentação (Fases)", d: "3~ significa motor trifásico (3 fases vivas). Se na sua placa estiver 1~, o motor é monofásico (típico de tomadas residenciais)." },
  { k: "2 cv", t: "Potência útil no eixo", d: "1 cv (cavalo-vapor) equivale a aprox. 736 Watts de força no eixo. É a força com que ele puxa a serra ou o triturador sem cair o giro." },
  { k: "220/380 V", t: "Tensões de ligação", d: "Pode ser ligado em 220V (ligação triângulo) ou 380V (ligação estrela). Na rede trifásica comum, a ligação em 380V entre fases costuma ser o padrão mais econômico." },
  { k: "5,8/3,4 A", t: "Corrente nominal (Amperes)", d: "O primeiro número é o consumo em 220V e o segundo em 380V. É esse número que o eletricista usa para regular o relé térmico e o disjuntor." },
  { k: "1730 rpm", t: "Giro por minuto (Rotação)", d: "Voltas que o eixo dá por minuto em carga cheia. Fica abaixo de 1800 RPM por causa do 'escorregamento', que é o que cria a força de indução." },
  { k: "60 Hz", t: "Frequência da rede", d: "Padrão brasileiro de 60 ciclos por segundo. Não use motores importados de 50 Hz sem verificar com eletricista, pois giram rápido demais e esquentam." },
  { k: "FS 1,15", t: "Fator de Serviço (Folga)", d: "Significa que o motor suporta até 15% acima da sua capacidade de vez em quando sem queimar na hora. Mas não abuse todo dia!" },
  { k: "IP55", t: "Grau de proteção da carcaça", d: "O primeiro 5 indica proteção contra poeira de marcenaria/grão; o segundo 5 indica proteção contra jatos de água de mangueira comum." },
  { k: "Isol. F", t: "Classe de isolamento térmico", d: "O verniz especial de cobre aguenta até 155 °C contínuos dentro das bobinas sem derreter." },
  { k: "η 84%", t: "Rendimento do motor", d: "De cada 100 partes de energia que entram da rede elétrica, 84 viram trabalho de giro no eixo e 16 viram calor. Quanto maior, menor a conta de luz." }
];

export const CHECK = [
  {
    g: "Toda semana (Na lida)",
    items: [
      "Escutar com atenção se tem chiado de areia ou batida no motor",
      "Sentir se tem cheiro de verniz quente ou borracha queimada",
      "Passar escova seca para tirar pó, serragem ou palha das aletas (motor desligado)",
      "Ver se não tem teia de aranha ou ninho de marimbondo na grade da ventoinha"
    ]
  },
  {
    g: "Todo mês (No galpão)",
    items: [
      "Apertar o meio da correia: ela deve ceder só de 1 a 2 cm com o dedo",
      "Conferir com chave se os parafusos da sapata na base estão bem firmes",
      "Observar se o motor não está demorando mais do que o normal para atingir o embalo",
      "Checar se a fiação não tem emenda descascada ou esquentando na tomada"
    ]
  },
  {
    g: "Todo ano (Revisão da entressafra)",
    items: [
      "Chamar um eletricista para medir o isolamento com aparelho Megômetro",
      "Lubrificar ou mandar trocar os rolamentos antes de começarem a arranhar",
      "Revisar o aperto dos parafusos dentro do quadro de disjuntores da propriedade",
      "Verificar se a haste do fio terra continua firme e sem ferrugem no chão"
    ]
  }
];

export const MAQUINAS = [
  { ico: "🥛", t: "Ordenhadeira & Bomba de Vácuo", d: "Trabalha em ambiente de umidade extrema e amônia. O vapor do leite e a água de lavação penetram se a tampa não for vedada. Recomenda-se motor blindado IP55 e limpar correia toda semana." },
  { ico: "❄️", t: "Resfriador de Leite a Granel", d: "Se parar no verão em dias quentes, azeda a produção inteira! O compressor parte com carga pesada. Exige fiação grossa dedicada direto do quadro, sem emendas, e proteção com relé de falta de fase se for trifásico." },
  { ico: "🌾", t: "Picador, Triturador & Ensiladeira", d: "Vibração brutal e pó de sabugo e palha. O pó fino forma uma camada nas aletas que impede a carcaça de esfriar. Limpe as aletas com escova seca ao fim de cada dia de ensilagem." },
  { ico: "🍂", t: "Estufa de Fumo (Secagem de Tabaco)", d: "Fica ligada dias e noites sem folga perto de fornalha quente (50°C a 70°C). O calor ambiente exige motor com Isolamento Classe F e hélice em perfeito estado para não torrar as bobinas." },
  { ico: "🐔", t: "Ventiladores de Aviário & Pocilga", d: "Maravalha, penas e amônia atacam as peças de ferro e o verniz. Nunca jogue jato de lava-jato de alta pressão direto na carcaça do motor elétrico!" },
  { ico: "💧", t: "Bomba de Sanga, Poço ou Açude", d: "Costuma ficar a 100 ou 200 metros do transformador. Extensão de fio fino mata a bomba por subtensão. Verifique também se a válvula de fundo de poço (cebolão) não está trancada de lodo." }
];

export const TERMOS = [
  { t: "Capacitor Permanente vs Partida", d: "O de partida é aquele cilindro preto que só serve pra dar o arranque e logo desliga pela chave centrífuga. O permanente (geralmente branco ou alumínio) fica ligado o tempo todo ajudando o motor a ter torque estável." },
  { t: "Chave Estrela-Triângulo", d: "Usada em motores trifásicos grandes (acima de 5 cv). Liga primeiro fraco em 'Estrela' pra não derrubar a luz do sítio na partida, e depois bate pra 'Triângulo' onde entrega toda a força." },
  { t: "Disjuntor Curva C (O amigo do motor)", d: "Disjuntor comum de casa (curva B) cai à toa com o pico de partida do motor. O eletricista coloca disjuntor de curva C, que espera 2 a 3 segundos antes de desarmar, dando tempo do motor embalar." },
  { t: "Relé Térmico", d: "Aparelhinho que fica preso na contatora. Ele tem lâminas que esquentam junto com a corrente. Se o motor ficar pesado por minutos, ele desarma o botão antes de queimar o cobre." },
  { t: "Megômetro", d: "Aparelho do eletricista que injeta 500V ou 1.000V de teste nas bobinas pra ver se a corrente não está vazando pela carcaça através da umidade." },
  { t: "Chave Boia Elétrica", d: "Sensor com uma esfera dentro que sobe e desce na caixa d'água ou no açude. Se a boia ficar com defeito, o motor pode ficar ligando e desligando a cada 10 segundos até queimar." }
];
