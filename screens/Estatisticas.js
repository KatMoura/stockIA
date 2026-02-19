import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { exportarParaCSV, exportarParaJSON, exportarRelatorio } from "../services/exportacao";

function CartaoEstatistica({ titulo, valor, icone, cor }) {
  return (
    <View style={styles.cartaoStat}>
      <View style={[styles.iconeEstat, { backgroundColor: cor + '20' }]}>
        <MaterialIcons name={icone} size={28} color={cor} />
      </View>
      <View style={styles.infoEstat}>
        <Text style={styles.valorEstat}>{valor}</Text>
        <Text style={styles.tituloEstat}>{titulo}</Text>
      </View>
    </View>
  );
}

function BarraCategoria({ categoria, quantidade, total, icone }) {
  const porcentagem = total > 0 ? (quantidade / total) * 100 : 0;

  return (
    <View style={styles.barraContainer}>
      <Text style={styles.barraLabel}>
        {icone} {categoria}
      </Text>
      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${porcentagem}%` }]} />
      </View>
      <Text style={styles.barraValor}>{quantidade}</Text>
    </View>
  );
}

export default function Estatisticas({ produtos, resumo, historico, onVoltar }) {
  const [exportando, setExportando] = useState(false);

  const estatisticasPorCategoria = () => {
    const categorias = {};

    produtos.forEach(produto => {
      const cat = produto.categoria || "Geral";
      if (!categorias[cat]) {
        categorias[cat] = { quantidade: 0, itens: 0 };
      }
      categorias[cat].quantidade += Number(produto.quantidade) || 0;
      categorias[cat].itens += 1;
    });

    return Object.entries(categorias)
      .map(([nome, dados]) => ({ nome, ...dados }))
      .sort((a, b) => b.quantidade - a.quantidade);
  };

  const exportar = async (tipo) => {
    setExportando(true);
    try {
      if (tipo === 'csv') {
        await exportarParaCSV(produtos);
        Alert.alert("Sucesso", "Dados exportados em CSV!");
      } else if (tipo === 'json') {
        await exportarParaJSON(produtos, historico);
        Alert.alert("Sucesso", "Dados exportados em JSON!");
      } else if (tipo === 'relatorio') {
        await exportarRelatorio(produtos, resumo);
        Alert.alert("Sucesso", "Relatório gerado!");
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível exportar os dados.");
    }
    setExportando(false);
  };

  const dadosCategorias = estatisticasPorCategoria();
  const totalUnidades = produtos.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Estatísticas</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.gradeStats}>
          <CartaoEstatistica
            titulo="Total de Produtos"
            valor={resumo.total}
            icone="inventory"
            cor="#2563EB"
          />
          <CartaoEstatistica
            titulo="Total de Unidades"
            valor={totalUnidades}
            icone="format-list-numbered"
            cor="#16A34A"
          />
          <CartaoEstatistica
            titulo="Baixo Estoque"
            valor={resumo.baixoEstoque}
            icone="warning"
            cor="#F59E0B"
          />
          <CartaoEstatistica
            titulo="Vencidos"
            valor={resumo.vencidos}
            icone="error"
            cor="#DC2626"
          />
        </View>

        <Text style={styles.secaoTitulo}>Produtos por Categoria</Text>
        <View style={styles.barrasContainer}>
          {dadosCategorias.length > 0 ? (
            dadosCategorias.map((cat) => (
              <BarraCategoria
                key={cat.nome}
                categoria={cat.nome}
                quantidade={cat.itens}
                total={resumo.total}
                icone="📊"
              />
            ))
          ) : (
            <Text style={styles.vazio}>Nenhum produto cadastrado</Text>
          )}
        </View>

        <Text style={styles.secaoTitulo}>Exportar Dados</Text>
        <View style={styles.exportContainer}>
          <TouchableOpacity
            style={styles.botaoExport}
            onPress={() => exportar('csv')}
            disabled={exportando || produtos.length === 0}
          >
            <MaterialIcons name="table-chart" size={24} color="#FFFFFF" />
            <Text style={styles.textoBotaoExport}>Exportar CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExport}
            onPress={() => exportar('json')}
            disabled={exportando || produtos.length === 0}
          >
            <MaterialIcons name="code" size={24} color="#FFFFFF" />
            <Text style={styles.textoBotaoExport}>Exportar JSON</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoExport}
            onPress={() => exportar('relatorio')}
            disabled={exportando || produtos.length === 0}
          >
            <MaterialIcons name="description" size={24} color="#FFFFFF" />
            <Text style={styles.textoBotaoExport}>Gerar Relatório</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.botaoVoltar} onPress={onVoltar}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC"
  },
  topo: {
    marginBottom: 16
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A"
  },
  scroll: {
    flex: 1
  },
  gradeStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20
  },
  cartaoStat: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center"
  },
  iconeEstat: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  infoEstat: {
    flex: 1
  },
  valorEstat: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A"
  },
  tituloEstat: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600"
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10,
    marginBottom: 12
  },
  barrasContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20
  },
  barraContainer: {
    marginBottom: 16
  },
  barraLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6
  },
  barraFundo: {
    height: 24,
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden"
  },
  barraPreenchida: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 12
  },
  barraValor: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "right"
  },
  vazio: {
    textAlign: "center",
    color: "#94A3B8",
    padding: 20
  },
  exportContainer: {
    gap: 10,
    marginBottom: 20
  },
  botaoExport: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  textoBotaoExport: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15
  },
  botaoVoltar: {
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10,
    marginTop: 10
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700"
  }
});
