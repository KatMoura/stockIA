import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_HISTORICO = "@stokia/historico";
const LIMITE_HISTORICO = 100;

export async function carregarHistorico() {
  const dados = await AsyncStorage.getItem(CHAVE_HISTORICO);
  if (!dados) return [];

  try {
    const historico = JSON.parse(dados);
    if (!Array.isArray(historico)) return [];
    return historico;
  } catch {
    return [];
  }
}

async function persistirHistorico(historico) {
  await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}

export async function adicionarMovimentacao(tipo, produto, detalhes = {}) {
  const movimentacao = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    tipo, // 'adicionar', 'editar', 'remover', 'aumentar', 'diminuir'
    produtoNome: produto.nome,
    produtoId: produto.id,
    categoria: produto.categoria,
    dataHora: new Date().toISOString(),
    detalhes
  };

  const historico = await carregarHistorico();
  const atualizado = [movimentacao, ...historico].slice(0, LIMITE_HISTORICO);
  await persistirHistorico(atualizado);
  return atualizado;
}

export async function limparHistorico() {
  await AsyncStorage.removeItem(CHAVE_HISTORICO);
  return [];
}

export function formatarDataHora(isoString) {
  const data = new Date(isoString);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

export function obterDescricaoMovimentacao(movimentacao) {
  switch (movimentacao.tipo) {
    case 'adicionar':
      return `Produto "${movimentacao.produtoNome}" adicionado ao estoque`;
    case 'editar':
      return `Produto "${movimentacao.produtoNome}" foi editado`;
    case 'remover':
      return `Produto "${movimentacao.produtoNome}" removido do estoque`;
    case 'aumentar':
      return `+${movimentacao.detalhes.quantidade || 1} unidade(s) de "${movimentacao.produtoNome}"`;
    case 'diminuir':
      return `-${Math.abs(movimentacao.detalhes.quantidade || 1)} unidade(s) de "${movimentacao.produtoNome}"`;
    default:
      return `Movimentação de "${movimentacao.produtoNome}"`;
  }
}
