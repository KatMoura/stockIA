# 📦 StokIA - Guia Completo do Projeto

## 🎯 O que é o StokIA?

**StokIA** é um aplicativo mobile desenvolvido em **React Native + Expo** que resolve um problema real: **gestão de estoque em pequenos negócios**. 

O app permite que pequenos empreendedores (donos de mercado, cantina, farmácia, escola) façam controle eficiente de seus produtos, especialmente monitorando prazos de validade para evitar perdas.

---

## 🔴 O Problema que o App Resolve

### Cenário Real:
Pequenos negócios enfrentam desafios sérios de gestão:

| Problema | Impacto |
|----------|--------|
| 📝 Controle manual em caderno/planilha | Desorganização, informações imprecisas |
| ⚠️ Perda de produtos vencidos | Perdas financeiras significativas |
| 👁️ Falta de visibilidade de estoque | Compras duplicadas, falta de produtos |
| 🔍 Dificuldade em localizar produtos | Desperdício de tempo, atendimento lento |
| 💥 Nenhuma automação | Processo totalmente manual e propenso a erros |

**Resultado:** Prejuízos financeiros e operacional ineficiente.

---

## ✅ Como o StokIA Resolve

O aplicativo oferece uma solução **simples, intuitiva e prática**:

### 1️⃣ **Cadastro Rápido de Produtos**
- Nome, categoria, quantidade e data de validade
- Validação automática de dados
- Categorias pré-definidas para agilizar

### 2️⃣ **Monitoramento Automático de Validade**
- Calcula dias até vencimento
- Classifica produto: `OK` | `PRÓXIMO` | `VENCIDO`
- Cores visuais para rápida identificação

### 3️⃣ **Alertas de Risco**
- Tela dedicada para produtos críticos (vencidos ou próximos)
- Filtros por status de validade
- Aviso vermelho para máxima visibilidade

### 4️⃣ **Controle de Estoque em Tempo Real**
- Aumentar/Diminuir quantidade com 1 clique
- Remover produtos da listagem
- Editar informações quando necessário

### 5️⃣ **Dashboard com Métricas**
- Total de produtos
- Quantidade em baixo estoque (≤5 itens)
- Produtos próximos de vencer
- Produtos vencidos
- Visualização em cards coloridos

### 6️⃣ **Histório de Movimentações**
- Rastreio de todas as alterações
- Data e hora de cada operação
- Facilita auditoria e análise

### 7️⃣ **Persistência Local**
- Dados salvos no dispositivo
- Sem necessidade de internet
- Sincronização segura

---

## 🏗️ Arquitetura Técnica

### Estrutura do Projeto:

```
stokia/
├── App.js                          (Ponto de entrada)
├── screens/                        (Telas do app)
│   ├── AppPrincipal.js            (Gerenciamento central e navegação)
│   ├── Inicio.js                  (Home - Dashboard)
│   ├── Produtos.js                (Painel de estoque principal)
│   ├── AdicionarProduto.js        (Formulário de novo produto)
│   ├── EditarProduto.js           (Editar produto existente)
│   ├── Alertas.js                 (Produtos críticos)
│   ├── Historico.js               (Log de movimentações)
│   ├── Estatisticas.js            (Análise de dados)
│   └── components/
│       └── ItemProduto.js         (Card reutilizável de produto)
│
├── services/                       (Lógica de negócio)
│   ├── repositorioEstoque.js      (CRUD de produtos + persistência)
│   └── historico.js               (Log de movimentações)
│
└── utilities/                      (Funções auxiliares)
    ├── validade.js                (Cálculos e validação de datas)
    ├── cores.js                   (Paleta de cores)
    └── constantes.js              (Categorias e filtros)
```

### Fluxo de Dados:

