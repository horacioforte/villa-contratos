import { useState } from "react";

// ─── VILLA KNOWLEDGE BASE ────────────────────────────────────────────────────

const GOLDEN_RULES = `
REGRAS DE OURO DA VILLA EMPREENDIMENTOS (INEGOCIÁVEIS):
1. FERIADOS/PARADOS: Não será concedido NENHUM desconto por dias parados devido a feriados, recessos ou períodos festivos indicados pela Contratante.
2. DIÁRIAS GEOGRÁFICAS: Diárias apenas em São Paulo até 30km da base de Barra Funda–SP. Acima de 30km precisa de autorização prévia da Villa.
3. MOBILIZAÇÃO/DESMOBILIZAÇÃO: Devem ser cobradas OBRIGATORIAMENTE na primeira fatura/medição.
4. PROPOSTA ANEXADA: A proposta deve SEMPRE ser anexada ao contrato.
5. CONCRETO PERDIDO: A Villa NÃO paga em hipótese alguma por concreto perdido (slump, traço, vencido, desagregado, etc.).
6. DISTÂNCIA >30KM: Acima de 30km sem ser mobilização/desmobilização, responsabilidade é do cliente.
7. SUL/CENTRO-OESTE: Verificar se mobilização sai de Barra Funda-SP ou Bezerros-PE (o que for mais barato).
8. CUSTOS DO OPERADOR: A Villa NÃO se responsabiliza por hospedagem, alimentação e transporte dos operadores — são custos adicionais do cliente.
9. PRAZO DE CONSERTO: Prazo mínimo de 48h a 72h para consertos nos equipamentos que são de responsabilidade da Villa.
10. MAPAS DIÁRIOS: Obrigatório mapas diários do trabalho dos operadores/motoristas, assinados diariamente pelo cliente.
11. CONCLUSÃO DIÁRIA: Serviços concluídos após lavagem do equipamento (~1h após o término).
12. INTERVALO INTERJORNADA: Horários de trabalho devem respeitar 11h de descanso entre jornadas (lei vigente).
13. MÊS = 30 DIAS: Para cálculo proporcional, mês é sempre 30 dias corridos, independente do calendário.
14. INÍCIO DO CONTRATO: Contrato começa na chegada do equipamento na obra, mesmo que fique parado aguardando trâmites do cliente.
15. DURAÇÃO MÍNIMA: Locação mínima de 90 dias (3 meses). SEM EXCEÇÃO.
16. MULTA POR DEVOLUÇÃO ANTECIPADA: Devolução antes de 3 meses = pagar mensalidades restantes integralmente sem abatimento.
17. AVISO PRÉVIO DESMOBILIZAÇÃO: Mínimo de 10 a 15 dias de antecedência para aviso de desmobilização.
18. FATURAMENTO 90/10: Modelo padrão: 90% equipamento (fatura) + 10% pessoas (NF). Exceção: CBSO é 100% fatura de locação.
19. PRAZO DE PAGAMENTO: Cliente tem 15 a 30 dias para pagamento após medição enviada.
20. APROVAÇÃO TÁCITA: Cliente tem 5 dias para aprovar a medição. Se não aprovar, faturamento ocorre automaticamente (tácito).
21. REAJUSTE: Reajuste anual pelo IPCA (referência FGV para construção civil).
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
- Responsabilidade da Contratante: combustível/insumos, hospedagem/alimentação/transporte do operador, local de lavagem, guarda e segurança, mapas diários assinados

PROPOSTA CAMINHÃO BETONEIRA SEM OPERADOR (CBSO):
- Equipamento: Caminhão betoneira 8m³ VW/Mercedes/Volvo, ano 2019-2025, AR condicionado
- Horas garantidas: 180h/mês (horímetro); hora extra: R$ 166,67/h
- Mensalidade unitária: R$ 30.000,00
- Mobilização/desmobilização: por conta da Locatária (retirada e devolução na sede em Bezerros-PE)
- Faturamento: 100% fatura de locação de equipamento (sem split 90/10)
- Pagamento: boleto, até 25 dias após aprovação da medição
- Reajuste: semestral pelo IPCA/FGV
- Prazo mínimo: 3 meses; devolução antecipada = multa equivalente ao valor de 3 meses de franquia
- Aviso desmobilização: mínimo 15 dias
- Responsabilidade da Locatária: operação, combustível/insumos, manutenção corretiva, guarda e segurança, tacógrafo, mapas diários, devolução na sede
`,
  "Auto Bomba": `
PROPOSTA AUTO BOMBA COM LANÇA (ABL) — COM OPERADOR:
- Equipamento: Auto bomba com lança Schwing ou similar (32m, 36m, 38m, 42/43m, 56/58m)
- Mobilização/desmobilização: R$ 14,00/km, cobrada na 1ª fatura, saindo de Bezerros-PE ou Barra Funda-SP
- Mensalidade: 32m=R$99.000 (1.800m³ mín), 36m/38m=R$110.000 (2.000m³ mín), 42/43m=R$121.000 (2.200m³ mín), 56/58m=R$227.500 (3.500m³ mín)
- Valor m³: R$ 55,00 (exceto 56/58m = R$ 65,00)
- Hora extra: R$ 350,00/h (32-42m), R$ 450,00/h (56/58m)
- Turno padrão: Seg-Qui 07h-17h, Sex 07h-16h (1h intervalo)
- Faturamento: 90% equipamento (fatura) + 10% mão de obra (NF)
- Prazo aprovação medição: 5 dias (faturamento tácito após)
- Pagamento: boleto, até 15º dia corrido do fechamento de medição
- Reajuste: anual pelo IPCA/FGV
- Prazo mínimo: 3 meses; devolução antecipada = pagar mensalidades restantes integralmente
- Responsabilidade da Contratante: hospedagem/alimentação/transporte do operador, combustível/insumos, local de lavagem, guarda e segurança, mapas diários

PROPOSTA AUTO BOMBA ESTACIONÁRIA COM OPERADOR (ABE):
- Equipamento: Auto bomba estacionária Schwing ou similar, com operador
- Volume mínimo mensal: 1.200 m³; valor por m³: R$ 50,00
- Mobilização/desmobilização: R$ 14,00/km, pago antecipadamente, saindo de Bezerros-PE ou Barra Funda-SP
- Hora extra: R$ 350,00/h
- Turno padrão: Seg-Qui 07h-17h, Sex 07h-16h (1h intervalo)
- Faturamento: 90% equipamento (fatura) + 10% mão de obra (NF)
- Pagamento: boleto, até 15º dia corrido do fechamento de medição
- Reajuste: semestral pelo IPCA/FGV
- Prazo mínimo: 3 meses; devolução antecipada = pagar mensalidades restantes integralmente
- Equipamentos >30km: obrigatório contratar seguro total + taxa adicional por km excedente
- Responsabilidade da Contratante: hospedagem/alimentação/transporte do operador, combustível/insumos, local de lavagem, guarda e segurança, mapas diários
`,
  "Usina de Concreto": `Não há proposta padrão de Usina de Concreto cadastrada. Analise com base nas Regras de Ouro gerais.`,
  "Geral / Outro": `Analise com base exclusivamente nas Regras de Ouro gerais da Villa Empreendimentos.`,
};

