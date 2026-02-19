import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_PRODUTOS = "@stokia/produtos";

function sanitizarProduto(produto) {
  return {
    id: produto.id,
    nome: (produto.nome || "").trim(),
    categoria: (produto.categoria || "Geral").trim() || "Geral",
    quantidade: Number(produto.quantidade) || 0,
    validade: (produto.validade || "").trim(),
    atualizadoEm: produto.atualizadoEm || new Date().toISOString()
  };
}

export async function carregarProdutos() {
  const dados = await AsyncStorage.getItem(CHAVE_PRODUTOS);
  if (!dados) return [];

  try {
    const produtos = JSON.parse(dados);
    if (!Array.isArray(produtos)) return [];
    return produtos.map(sanitizarProduto);
  } catch {
    return [];
  }
}

async function persistirProdutos(produtos) {
  await AsyncStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
}

export async function criarProduto(baseProduto) {
  const novoProduto = sanitizarProduto({
    ...baseProduto,
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    atualizadoEm: new Date().toISOString()
  });

  const produtos = await carregarProdutos();
  const atualizados = [...produtos, novoProduto];
  await persistirProdutos(atualizados);
  return atualizados;
}

export async function editarProduto(id, dadosAtualizados) {
  const produtos = await carregarProdutos();
  const atualizados = produtos.map((produto) => {
    if (produto.id !== id) return produto;

    return sanitizarProduto({
      ...produto,
      ...dadosAtualizados,
      id: produto.id,
      atualizadoEm: new Date().toISOString()
    });
  });

  await persistirProdutos(atualizados);
  return atualizados;
}

export async function obterProdutoPorId(id) {
  const produtos = await carregarProdutos();
  return produtos.find(produto => produto.id === id);
}

export async function atualizarQuantidadeProduto(id, delta) {
  const produtos = await carregarProdutos();
  const atualizados = produtos.map((produto) => {
    if (produto.id !== id) return produto;

    const quantidadeAtual = Number(produto.quantidade) || 0;
    const quantidadeNova = Math.max(0, quantidadeAtual + delta);
    return {
      ...produto,
      quantidade: quantidadeNova,
      atualizadoEm: new Date().toISOString()
    };
  });

  await persistirProdutos(atualizados);
  return atualizados;
}

export async function removerProduto(id) {
  const produtos = await carregarProdutos();
  const atualizados = produtos.filter((produto) => produto.id !== id);
  await persistirProdutos(atualizados);
  return atualizados;
}

export async function limparProdutos() {
  await AsyncStorage.removeItem(CHAVE_PRODUTOS);
  return [];
}

export async function carregarDadosDemonstracao() {
  const dados = [
    {
      id: "demo-001",
      nome: "Leite UHT",
      categoria: "Laticinios",
      quantidade: 12,
      validade: "2026-02-20",
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "demo-002",
      nome: "Arroz 5kg",
      categoria: "Graos",
      quantidade: 4,
      validade: "2026-08-15",
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "demo-003",
      nome: "Iogurte Natural",
      categoria: "Laticinios",
      quantidade: 6,
      validade: "2026-02-10",
      atualizadoEm: new Date().toISOString()
    },
    {
      id: "demo-004",
      nome: "Molho de Tomate",
      categoria: "Mercearia",
      quantidade: 2,
      validade: "2026-03-05",
      atualizadoEm: new Date().toISOString()
    }
  ];

  await persistirProdutos(dados);
  return dados.map(sanitizarProduto);
}