```
┌─────────────────────┐
│   AppPrincipal.js   │  ← Estado global (produtos, histórico, filtros)
└──────────┬──────────┘
           │
    ┌──────┴─────────┬──────────────┬──────────────┐
    ↓                ↓              ↓              ↓
Produtos.js   Alertas.js   Historico.js   Estatisticas.js
    ↓
ItemProduto.js (Componente reutilizável)
    │
    └─→ repositorioEstoque.js (AsyncStorage - Persistência)
```

---

## 💾 Como a Persistência Funciona (AsyncStorage)

### O que é AsyncStorage?
É um armazenamento chave-valor nativo do React Native. Simples, rápido, sem necessidade de servidor.

### Fluxo de Salvamento:

```javascript
// 1. Usuário adiciona um produto
onAdicionarProduto({
  nome: "Arroz",
  categoria: "Alimentos",
  quantidade: 10,
  validade: "2026-06-15"
})
    ↓
// 2. AppPrincipal.js chama a função
criarProduto(produto)
    ↓
// 3. repositorioEstoque.js recebe
- Gera ID único: "1739953200000-a1b2c3"
- Sanitiza os dados
- Carrega lista existente do AsyncStorage
- Adiciona novo produto
    ↓
// 4. Persiste no armazenamento local
AsyncStorage.setItem("@stokia/produtos", JSON.stringify([...produtos]))
    ↓
// 5. Interface atualiza
setProdutos() → Render automático
```

---

## 📊 Exemplo Prático: Cálculo de Validade

### Como funciona o sistema de classificação:

```javascript
// Entrada: Data em formato AAAA-MM-DD
dataValidade = "2026-03-15"
dataHoje = "2026-02-19"  // Hoje

// Cálculo:
dias = 24 dias até vencer

// Classificação automática:
if (dias < 0)    → "VENCIDO"    (Cor vermelha: #DC2626)
if (dias ≤ 7)    → "PRÓXIMO"    (Cor amarela: #CA8A04)
if (dias > 7)    → "OK"         (Cor verde: #16A34A)
if (data inválida) → "DATA INVALIDA" (Cor cinza)
```

### Ordenação Automática:
Os produtos são **ordenados por validade** (mais próximos de vencer = topo):

```
1. Produto A - Vencido (dias: -5)
2. Produto B - Crítico (dias: 2)
3. Produto C - Próximo (dias: 6)
4. Produto D - OK (dias: 20)
```

---

## 🔐 Validações Implementadas

O app valida todas as entradas do usuário:

### Ao Adicionar Produto:

| Campo | Validação | Mensagem de Erro |
|-------|-----------|------------------|
| **Nome** | Obrigatório, não vazio | "Preencha o nome" |
| **Quantidade** | Número inteiro ≥ 0 | "Quantidade inválida" |
| **Validade** | Formato AAAA-MM-DD | "Use formato AAAA-MM-DD" |
| **Categoria** | Selecionada no Picker | Padrão: "Geral" |

```javascript
// Exemplo de validação:
if (!nome.trim() || !quantidade || !validade.trim()) {
  Alert.alert("Campos obrigatórios", "Preencha todos!");
}

if (!Number.isInteger(Number(quantidade)) || Number(quantidade) < 0) {
  Alert.alert("Quantidade inválida", "Digite um número inteiro positivo");
}

if (!validarDataISO(validade)) {
  Alert.alert("Validade inválida", "Use AAAA-MM-DD");
}
```

---

## 🎮 Fluxo de Uso (User Journey)

### Cenário: Dona de cantina abrindo o app pela primeira vez