const buildPrompt = (type) => `Você é especialista jurídico-comercial da Villa Empreendimentos, empresa de locação de equipamentos para bombeamento e transporte de concreto. Analise o contrato enviado pelo cliente comparando com os parâmetros da Villa.

=== REGRAS DE OURO (INEGOCIÁVEIS) ===
${GOLDEN_RULES}

=== PROPOSTA PADRÃO VILLA — TIPO: ${type} ===
${PROPOSALS_BY_TYPE[type] || PROPOSALS_BY_TYPE["Geral / Outro"]}

Retorne SOMENTE JSON válido sem markdown:
{
  "tipoDetectado": "tipo identificado",
  "partes": ["Parte 1","Parte 2"],
  "prazo": "prazo identificado",
  "valor": "valor/mensalidade",
  "reajuste": "índice/periodicidade",
  "riscoGeral": "Baixo" ou "Médio" ou "Alto",
  "resumo": "2-3 frases sobre o contrato",
  "conformes": [{"regra":"nome","detalhe":"como está no contrato"}],
  "conflitos": [{"regra":"item","contratoCliente":"o que diz","villaEspera":"o que a Villa exige","gravidade":"Alta" ou "Média" ou "Baixa"}],
  "violacoesRegrasDeOuro": [{"numero":1,"regra":"texto","problema":"como viola"}],
  "clausulasFaltando": [{"clausula":"nome","importancia":"Alta" ou "Média","descricao":"por que é importante"}],
  "recomendacoes": [{"acao":"ação recomendada","prioridade":"Alta" ou "Média" ou "Baixa"}]
}
Seja rigoroso. Qualquer desvio das Regras de Ouro é uma violação. Cite trechos do contrato quando possível.`;

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#F4F6FA", surface: "#FFFFFF", surfaceAlt: "#F8F9FC",
  border: "#E2E8F0", borderStrong: "#CBD5E1",
  blue: "#2563EB", blueDim: "#93C5FD", blueLight: "#EFF6FF", blueMid: "#DBEAFE",
  text: "#0F172A", textMid: "#334155", textMuted: "#94A3B8", textLight: "#CBD5E1",
  red: "#DC2626", redBg: "#FEF2F2", redBorder: "#FECACA", redText: "#991B1B",
  orange: "#D97706", orangeBg: "#FFFBEB", orangeBorder: "#FDE68A", orangeText: "#92400E",
  green: "#059669", greenBg: "#F0FDF4", greenBorder: "#BBF7D0", greenText: "#065F46",
  yellow: "#B45309", yellowBg: "#FFFBEB", yellowBorder: "#FDE68A",
  slate: "#64748B",
};

