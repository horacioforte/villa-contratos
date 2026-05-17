import { useState } from "react";

const GOLDEN_RULES = `
REGRAS DE OURO DA VILLA EMPREENDIMENTOS (INEGOCIÁVEIS):
1. FERIADOS/PARADOS: Não será concedido NENHUM desconto por dias parados devido a feriados, recessos ou períodos festivos indicados pela Contratante.
2. DIÁRIAS GEOGRÁFICAS: Diárias apenas em São Paulo até 30km da base de Barra Funda-SP. Acima de 30km precisa de autorização prévia da Villa.
3. MOBILIZAÇÃO/DESMOBILIZAÇÃO: Devem ser cobradas OBRIGATORIAMENTE na primeira fatura/medição.
4. PROPOSTA ANEXADA: A proposta deve SEMPRE ser anexada ao contrato.
5. CONCRETO PERDIDO: A Villa NÃO paga em hipótese alguma por concreto perdido.
6. DISTÂNCIA >30KM: Acima de 30km sem ser mobilização/desmobilização, responsabilidade é do cliente.
7. SUL/CENTRO-OESTE: Verificar se mobilização sai de Barra Funda-SP ou Bezerros-PE (o mais barato).
8. CUSTOS DO OPERADOR: A Villa NÃO se responsabiliza por hospedagem, alimentação e transporte dos operadores.
9. PRAZO DE CONSERTO: Prazo mínimo de 48h a 72h para consertos de responsabilidade da Villa.
10. MAPAS DIÁRIOS: Obrigatório mapas diários assinados diariamente pelo cliente.
11. CONCLUSÃO DIÁRIA: Serviços concluídos após lavagem do equipamento (~1h após o término).
12. INTERVALO INTERJORNADA: Horários de trabalho devem respeitar 11h de descanso entre jornadas.
13. MÊS = 30 DIAS: Para cálculo proporcional, mês é sempre 30 dias corridos.
14. INÍCIO DO CONTRATO: Contrato começa na chegada do equipamento na obra.
15. DURAÇÃO MÍNIMA: Locação mínima de 90 dias (3 meses). SEM EXCEÇÃO.
16. MULTA POR DEVOLUÇÃO ANTECIPADA: Devolução antes de 3 meses = pagar mensalidades restantes integralmente.
17. AVISO PRÉVIO DESMOBILIZAÇÃO: Mínimo de 10 a 15 dias de antecedência.
18. FATURAMENTO 90/10: 90% equipamento (fatura) + 10% pessoas (NF). Exceção: CBSO é 100% fatura.
19. PRAZO DE PAGAMENTO: Cliente tem 15 a 30 dias para pagamento após medição enviada.
20. APROVAÇÃO TÁCITA: Cliente tem 5 dias para aprovar medição. Após isso, faturamento automático.
21. REAJUSTE: Reajuste anual pelo IPCA/FGV.
`;

