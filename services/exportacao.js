import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { obterStatusValidade } from '../utilities/validade';

export async function exportarParaJSON(produtos, historico = []) {
  const dados = {
    exportadoEm: new Date().toISOString(),
    totalProdutos: produtos.length,
    produtos,
    historico
  };

  const json = JSON.stringify(dados, null, 2);
  const fileName = `stokia_export_${Date.now()}.json`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, json);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar dados do StokIA'
    });
  }

  return fileUri;
}

export async function exportarParaCSV(produtos) {
  const linhas = [
    'ID,Nome,Categoria,Quantidade,Validade,Status,Atualizado Em'
  ];

  produtos.forEach(produto => {
    const status = obterStatusValidade(produto.validade);
    const linha = [
      produto.id,
      `"${produto.nome}"`,
      `"${produto.categoria}"`,
      produto.quantidade,
      produto.validade,
      status.texto,
      produto.atualizadoEm
    ].join(',');
    linhas.push(linha);
  });

  const csv = linhas.join('\n');
  const fileName = `stokia_export_${Date.now()}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, csv);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar dados do StokIA'
    });
  }

  return fileUri;
}

export async function exportarRelatorio(produtos, resumo) {
  const linhas = [
    '=== RELATÓRIO DE ESTOQUE - StokIA ===',
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    '',
    '--- RESUMO GERAL ---',
    `Total de produtos: ${resumo.total}`,
    `Produtos com baixo estoque: ${resumo.baixoEstoque}`,
    `Produtos próximos do vencimento: ${resumo.proximos}`,
    `Produtos vencidos: ${resumo.vencidos}`,
    `Produtos com data inválida: ${resumo.invalidos}`,
    '',
    '--- LISTA DE PRODUTOS ---',
    ''
  ];

  produtos.forEach((produto, index) => {
    const status = obterStatusValidade(produto.validade);
    linhas.push(`${index + 1}. ${produto.nome}`);
    linhas.push(`   Categoria: ${produto.categoria}`);
    linhas.push(`   Quantidade: ${produto.quantidade}`);
    linhas.push(`   Validade: ${produto.validade}`);
    linhas.push(`   Status: ${status.texto}`);
    linhas.push('');
  });

  const relatorio = linhas.join('\n');
  const fileName = `stokia_relatorio_${Date.now()}.txt`;
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, relatorio);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/plain',
      dialogTitle: 'Relatório de Estoque'
    });
  }

  return fileUri;
}
