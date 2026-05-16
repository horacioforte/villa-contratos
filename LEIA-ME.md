# Villa Empreendimentos — Analisador de Contratos

Aplicativo web para análise de contratos de clientes comparado com as propostas padrão e Regras de Ouro da Villa.

---

## Como colocar no ar (passo a passo)

### Passo 1 — Gerar sua chave da API Anthropic

1. Acesse: https://console.anthropic.com/settings/keys
2. Clique em **"Create Key"**
3. Dê um nome (ex: "Villa Contratos") e copie a chave gerada
   - Ela começa com `sk-ant-...`
4. **Guarde bem** — ela só aparece uma vez

---

### Passo 2 — Colocar a chave no aplicativo

1. Abra o arquivo: `src/App.jsx`
2. Encontre a linha (por volta da linha 100):
   ```
   const ANTHROPIC_API_KEY = "COLOQUE_SUA_CHAVE_AQUI";
   ```
3. Substitua `COLOQUE_SUA_CHAVE_AQUI` pela sua chave real:
   ```
   const ANTHROPIC_API_KEY = "sk-ant-api03-...";
   ```
4. Salve o arquivo

---

### Passo 3 — Subir para o GitHub

1. Acesse: https://github.com e crie uma conta (se não tiver)
2. Clique em **"New repository"**
3. Nome: `villa-contratos` → Clique em **"Create repository"**
4. Faça upload de todos os arquivos desta pasta para o repositório

---

### Passo 4 — Deploy no Vercel (gratuito)

1. Acesse: https://vercel.com e crie uma conta com o GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `villa-contratos`
4. Clique em **"Deploy"**
5. Aguarde ~1 minuto

✅ Pronto! Você receberá um link tipo:
`https://villa-contratos.vercel.app`

Qualquer pessoa da equipe pode acessar esse link no navegador.

---

## Estrutura dos arquivos

```
villa-contratos/
├── index.html          ← Página principal
├── package.json        ← Dependências do projeto
├── vite.config.js      ← Configuração do bundler
└── src/
    ├── main.jsx        ← Ponto de entrada
    └── App.jsx         ← APLICATIVO COMPLETO (editar aqui)
```

---

## Equipamentos e propostas incluídas

| Sigla | Equipamento |
|-------|-------------|
| ABL   | Auto Bomba com Lança — com operador |
| ABE   | Auto Bomba Estacionária — com operador |
| CBCO  | Caminhão Betoneira — com operador |
| CBSO  | Caminhão Betoneira — sem operador |

Além das **21 Regras de Ouro** da Villa.

---

## Para atualizar propostas ou regras no futuro

Abra o arquivo `src/App.jsx` e edite as constantes no topo:
- `GOLDEN_RULES` → as 21 regras de ouro
- `PROPOSALS_BY_TYPE` → propostas por tipo de equipamento

---

## Suporte técnico

Em caso de dúvidas sobre deploy, entre em contato com o desenvolvedor responsável.