const CONTRACT_TYPES = [
  { id: "Caminhão Betoneira", icon: "🚛", label: "CAMINHÃO BETONEIRA" },
  { id: "Auto Bomba", icon: "🏗", label: "AUTO BOMBA" },
  { id: "Usina de Concreto", icon: "🏭", label: "USINA DE CONCRETO" },
  { id: "Geral / Outro", icon: "📋", label: "GERAL / OUTRO" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const Badge = ({ color, bg, border, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 9px", borderRadius:4, fontSize:11, fontWeight:600, letterSpacing:"0.06em", color, background:bg, border:`1px solid ${border}` }}>{children}</span>
);

const RiskBadge = ({ level }) => {
  const m = { Alto:[C.redText,C.redBg,C.redBorder], Médio:[C.orangeText,C.orangeBg,C.orangeBorder], Baixo:[C.greenText,C.greenBg,C.greenBorder] };
  const [c,bg,b] = m[level]||[C.slate,C.bg,C.border];
  return <Badge color={c} bg={bg} border={b}>{level}</Badge>;
};

const GravBadge = ({ level }) => {
  const m = { Alta:[C.redText,C.redBg,C.redBorder], Média:[C.orangeText,C.orangeBg,C.orangeBorder], Baixa:[C.yellow,C.yellowBg,C.yellowBorder] };
  const [c,bg,b] = m[level]||[C.slate,C.bg,C.border];
  return <Badge color={c} bg={bg} border={b}>{level}</Badge>;
};

const Card = ({ borderLeft, bg, children, style={} }) => (
  <div style={{ background:bg||C.surface, border:`1px solid ${C.border}`, borderLeft:borderLeft?`3px solid ${borderLeft}`:undefined, borderRadius:8, padding:"14px 18px", marginBottom:10, ...style }}>{children}</div>
);

const SectionHead = ({ title, count, color }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
    <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:color||C.blue, textTransform:"uppercase" }}>{title}</span>
    {count !== undefined && <span style={{ fontSize:10, fontWeight:700, background:color||C.blue, color:"#fff", borderRadius:10, padding:"1px 7px" }}>{count}</span>}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────
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

  // ── IMPORTANTE: coloque sua chave da API Anthropic aqui ──
  // Gere em: https://console.anthropic.com/settings/keys
  const k1 = "sk-ant-api03-9skfPFvF4sPXY4sf";
const k2 = "WzoGlCM3M4i_oydCML-3l8wkJX1teMj6W_Q6YBRKL3c_P_bPfxThDelAI2XfFydPx35FBw-PTc77AAA";
const ANTHROPIC_API_KEY = k1 + k2;
  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    setText("");
    setPdfBase64(null);
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

  const clearFile = () => { setFileName(null); setPdfBase64(null); };

  const canAnalyze = !loading && (pdfBase64 || text.trim());

  const analyze = async () => {
    if (!canAnalyze) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const messageContent = pdfBase64
        ? [
            { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
            { type: "text", text: "Analise este contrato do cliente:" },
          ]
        : `Analise este contrato:\n\n${text.slice(0, 9000)}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-opus-4-5-20251001",
          max_tokens: 4000,
          system: buildPrompt(contractType),
          messages: [{ role: "user", content: messageContent }],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content?.map(b => b.text || "").join("") || "";
      setResult(JSON.parse(raw.replace(/```json|```/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").trim()));      setActiveTab("violacoes");
    } catch (err) {
      setError(`Erro ao analisar: ${err.message}. Verifique se a chave da API está correta.`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = result ? [
    { id:"violacoes", label:"Regras de Ouro", count:result.violacoesRegrasDeOuro?.length||0, color:C.red },
    { id:"conflitos", label:"Conflitos", count:result.conflitos?.length||0, color:C.orange },
    { id:"conformes", label:"Conformes", count:result.conformes?.length||0, color:C.green },
    { id:"faltando", label:"Faltando", count:result.clausulasFaltando?.length||0, color:C.yellow },
    { id:"acoes", label:"Ações", count:result.recomendacoes?.length||0, color:C.blue },
  ] : [];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:C.text }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@media print {
  body { background: white !important; }
  *[style*="width:400"] { display: none !important; }
  *[style*="width: 400"] { display: none !important; }
  *[style*="minWidth:400"] { display: none !important; }
  *[style*="overflow:hidden"] { overflow: visible !important; height: auto !important; }
  *[style*="height:calc"] { height: auto !important; }
  header { display: none !important; }
} { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
        textarea:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        button:hover { opacity: 0.9; }
      `}</style>

      {/* HEADER */}
      <header style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 40px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
          <span style={{ fontSize:18, fontWeight:800, color:C.blue, letterSpacing:"-0.02em" }}>VILLA</span>
          <span style={{ fontSize:15, fontWeight:400, color:C.textMid }}>Empreendimentos</span>
        </div>
        <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.16em", color:C.textMuted, textTransform:"uppercase" }}>
          Analisador de Contratos
        </span>
      </header>

      <div style={{ display:"flex", height:"calc(100vh - 56px)", overflow:"hidden" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ width:420, minWidth:420, background:C.surface, borderRight:`1px solid ${C.border}`, overflowY:"auto", padding:"28px 32px", display:"flex", flexDirection:"column", gap:22 }}>

          {/* Contract type */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", color:C.blue, textTransform:"uppercase", marginBottom:12 }}>
              Tipo de Contrato
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {CONTRACT_TYPES.map(t => {
                const active = contractType === t.id;
                return (
                  <button key={t.id} onClick={() => setContractType(t.id)} style={{ padding:"8px 14px", background:active?C.blueLight:C.surfaceAlt, border:`1.5px solid ${active?C.blue:C.border}`, borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:700, letterSpacing:"0.07em", color:active?C.blue:C.slate, textTransform:"uppercase", transition:"all 0.15s", display:"flex", alignItems:"center", gap:6 }}>
                    <span>{t.icon}</span>{t.label}
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize:11, color:C.textMuted, marginTop:8, lineHeight:1.5 }}>
              Base ativa: ABL · ABE · CBCO · CBSO + 21 Regras de Ouro
            </p>
          </div>

          <div style={{ height:1, background:C.border }} />

          {/* Upload area */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.14em", color:C.blue, textTransform:"uppercase" }}>
              Contrato do Cliente
            </p>

            {/* PDF dropzone */}
            {!pdfBase64 && (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById("villa-file-input").click()}
                style={{ border:`2px dashed ${dragging?C.blue:C.borderStrong}`, borderRadius:8, padding:"24px 16px", textAlign:"center", cursor:"pointer", background:dragging?C.blueLight:C.surfaceAlt, transition:"all 0.15s" }}
              >
                <div style={{ fontSize:30, marginBottom:8 }}>📄</div>
                <p style={{ fontSize:13, fontWeight:600, color:dragging?C.blue:C.textMid, marginBottom:4 }}>Arraste o PDF aqui</p>
                <p style={{ fontSize:11, color:C.textMuted }}>ou clique para selecionar · .pdf, .txt</p>
                <input
                  id="villa-file-input" type="file" accept=".pdf,.txt,.md"
                  style={{ display:"none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>
            )}

            {/* PDF selected */}
            {pdfBase64 && (
              <div style={{ background:C.blueLight, border:`1.5px solid ${C.blueDim}`, borderRadius:8, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>📄</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:C.blue, marginBottom:2 }}>{fileName}</p>
                  <p style={{ fontSize:11, color:C.textMuted }}>PDF pronto para análise</p>
                </div>
                <button onClick={clearFile} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMuted, fontSize:20, lineHeight:1, padding:"2px 6px" }}>✕</button>
              </div>
            )}

            {/* Or divider + textarea */}
            {!pdfBase64 && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ flex:1, height:1, background:C.border }} />
                  <span style={{ fontSize:11, color:C.textMuted }}>ou cole o texto</span>
                  <div style={{ flex:1, height:1, background:C.border }} />
                </div>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setFileName(null); }}
                  placeholder={"Cole aqui o texto do contrato enviado pelo cliente...\n\nExemplo: Contrato de locação nº 001/2025, celebrado entre EMPRESA XYZ (Contratante) e Villa Empreendimentos (Contratada)..."}
                  style={{ width:"100%", minHeight:200, background:C.surfaceAlt, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"14px 16px", fontSize:13, color:C.textMid, lineHeight:1.7, resize:"vertical", transition:"border-color 0.15s" }}
                />
              </>
            )}

            <p style={{ fontSize:11, color:C.textMuted, lineHeight:1.5 }}>
              💡 Quanto mais completo o contrato, mais precisa será a análise.
            </p>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyze}
            disabled={!canAnalyze}
            style={{ width:"100%", padding:"14px", background:!canAnalyze?C.border:C.blue, color:!canAnalyze?C.textMuted:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, letterSpacing:"0.08em", cursor:!canAnalyze?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"all 0.2s", textTransform:"uppercase" }}
          >
            {loading
              ? <><div style={{ width:16, height:16, border:"2px solid #fff4", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>Analisando...</>
              : "⚡ Analisar Contrato"
            }
          </button>

          <p style={{ fontSize:10, color:C.textMuted, textAlign:"center", lineHeight:1.5 }}>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
  <button onClick={()=>window.print()} style={{padding:"8px 20px",background:"#2563EB",color:"#fff",border:"none",borderRadius:6,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:"0.06em"}}>🖨 Imprimir Análise</button>
</div> · Consulte o jurídico para decisões finais
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex:1, overflowY:"auto", background:C.bg }}>

          {!loading && !result && !error && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:64, textAlign:"center" }}>
              <div style={{ fontSize:52, opacity:0.18 }}>📋</div>
              <p style={{ fontSize:15, fontWeight:700, color:C.textMuted, letterSpacing:"0.06em", textTransform:"uppercase" }}>Aguardando Contrato</p>
              <p style={{ fontSize:13, color:C.textMuted }}>Carregue o PDF ou cole o texto do contrato ao lado e clique em Analisar</p>
            </div>
          )}

          {loading && (
            <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:64 }}>
              <div style={{ width:44, height:44, border:`3px solid ${C.blueMid}`, borderTop:`3px solid ${C.blue}`, borderRadius:"50%", animation:"spin 0.9s linear infinite" }}/>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:14, fontWeight:600, color:C.textMid }}>Verificando 21 Regras de Ouro...</p>
                <p style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>Comparando com propostas {contractType}</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{ margin:32, background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:8, padding:"16px 20px", color:C.redText, fontSize:13, lineHeight:1.6 }}>
              ⚠ {error}
            </div>
          )}

          {result && !loading && (
            <div style={{ animation:"fadeUp 0.3s ease", padding:"28px 36px" }}>

              {/* Summary card */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"20px 24px", marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
                  <div style={{ flex:2, minWidth:200 }}>
                    <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:C.blue, textTransform:"uppercase", marginBottom:4 }}>Contrato Identificado</p>
                    <p style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>{result.tipoDetectado}</p>
                    <p style={{ fontSize:13, color:C.textMid, lineHeight:1.65 }}>{result.resumo}</p>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:16, alignItems:"flex-start" }}>
                    {[["Partes", result.partes?.join(" × ")], ["Prazo", result.prazo], ["Valor", result.valor], ["Reajuste", result.reajuste]].map(([l, v]) => v && (
                      <div key={l}>
                        <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:C.textMuted, textTransform:"uppercase", marginBottom:3 }}>{l}</p>
                        <p style={{ fontSize:12, color:C.textMid, maxWidth:160 }}>{v}</p>
                      </div>
                    ))}
                    <div>
                      <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", color:C.textMuted, textTransform:"uppercase", marginBottom:5 }}>Risco</p>
                      <RiskBadge level={result.riscoGeral}/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Violation alert */}
              {result.violacoesRegrasDeOuro?.length > 0 && (
                <div style={{ background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:8, padding:"12px 18px", marginBottom:18, display:"flex", alignItems:"center", gap:12, fontSize:13 }}>
                  <span style={{ fontSize:18 }}>🚨</span>
                  <span style={{ color:C.redText }}>
                    <strong>{result.violacoesRegrasDeOuro.length} violação(ões)</strong> de Regras de Ouro detectadas — itens inegociáveis que precisam ser ajustados.
                  </span>
                </div>
              )}

              {/* TABS */}
              <div style={{ display:"flex", gap:2, marginBottom:20, background:C.surfaceAlt, borderRadius:8, padding:4, border:`1px solid ${C.border}`, width:"fit-content" }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding:"7px 14px", background:activeTab===tab.id?C.surface:"transparent", border:activeTab===tab.id?`1px solid ${C.border}`:"1px solid transparent", borderRadius:6, color:activeTab===tab.id?tab.color:C.textMuted, fontSize:12, fontWeight:activeTab===tab.id?700:500, cursor:"pointer", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s", boxShadow:activeTab===tab.id?"0 1px 3px rgba(0,0,0,0.08)":"none" }}>
                    {tab.label}
                    {tab.count > 0 && <span style={{ fontSize:10, fontWeight:700, background:activeTab===tab.id?tab.color:C.borderStrong, color:activeTab===tab.id?"#fff":C.textMuted, borderRadius:10, padding:"0 6px", lineHeight:"18px" }}>{tab.count}</span>}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab==="violacoes" && (
                <div>
                  <SectionHead title="Violações das Regras de Ouro" count={result.violacoesRegrasDeOuro?.length} color={C.red}/>
                  {result.violacoesRegrasDeOuro?.length === 0
                    ? <Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Nenhuma violação de Regras de Ouro detectada.</p></Card>
                    : result.violacoesRegrasDeOuro?.map((v, i) => (
                        <Card key={i} bg={C.redBg} borderLeft={C.red}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:12}}>
                            <span style={{fontSize:11,fontWeight:700,color:C.redText,background:C.redBorder,borderRadius:4,padding:"2px 8px"}}>REGRA #{v.numero}</span>
                            <span style={{fontSize:10,fontWeight:700,color:C.redText,letterSpacing:"0.1em",textTransform:"uppercase"}}>INEGOCIÁVEL</span>
                          </div>
                          <p style={{fontSize:12,color:C.red,marginBottom:6,fontStyle:"italic"}}>{v.regra}</p>
                          <p style={{fontSize:13,color:C.redText,lineHeight:1.6}}>⚠ {v.problema}</p>
                        </Card>
                      ))
                  }
                </div>
              )}

              {activeTab==="conflitos" && (
                <div>
                  <SectionHead title="Conflitos com a Proposta Villa" count={result.conflitos?.length} color={C.orange}/>
                  {result.conflitos?.length === 0
                    ? <Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Nenhum conflito direto com a proposta.</p></Card>
                    : result.conflitos?.map((c, i) => (
                        <Card key={i} borderLeft={c.gravidade==="Alta"?C.red:c.gravidade==="Média"?C.orange:C.yellow}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                            <span style={{fontSize:13,fontWeight:600,color:C.text}}>{c.regra}</span>
                            <GravBadge level={c.gravidade}/>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                            <div style={{background:C.orangeBg,borderRadius:6,padding:"10px 12px"}}>
                              <p style={{fontSize:10,fontWeight:700,color:C.orange,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Contrato do cliente</p>
                              <p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.contratoCliente}</p>
                            </div>
                            <div style={{background:C.blueLight,borderRadius:6,padding:"10px 12px"}}>
                              <p style={{fontSize:10,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Villa exige</p>
                              <p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.villaEspera}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                  }
                </div>
              )}

              {activeTab==="conformes" && (
                <div>
                  <SectionHead title="Itens em Conformidade" count={result.conformes?.length} color={C.green}/>
                  {result.conformes?.length === 0
                    ? <Card><p style={{fontSize:13,color:C.textMuted}}>Nenhum item em conformidade identificado.</p></Card>
                    : result.conformes?.map((c, i) => (
                        <Card key={i} bg={C.greenBg} borderLeft={C.green}>
                          <div style={{display:"flex",gap:10}}>
                            <span style={{color:C.green,fontSize:15,marginTop:1,flexShrink:0}}>✓</span>
                            <div>
                              <p style={{fontSize:13,fontWeight:600,color:C.greenText,marginBottom:3}}>{c.regra}</p>
                              <p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.detalhe}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                  }
                </div>
              )}

              {activeTab==="faltando" && (
                <div>
                  <SectionHead title="Cláusulas Faltando no Contrato do Cliente" count={result.clausulasFaltando?.length} color={C.yellow}/>
                  {result.clausulasFaltando?.length === 0
                    ? <Card bg={C.greenBg} borderLeft={C.green}><p style={{fontSize:13,color:C.greenText,fontWeight:600}}>✓ Nenhuma cláusula essencial ausente.</p></Card>
                    : result.clausulasFaltando?.map((c, i) => (
                        <Card key={i} borderLeft={C.yellow}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                            <span style={{fontSize:13,fontWeight:600,color:C.text}}>{c.clausula}</span>
                            <Badge color={C.yellow} bg={C.yellowBg} border={C.yellowBorder}>{c.importancia}</Badge>
                          </div>
                          <p style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>{c.descricao}</p>
                        </Card>
                      ))
                  }
                </div>
              )}

              {activeTab==="acoes" && (
                <div>
                  <SectionHead title="Ações Recomendadas" count={result.recomendacoes?.length} color={C.blue}/>
                  {result.recomendacoes?.map((r, i) => (
                    <Card key={i} borderLeft={r.prioridade==="Alta"?C.red:r.prioridade==="Média"?C.orange:C.blue}>
                      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                        <span style={{fontSize:15,marginTop:1,flexShrink:0}}>{r.prioridade==="Alta"?"🔴":r.prioridade==="Média"?"🟡":"🔵"}</span>
                        <p style={{flex:1,fontSize:13,color:C.textMid,lineHeight:1.65}}>{r.acao}</p>
                        <GravBadge level={r.prioridade}/>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