const PROPOSALS_BY_TYPE = {
  "Caminhão Betoneira": `
PROPOSTA CAMINHÃO BETONEIRA COM OPERADOR (CBCO):
- Equipamento: Caminhão betoneira 8m³ VW 26.280 ou similar, ano 2020-2024, AR condicionado
- Horas garantidas: 200h/mês; hora extra: R$ 225,00/h
- Mensalidade unitária: R$ 45.000,00
- Mobilização: R$ 14,00/km (Bezerros-PE ou Barra Funda-SP), pago antecipadamente
- Turno padrão: Seg-Qui 07h-17h, Sex 07h-16h (1h intervalo); sáb/dom/feriado = extra
- Faturamento: 90% equipamento (fatura) + 10% mão de obra (NF)
- Prazo aprovação medição: 5 dias corridos (faturamento tácito após)
- Pagamento: boleto, até 15º dia corrido após fechamento de medição
- Reajuste: semestral pelo IPCA/FGV
- Prazo mínimo: 3 meses; devolução antecipada = pagar mensalidades restantes integralmente
- Aviso desmobilização: mínimo 15 dias

PROPOSTA CAMINHÃO BETONEIRA SEM OPERADOR (CBSO):
- Equipamento: Caminhão betoneira 8m³ VW/Mercedes/Volvo, ano 2019-2025, AR condicionado
- Horas garantidas: 180h/mês (horímetro); hora extra: R$ 166,67/h
- Mensalidade unitária: R$ 30.000,00
- Mobilização/desmobilização: por conta da Locatária (retirada e devolução na sede em Bezerros-PE)
- Faturamento: 100% fatura de locação de equipamento (sem split 90/10)
- Pagamento: boleto, até 25 dias após aprovação da medição
- Reajuste: semestral pelo IPCA/FGV
- Prazo mínimo: 3 meses
- Aviso desmobilização: mínimo 15 dias
`,
  "Auto Bomba": `
PROPOSTA AUTO BOMBA COM LANÇA (ABL) — COM OPERADOR:
- Equipamento: Auto bomba com lança Schwing ou similar (32m, 36m, 38m, 42/43m, 56/58m)
- Mobilização/desmobilização: R$ 14,00/km, cobrada na 1ª fatura
- Mensalidade: 32m=R$99.000 (1.800m³ mín), 36/38m=R$110.000 (2.000m³ mín), 42/43m=R$121.000 (2.200m³ mín), 56/58m=R$227.500 (3.500m³ mín)
- Valor m³: R$ 55,00 (56/58m = R$ 65,00)
- Hora extra: R$ 350,00/h (32-42m), R$ 450,00/h (56/58m)
- Faturamento: 90% equipamento + 10% mão de obra (NF)
- Prazo aprovação medição: 5 dias
- Reajuste: anual pelo IPCA/FGV
- Prazo mínimo: 3 meses

PROPOSTA AUTO BOMBA ESTACIONÁRIA COM OPERADOR (ABE):
- Volume mínimo mensal: 1.200 m³; valor por m³: R$ 50,00
- Mobilização/desmobilização: R$ 14,00/km
- Hora extra: R$ 350,00/h
- Faturamento: 90% equipamento + 10% mão de obra (NF)
- Reajuste: semestral pelo IPCA/FGV
- Prazo mínimo: 3 meses
- Equipamentos acima de 30km: seguro obrigatório
`,
  "Usina de Concreto": `Sem proposta padrão cadastrada. Analisar pelas Regras de Ouro gerais.`,
  "Geral / Outro": `Analisar pelas Regras de Ouro gerais da Villa.`,
};

const buildPrompt = (type) => `Você é especialista jurídico-comercial da Villa Empreendimentos. Analise o contrato do cliente comparando com os parâmetros da Villa.

REGRAS DE OURO (INEGOCIÁVEIS): ${GOLDEN_RULES}

PROPOSTA VILLA - TIPO ${type}: ${PROPOSALS_BY_TYPE[type] || PROPOSALS_BY_TYPE["Geral / Outro"]}

IMPORTANTE: Retorne SOMENTE JSON puro. Sem markdown. Use apenas aspas duplas. Nunca coloque aspas dentro dos valores de texto. Substitua aspas dentro de textos por parenteses. Formato: {"tipoDetectado":"","partes":["",""],"prazo":"","valor":"","reajuste":"","riscoGeral":"Médio","resumo":"","conformes":[{"regra":"","detalhe":""}],"conflitos":[{"regra":"","contratoCliente":"","villaEspera":"","gravidade":"Alta"}],"violacoesRegrasDeOuro":[{"numero":1,"regra":"","problema":""}],"clausulasFaltando":[{"clausula":"","importancia":"Alta","descricao":""}],"recomendacoes":[{"acao":"","prioridade":"Alta"}]}`;
const C = {
  bg:"#F4F6FA", surface:"#FFFFFF", surfaceAlt:"#F8F9FC",
  border:"#E2E8F0", borderStrong:"#CBD5E1",
  blue:"#2563EB", blueDim:"#93C5FD", blueLight:"#EFF6FF", blueMid:"#DBEAFE",
  text:"#0F172A", textMid:"#334155", textMuted:"#94A3B8",
  red:"#DC2626", redBg:"#FEF2F2", redBorder:"#FECACA", redText:"#991B1B",
  orange:"#D97706", orangeBg:"#FFFBEB", orangeBorder:"#FDE68A", orangeText:"#92400E",
  green:"#059669", greenBg:"#F0FDF4", greenBorder:"#BBF7D0", greenText:"#065F46",
  yellow:"#B45309", yellowBg:"#FFFBEB", yellowBorder:"#FDE68A", slate:"#64748B",
};