```
1. TELA INICIAL (Inicio.js)
   ├─ Opção: "Carregar dados de demonstração"
   └─ Opção: "Limpar dados locais"

2. BOTÃO: "Ir para Painel"
   ↓
3. PAINEL DE ESTOQUE (Produtos.js)
   ├─ Resumo: Total, Baixo estoque, Próximos, Vencidos
   ├─ Barra de busca: "Buscar por nome ou categoria"
   ├─ Filtros: [Todos] [OK] [Crítico] [Vencido]
   └─ Lista de produtos com cards

4. CARD DO PRODUTO (ItemProduto.js)
   ├─ Nome, Categoria, Status
   ├─ Quantidade e Validade
   └─ Ações:
      ├─ [-] Diminuir quantidade
      ├─ [+] Aumentar quantidade
      ├─ [✏️] Editar produto
      └─ [🗑️] Remover produto

5. BOTÃO: "Novo Produto"
   ↓
6. FORMULÁRIO (AdicionarProduto.js)
   ├─ Nome: [Arroz...]
   ├─ Categoria: [Picker com opções]
   ├─ Quantidade: [10]
   ├─ Validade: [2026-06-15]
   └─ Botão: [Salvar]

7. PRODUTO SALVO
   └─ Volta para Produtos.js
   └─ Lista atualiza automaticamente
   └─ Produto aparece ordenado por validade
   └─ Movimentação registrada no histórico
```

---

## 📱 Tecnologias Utilizadas

### **React Native & Expo**
- **O quê:** Framework JavaScript para apps mobile multiplataforma
- **Por quê:** Código único para iOS e Android, desenvolvimento rápido
- **Como:** `expo start --android` para testar no emulador

### **AsyncStorage**
- **O quê:** Banco de dados local do React Native
- **Por quê:** Simples, sem necessidade de servidor, persiste dados
- **Limite:** ~10MB por app (suficiente para nosso MVP)

### **React Picker**
- **O quê:** Componente nativo para selecionar categorias
- **Por quê:** Interface nativa e familiar para usuários

### **React Navigation (implícito)**
- **O quê:** Sistema de navegação entre telas
- **Como:** useState + telaAtual para controlar qual tela exibir

### **MaterialIcons**
- **O quê:** Biblioteca de ícones do Material Design
- **Por quê:** Interface visual moderna e intuitiva

---

## 🧪 O que foi Testado

### Testes Funcionais Implementados:

✅ **Cadastro:**
- Produto com dados válidos → Salvo no AsyncStorage
- Campo vazio → Alerta de erro
- Quantidade negativa → Rejeitado
- Data inválida → Rejeitado

✅ **Listagem:**
- Produtos aparecem ordenados por validade
- Filtros funcionam (Todos, OK, Crítico, Vencido)
- Busca por nome e categoria funcionam
- Resumo atualiza corretamente

✅ **Controle de Estoque:**
- [+] Aumenta quantidade corretamente
- [-] Diminui e não deixa ficar negativo
- [Remover] Remove do armazenamento
- Histórico registra cada ação

✅ **Persistência:**
- Dados salvam quando app fecha
- Dados carregam quando app abre
- Dados demonstração carregam corretamente
- Limpeza de dados funciona

---

## 🎨 Interface & User Experience

### Princípios Aplicados:

| Princípio | Implementação |
|-----------|---------------|
| **Clareza** | Cards bem organizados, títulos grandes |
| **Cores com significado** | Verde=OK, Amarelo=Alerta, Vermelho=Crítico |
| **Feedback visual** | Alertas ao deletar, desabilitação em salvamento |
| **Eficiência** | Buscas rápidas, filtros instantâneos |
| **Acessibilidade** | Ícones + textos, alto contraste |
| **Mobile-first** | Botões grandes, toques fáceis |

---

## 📈 Métricas do App

### O que o Dashboard mostra:

```
┌─ Total de Produtos ────────────────────┐
│  Conta todos os itens cadastrados      │
└────────────────────────────────────────┘

┌─ Baixo Estoque ────────────────────────┐
│  Produtos com quantidade ≤ 5           │
│  Aviso para reabastecer                │
└────────────────────────────────────────┘

┌─ Próximos de Vencer ───────────────────┐
│  Produtos com 1-7 dias até validade    │
│  Atenção: consumir antes               │
└────────────────────────────────────────┘

┌─ Vencidos ─────────────────────────────┐
│  Produtos com validade expirada        │
│  Crítico: remover do estoque           │
└────────────────────────────────────────┘
```

---