const CONTRACT_TYPES = [
  {id:"Caminhão Betoneira", icon:"🚛", label:"CAMINHÃO BETONEIRA"},
  {id:"Auto Bomba", icon:"🏗", label:"AUTO BOMBA"},
  {id:"Usina de Concreto", icon:"🏭", label:"USINA DE CONCRETO"},
  {id:"Geral / Outro", icon:"📋", label:"GERAL / OUTRO"},
];

const Badge = ({color,bg,border,children}) => (
  <span style={{display:"inline-flex",alignItems:"center",padding:"2px 9px",borderRadius:4,fontSize:11,fontWeight:600,letterSpacing:"0.06em",color,background:bg,border:`1px solid ${border}`}}>{children}</span>
);
const RiskBadge = ({level}) => {
  const m={Alto:[C.redText,C.redBg,C.redBorder],Médio:[C.orangeText,C.orangeBg,C.orangeBorder],Baixo:[C.greenText,C.greenBg,C.greenBorder]};
  const [c,bg,b]=m[level]||[C.slate,C.bg,C.border];
  return <Badge color={c} bg={bg} border={b}>{level}</Badge>;
};
const GravBadge = ({level}) => {
  const m={Alta:[C.redText,C.redBg,C.redBorder],Média:[C.orangeText,C.orangeBg,C.orangeBorder],Baixa:[C.yellow,C.yellowBg,C.yellowBorder]};
  const [c,bg,b]=m[level]||[C.slate,C.bg,C.border];
  return <Badge color={c} bg={bg} border={b}>{level}</Badge>;
};
const Card = ({borderLeft,bg,children,style={}}) => (
  <div style={{background:bg||C.surface,border:`1px solid ${C.border}`,borderLeft:borderLeft?`3px solid ${borderLeft}`:undefined,borderRadius:8,padding:"14px 18px",marginBottom:10,...style}}>{children}</div>
);
const SectionHead = ({title,count,color}) => (
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
    <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:color||C.blue,textTransform:"uppercase"}}>{title}</span>
    {count!==undefined&&<span style={{fontSize:10,fontWeight:700,background:color||C.blue,color:"#fff",borderRadius:10,padding:"1px 7px"}}>{count}</span>}
  </div>
);

const handlePrint = (result, contractType) => {
  if (!result) return;
  const date = new Date().toLocaleDateString("pt-BR");

  const riskColor = {Alto:"#991B1B", Médio:"#92400E", Baixo:"#065F46"}[result.riscoGeral] || "#334155";
  const riskBg = {Alto:"#FEF2F2", Médio:"#FFFBEB", Baixo:"#F0FDF4"}[result.riscoGeral] || "#F8F9FC";

  const violacoesHtml = result.violacoesRegrasDeOuro?.length > 0
    ? result.violacoesRegrasDeOuro.map(v => `
      <div class="card red-card">
        <div class="card-header">
          <span class="badge red-badge">REGRA #${v.numero} — INEGOCIÁVEL</span>
        </div>
        <p class="card-subtitle">${v.regra}</p>
        <p class="card-text">⚠ ${v.problema}</p>
      </div>`).join("")
    : `<div class="card green-card"><p class="green-text">✓ Nenhuma violação detectada.</p></div>`;

  const conflitosHtml = result.conflitos?.length > 0
    ? result.conflitos.map(c => `
      <div class="card">
        <div class="card-header"><strong>${c.regra}</strong> <span class="badge ${c.gravidade==="Alta"?"red-badge":c.gravidade==="Média"?"orange-badge":"yellow-badge"}">${c.gravidade}</span></div>
        <div class="two-col">
          <div class="col orange-col"><p class="col-label">CONTRATO DO CLIENTE</p><p>${c.contratoCliente}</p></div>
          <div class="col blue-col"><p class="col-label">VILLA EXIGE</p><p>${c.villaEspera}</p></div>
        </div>
      </div>`).join("")
    : `<div class="card green-card"><p class="green-text">✓ Sem conflitos.</p></div>`;

  const conformesHtml = result.conformes?.length > 0
    ? result.conformes.map(c => `
      <div class="card green-card">
        <strong class="green-text">${c.regra}</strong>
        <p>${c.detalhe}</p>
      </div>`).join("")
    : `<div class="card"><p>Nenhum item identificado.</p></div>`;

  const faltandoHtml = result.clausulasFaltando?.length > 0
    ? result.clausulasFaltando.map(c => `
      <div class="card">
        <div class="card-header"><strong>${c.clausula}</strong> <span class="badge yellow-badge">${c.importancia}</span></div>
        <p>${c.descricao}</p>
      </div>`).join("")
    : `<div class="card green-card"><p class="green-text">✓ Nenhuma cláusula ausente.</p></div>`;

  const acoesHtml = result.recomendacoes?.length > 0
    ? result.recomendacoes.map(r => `
      <div class="card">
        <div class="card-header">
          <span>${r.prioridade==="Alta"?"🔴":r.prioridade==="Média"?"🟡":"🔵"} ${r.acao}</span>
          <span class="badge ${r.prioridade==="Alta"?"red-badge":r.prioridade==="Média"?"orange-badge":"blue-badge"}">${r.prioridade}</span>
        </div>
      </div>`).join("")
    : "";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>Análise Villa — ${result.tipoDetectado}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #0F172A; padding: 32px; background: white; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 22px; font-weight: 800; color: #2563EB; }
  .logo span { font-weight: 400; color: #334155; font-size: 16px; }
  .date { font-size: 11px; color: #94A3B8; }
  .summary { background: #F8F9FC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
  .summary h1 { font-size: 18px; color: #0F172A; margin-bottom: 8px; }
  .summary p { color: #334155; line-height: 1.6; margin-bottom: 12px; }
  .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 12px; }
  .meta-item { }
  .meta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94A3B8; margin-bottom: 3px; }
  .meta-value { font-size: 12px; color: #334155; }
  .risk-badge { display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; background: ${riskBg}; color: ${riskColor}; border: 1px solid ${riskColor}44; }
  .alert { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; padding: 10px 16px; margin-bottom: 20px; color: #991B1B; font-weight: 600; }
  .section { margin-bottom: 24px; page-break-inside: avoid; }
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding-bottom: 8px; border-bottom: 1px solid #E2E8F0; margin-bottom: 12px; }
  .section-title.red { color: #DC2626; }
  .section-title.orange { color: #D97706; }
  .section-title.green { color: #059669; }
  .section-title.yellow { color: #B45309; }
  .section-title.blue { color: #2563EB; }
  .card { border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 16px; margin-bottom: 10px; page-break-inside: avoid; }
  .card.red-card { background: #FEF2F2; border-left: 3px solid #DC2626; }
  .card.green-card { background: #F0FDF4; border-left: 3px solid #059669; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 12px; }
  .card-subtitle { font-size: 12px; color: #DC2626; font-style: italic; margin-bottom: 6px; }
  .card-text { font-size: 12px; color: #991B1B; line-height: 1.6; }
  .green-text { color: #065F46; font-size: 13px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
  .col { border-radius: 5px; padding: 8px 10px; }
  .orange-col { background: #FFFBEB; }
  .blue-col { background: #EFF6FF; }
  .col-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .orange-col .col-label { color: #D97706; }
  .blue-col .col-label { color: #2563EB; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; }
  .red-badge { background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }
  .orange-badge { background: #FFFBEB; color: #92400E; border: 1px solid #FDE68A; }
  .yellow-badge { background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A; }
  .green-badge { background: #F0FDF4; color: #065F46; border: 1px solid #BBF7D0; }
  .blue-badge { background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
  .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 10px; color: #94A3B8; text-align: center; }
  @media print { body { padding: 20px; } .section { page-break-inside: avoid; } }
</style>
</head>
<body>
<div class="header">
  <div class="logo">VILLA <span>Empreendimentos — Análise de Contrato</span></div>
  <div class="date">Gerado em ${date} · Tipo: ${contractType}</div>
</div>

<div class="summary">
  <h1>${result.tipoDetectado}</h1>
  <p>${result.resumo}</p>
  <div class="meta-grid">
    <div class="meta-item"><div class="meta-label">Partes</div><div class="meta-value">${result.partes?.join(" × ")}</div></div>
    <div class="meta-item"><div class="meta-label">Prazo</div><div class="meta-value">${result.prazo}</div></div>
    <div class="meta-item"><div class="meta-label">Valor</div><div class="meta-value">${result.valor}</div></div>
    <div class="meta-item"><div class="meta-label">Risco</div><div class="meta-value"><span class="risk-badge">${result.riscoGeral}</span></div></div>
  </div>
</div>

${result.violacoesRegrasDeOuro?.length > 0 ? `<div class="alert">🚨 ${result.violacoesRegrasDeOuro.length} violação(ões) de Regras de Ouro detectadas — itens inegociáveis.</div>` : ""}

<div class="section">
  <div class="section-title red">Violações das Regras de Ouro (${result.violacoesRegrasDeOuro?.length || 0})</div>
  ${violacoesHtml}
</div>

<div class="section">
  <div class="section-title orange">Conflitos com a Proposta Villa (${result.conflitos?.length || 0})</div>
  ${conflitosHtml}
</div>

<div class="section">
  <div class="section-title green">Itens em Conformidade (${result.conformes?.length || 0})</div>
  ${conformesHtml}
</div>

<div class="section">
  <div class="section-title yellow">Cláusulas Faltando (${result.clausulasFaltando?.length || 0})</div>
  ${faltandoHtml}
</div>

<div class="section">
  <div class="section-title blue">Ações Recomendadas (${result.recomendacoes?.length || 0})</div>
  ${acoesHtml}
</div>

<div class="footer">Villa Empreendimentos · Análise gerada por IA para uso interno · Consulte o jurídico para decisões finais</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
};

export default function App() {
  const [contractType, setContractType] = useState("Caminhão Betoneira");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("violacoes");

  const k1 = "sk-ant-api03-9skfPFvF4sPXY4sf";
  const k2 = "WzoGlCM3M4i_oydCML-3l8wkJX1teMj6W_Q6YBRKL3c_P_bPfxThDelAI2XfFydPx35FBw-PTc77AAA";
  const ANTHROPIC_API_KEY = k1 + k2;

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setText(""); setPdfBase64(null);
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => setPdfBase64(e.target.result.split(",")[1]);
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    }
  };

  const canAnalyze = !loading && (pdfBase64 || text.trim());

  const analyze = async () => {
    if (!canAnalyze) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const messageContent = pdfBase64
        ? [{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfBase64}},{type:"text",text:"Analise este contrato:"}]
        : `Analise este contrato:\n\n${text.slice(0,9000)}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key":ANTHROPIC_API_KEY,
          "anthropic-version":"2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:4000,
          system:buildPrompt(contractType),
          messages:[{role:"user",content:messageContent}],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("Resposta inválida. Tente novamente.");
let clean = raw.substring(start, end + 1);
clean = clean.replace(/,\s*}/g,"}").replace(/,\s*]/g,"]");
setResult(JSON.parse(clean));
      setActiveTab("violacoes");
    } catch(err) {
      setError(`Erro ao analisar: ${err.message}`);
    } finally { setLoading(false); }
  };

  const tabs = result ? [
    {id:"violacoes",label:"Regras de Ouro",count:result.violacoesRegrasDeOuro?.length||0,color:C.red},
    {id:"conflitos",label:"Conflitos",count:result.conflitos?.length||0,color:C.orange},
    {id:"conformes",label:"Conformes",count:result.conformes?.length||0,color:C.green},
    {id:"faltando",label:"Faltando",count:result.clausulasFaltando?.length||0,color:C.yellow},
    {id:"acoes",label:"Ações",count:result.recomendacoes?.length||0,color:C.blue},
  ] : [];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",color:C.text}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
        textarea:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>

      <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 40px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:6}}>
          <span style={{fontSize:18,fontWeight:800,color:C.blue,letterSpacing:"-0.02em"}}>VILLA</span>
          <span style={{fontSize:15,fontWeight:400,color:C.textMid}}>Empreendimentos</span>
        </div>
        <span style={{fontSize:11,fontWeight:600,letterSpacing:"0.16em",color:C.textMuted,textTransform:"uppercase"}}>Analisador de Contratos</span>
      </header>

      <div style={{display:"flex",height:"calc(100vh - 56px)",overflow:"hidden"}}>
        <div style={{width:400,minWidth:400,background:C.surface,borderRight:`1px solid ${C.border}`,overflowY:"auto",padding:"28px 28px",display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.blue,textTransform:"uppercase",marginBottom:12}}>Tipo de Contrato</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {CONTRACT_TYPES.map(t => {
                const active = contractType===t.id;
                return <button key={t.id} onClick={()=>setContractType(t.id)} style={{padding:"8px 12px",background:active?C.blueLight:C.surfaceAlt,border:`1.5px solid ${active?C.blue:C.border}`,borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:"0.07em",color:active?C.blue:C.slate,textTransform:"uppercase",display:"flex",alignItems:"center",gap:6}}><span>{t.icon}</span>{t.label}</button>;
              })}
            </div>
            <p style={{fontSize:11,color:C.textMuted,marginTop:8}}>Base: ABL · ABE · CBCO · CBSO + 21 Regras de Ouro</p>
          </div>

          <div style={{height:1,background:C.border}}/>

          <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
            <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.14em",color:C.blue,textTransform:"uppercase"}}>Contrato do Cliente</p>

            {!pdfBase64 && (
              <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}} onClick={()=>document.getElementById("villa-file-input").click()} style={{border:`2px dashed ${dragging?C.blue:C.borderStrong}`,borderRadius:8,padding:"22px 16px",textAlign:"center",cursor:"pointer",background:dragging?C.blueLight:C.surfaceAlt}}>
                <div style={{fontSize:28,marginBottom:6}}>📄</div>
                <p style={{fontSize:13,fontWeight:600,color:dragging?C.blue:C.textMid,marginBottom:3}}>Arraste o PDF aqui</p>
                <p style={{fontSize:11,color:C.textMuted}}>ou clique para selecionar · .pdf, .txt</p>
                <input id="villa-file-input" type="file" accept=".pdf,.txt,.md" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              </div>
            )}

            {pdfBase64 && (
              <div style={{background:C.blueLight,border:`1.5px solid ${C.blueDim}`,borderRadius:8,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:24}}>📄</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:C.blue,marginBottom:2}}>{fileName}</p>
                  <p style={{fontSize:11,color:C.textMuted}}>PDF pronto para análise</p>
                </div>
                <button onClick={()=>{setPdfBase64(null);setFileName(null)}} style={{background:"none",border:"none",cursor:"pointer",color:C.textMuted,fontSize:20}}>✕</button>
              </div>
            )}

            {!pdfBase64 && <>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:11,color:C.textMuted}}>ou cole o texto</span><div style={{flex:1,height:1,background:C.border}}/>
              </div>
              <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Cole aqui o texto do contrato do cliente..." style={{width:"100%",minHeight:200,background:C.surfaceAlt,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"14px 16px",fontSize:13,color:C.textMid,lineHeight:1.7,resize:"vertical"}}/>
            </>}

            <p style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>💡 Quanto mais completo o contrato, mais precisa a análise.</p>
          </div>

          <button onClick={analyze} disabled={!canAnalyze} style={{width:"100%",padding:"14px",background:!canAnalyze?C.border:C.blue,color:!canAnalyze?C.textMuted:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,letterSpacing:"0.08em",cursor:!canAnalyze?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,textTransform:"uppercase"}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid #fff4",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>Analisando...</>:"⚡ Analisar Contrato"}
          </button>

          {result && (
            <button onClick={()=>handlePrint(result, contractType)} style={{width:"100%",padding:"12px",background:"#fff",color:C.blue,border:`1.5px solid ${C.blue}`,borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              🖨 Imprimir Análise Completa
            </button>
          )}

          <p style={{fontSize:10,color:C.textMuted,textAlign:"center"}}>Análise por IA para uso interno · Consulte o jurídico para decisões finais</p>
        </div>

        <div style={{flex:1,overflowY:"auto",background:C.bg}}>
          {!loading&&!result&&!error&&(
            <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:64,textAlign:"center"}}>
              <div style={{fontSize:52,opacity:0.18}}>📋</div>
              <p style={{fontSize:15,fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Aguardando Contrato</p>
              <p style={{fontSize:13,color:C.textMuted}}>Carregue o PDF ou cole o texto ao lado e clique em Analisar</p>
            </div>
          )}

          {loading&&(
            <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:64}}>
              <div style={{width:44,height:44,border:`3px solid ${C.blueMid}`,borderTop:`3px solid ${C.blue}`,borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
              <div style={{textAlign:"center"}}>
                <p style={{fontSize:14,fontWeight:600,color:C.textMid}}>Verificando 21 Regras de Ouro...</p>
                <p style={{fontSize:12,color:C.textMuted,marginTop:4}}>Comparando com propostas {contractType}</p>
              </div>
            </div>
          )}

          {error&&!loading&&<div style={{margin:32,background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:8,padding:"16px 20px",color:C.redText,fontSize:13}}>{error}</div>}

          {result&&!loading&&(
            <div style={{animation:"fadeUp 0.3s ease",padding:"28px 36px"}}>
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"20px 24px",marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
                  <div style={{flex:2,minWidth:200}}>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:"0.12em",color:C.blue,textTransform:"uppercase",marginBottom:4}}>Contrato Identificado</p>
                    <p style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:8}}>{result.tipoDetectado}</p>
                    <p style={{fontSize:13,color:C.textMid,lineHeight:1.65}}>{result.resumo}</p>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:16,alignItems:"flex-start"}}>
                    {[["Partes",result.partes?.join(" × ")],["Prazo",result.prazo],["Valor",result.valor],["Reajuste",result.reajuste]].map(([l,v])=>v&&(
                      <div key={l}><p style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:3}}>{l}</p><p style={{fontSize:12,color:C.textMid,maxWidth:160}}>{v}</p></div>
                    ))}
                    <div><p style={{fontSize:10,fontWeight:700,letterSpacing:"0.1em",color:C.textMuted,textTransform:"uppercase",marginBottom:5}}>Risco</p><RiskBadge level={result.riscoGeral}/></div>
                  </div>
                </div>
              </div>

              {result.violacoesRegrasDeOuro?.length>0&&(
                <div style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:8,padding:"12px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12,fontSize:13}}>
                  <span style={{fontSize:18}}>🚨</span>
                  <span style={{color:C.redText}}><strong>{result.violacoesRegrasDeOuro.length} violação(ões)</strong> de Regras de Ouro detectadas.</span>
                </div>
              )}

              <div style={{display:"flex",gap:2,marginBottom:20,background:C.surfaceAlt,borderRadius:8,padding:4,border:`1px solid ${C.border}`,width:"fit-content"}}>
                {tabs.map(tab=>(
                  <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{padding:"7px 14px",background:activeTab===tab.id?C.surface:"transparent",border:activeTab===tab.id?`1px solid ${C.border}`:"1px solid transparent",borderRadius:6,color:activeTab===tab.id?tab.color:C.textMuted,fontSize:12,fontWeight:activeTab===tab.id?700:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:activeTab===tab.id?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>
                    {tab.label}
                    {tab.count>0&&<span style={{fontSize:10,fontWeight:700,background:activeTab===tab.id?tab.color:C.borderStrong,color:activeTab===tab.id?"#fff":C.textMuted,borderRadius:10,padding:"0 6px",lineHeight:"18px"}}>{tab.count}</span>}
                  </button>
                ))}
              </div>

              {activeTab==="violacoes"&&<div>
                <SectionHead title="Violações das Regras de Ouro" count={result.violacoesRegrasDeOuro?.length} color={C.red}/>
                {result.violacoesRegrasDeOuro?.length===0?<Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Nenhuma violação detectada.</p></Card>
                :result.violacoesRegrasDeOuro?.map((v,i)=>(
                  <Card key={i} bg={C.redBg} borderLeft={C.red}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:11,fontWeight:700,color:C.redText,background:C.redBorder,borderRadius:4,padding:"2px 8px"}}>REGRA #{v.numero}</span><span style={{fontSize:10,fontWeight:700,color:C.redText,textTransform:"uppercase"}}>INEGOCIÁVEL</span></div>
                    <p style={{fontSize:12,color:C.red,marginBottom:6,fontStyle:"italic"}}>{v.regra}</p>
                    <p style={{fontSize:13,color:C.redText,lineHeight:1.6}}>⚠ {v.problema}</p>
                  </Card>
                ))}
              </div>}

              {activeTab==="conflitos"&&<div>
                <SectionHead title="Conflitos com a Proposta Villa" count={result.conflitos?.length} color={C.orange}/>
                {result.conflitos?.length===0?<Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Sem conflitos.</p></Card>
                :result.conflitos?.map((c,i)=>(
                  <Card key={i} borderLeft={c.gravidade==="Alta"?C.red:c.gravidade==="Média"?C.orange:C.yellow}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{c.regra}</span><GravBadge level={c.gravidade}/></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <div style={{background:C.orangeBg,borderRadius:6,padding:"10px 12px"}}><p style={{fontSize:10,fontWeight:700,color:C.orange,textTransform:"uppercase",marginBottom:4}}>Contrato do cliente</p><p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.contratoCliente}</p></div>
                      <div style={{background:C.blueLight,borderRadius:6,padding:"10px 12px"}}><p style={{fontSize:10,fontWeight:700,color:C.blue,textTransform:"uppercase",marginBottom:4}}>Villa exige</p><p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.villaEspera}</p></div>
                    </div>
                  </Card>
                ))}
              </div>}

              {activeTab==="conformes"&&<div>
                <SectionHead title="Itens em Conformidade" count={result.conformes?.length} color={C.green}/>
                {result.conformes?.length===0?<Card><p style={{fontSize:13,color:C.textMuted}}>Nenhum item identificado.</p></Card>
                :result.conformes?.map((c,i)=>(
                  <Card key={i} bg={C.greenBg} borderLeft={C.green}>
                    <div style={{display:"flex",gap:10}}><span style={{color:C.green,fontSize:15,marginTop:1}}>✓</span><div><p style={{fontSize:13,fontWeight:600,color:C.greenText,marginBottom:3}}>{c.regra}</p><p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.detalhe}</p></div></div>
                  </Card>
                ))}
              </div>}

              {activeTab==="faltando"&&<div>
                <SectionHead title="Cláusulas Faltando" count={result.clausulasFaltando?.length} color={C.yellow}/>
                {result.clausulasFaltando?.length===0?<Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Nenhuma cláusula ausente.</p></Card>
                :result.clausulasFaltando?.map((c,i)=>(
                  <Card key={i} borderLeft={C.yellow}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:C.text}}>{c.clausula}</span><Badge color={C.yellow} bg={C.yellowBg} border={C.yellowBorder}>{c.importancia}</Badge></div>
                    <p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.descricao}</p>
                  </Card>
                ))}
              </div>}

              {activeTab==="acoes"&&<div>
                <SectionHead title="Ações Recomendadas" count={result.recomendacoes?.length} color={C.blue}/>
                {result.recomendacoes?.map((r,i)=>(
                  <Card key={i} borderLeft={r.prioridade==="Alta"?C.red:r.prioridade==="Média"?C.orange:C.blue}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:15,marginTop:1}}>{r.prioridade==="Alta"?"🔴":r.prioridade==="Média"?"🟡":"🔵"}</span>
                      <p style={{flex:1,fontSize:13,color:C.textMid,lineHeight:1.65}}>{r.acao}</p>
                      <GravBadge level={r.prioridade}/>
                    </div>
                  </Card>
                ))}
              </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