## 🚀 Como Rodar o App

### Pré-requisitos:
```bash
# Node.js instalado
# Expo CLI global
npm install -g expo-cli
```

### Passos:
```bash
# 1. Entrar na pasta do projeto
cd stokia

# 2. Instalar dependências
npm install

# 3. Iniciar Expo
npm run start

# 4. Abrir no emulador ou celular
# Android: a (precisa Android Studio)
# iOS: i (precisa XCode - macOS)
# Web: w
```

### Dados de Teste:
Na tela inicial, clique em **"Carregar dados de demonstração"** para popular com dados simulados prontos para demo.

---

## 💡 Diferenciais do MVP

| Aspecto | StokIA | Caderno | Planilha |
|--------|--------|---------|----------|
| Acesso rápido | ✅ Celular sempre com você | ❌ Precisa de caderno | ❌ Precisa de notebook |
| Busca rápida | ✅ Busca em 1 segundo | ❌ Folhear manualmente | ⚡ Lento em muitos dados |
| Alertas automáticos | ✅ Notificações | ❌ Tem que lembrar | ❌ Tem que lembrar |
| Cálculo de validade | ✅ Automático | ❌ Manual | ⚡ Manual |
| Histórico | ✅ Automático | ⚡ Manual | ⚡ Manual |
| Sincronização | ✅ Instantânea | ❌ Não há | ❌ Não há |

---

## 🎯 Próximos Passos (Roadmap)

### Phase 2 - Backend & Autenticação:
- [ ] Login com email/senha
- [ ] API REST (Node.js + Express)
- [ ] Banco de dados (MongoDB)
- [ ] Sincronização na nuvem

### Phase 3 - Funcionalidades Avançadas:
- [ ] Relatórios PDF
- [ ] Integração com códigos de barras
- [ ] Notificações push
- [ ] Múltiplos usuários/lojas
- [ ] Análise de vendas

### Phase 4 - Monetização:
- [ ] Versão Premium
- [ ] Integração com sistema de vendas
- [ ] API para terceiros

---

## 🏆 Por que esse projeto é um MVPValioso?

### ✅ Resolve um problema REAL
Donos de pequenos negócios realmente perdem dinheiro com vencimento de produtos

### ✅ Solução VIÁVEL
Toda a lógica funcionando no dispositivo, sem necessidade de servidor

### ✅ Código LIMPO e ESCALÁVEL
Separação em camadas (Services, Utils, Components)

### ✅ INTUITIVO para usuários não-técnicos
Interface visual clara, sem jargão técnico

### ✅ Proto de ALTA FIDELIDADE
Navegável, interativo, com dados reais para demo

---

## ❓ Perguntas Frequentes para o Professor

### P: "Por que React Native?"
**R:** Permite desenvolver para iOS e Android com um único código. Perfeito para MVP com tempo limitado.

### P: "Por que AsyncStorage e não um banco local como SQLite?"
**R:** AsyncStorage é mais simples e suficiente para o volume de dados. SQLite seria overhead para MVP.

### P: "Como protege os dados?"
**R:** AsyncStorage é armazenado de forma segura no sistema operacional. Futuro: adicionar criptografia e autenticação.

### P: "Como escala para muitos produtos?"
**R:** AsyncStorage aguenta ~10MB. Com ~100 bytes por produto, comporta 100.000 itens. Escalável.

### P: "Pode virar um negócio?"
**R:** Sim! Versão gratuita com limite, Premium com features avançadas, API para integração com outros sistemas.

---

## 📝 Conclusão

**StokIA** é um MVP funcional que:
- ✅ Resolve um problema real de pequenos negócios
- ✅ Usa tecnologia moderna e apropriada
- ✅ Tem interface intuitiva e acessível
- ✅ Pode ser escalado para um produto comercial
- ✅ Demonstra domínio técnico em React Native/JavaScript

**Impacto:** Pode economizar centenas de reais mensais reduzindo perdas por vencimento em um pequeno negócio.