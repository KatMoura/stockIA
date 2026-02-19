import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatarDataHora, obterDescricaoMovimentacao } from "../services/historico";

function ItemHistorico({ movimentacao }) {
  const obterIcone = () => {
    switch (movimentacao.tipo) {
      case 'adicionar':
        return { nome: 'add-circle', cor: '#16A34A' };
      case 'editar':
        return { nome: 'edit', cor: '#2563EB' };
      case 'remover':
        return { nome: 'delete', cor: '#DC2626' };
      case 'aumentar':
        return { nome: 'arrow-upward', cor: '#16A34A' };
      case 'diminuir':
        return { nome: 'arrow-downward', cor: '#DC2626' };
      default:
        return { nome: 'info', cor: '#475569' };
    }
  };

  const icone = obterIcone();

  return (
    <View style={styles.itemContainer}>
      <View style={[styles.iconeContainer, { backgroundColor: icone.cor + '20' }]}>
        <MaterialIcons name={icone.nome} size={24} color={icone.cor} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.descricao}>{obterDescricaoMovimentacao(movimentacao)}</Text>
        <Text style={styles.categoria}>{movimentacao.categoria}</Text>
        <Text style={styles.dataHora}>{formatarDataHora(movimentacao.dataHora)}</Text>
      </View>
    </View>
  );
}

export default function Historico({ historico, onVoltar, onLimpar }) {
  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Histórico</Text>
        {historico.length > 0 && (
          <TouchableOpacity onPress={onLimpar}>
            <Text style={styles.linkLimpar}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitulo}>Últimas movimentações do estoque</Text>

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemHistorico movimentacao={item} />}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <MaterialIcons name="history" size={64} color="#CBD5E1" />
            <Text style={styles.vazio}>Nenhuma movimentação registrada ainda</Text>
          </View>
        }
        contentContainerStyle={historico.length === 0 ? styles.listaVazia : styles.lista}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.botao} onPress={onVoltar}>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A"
  },
  linkLimpar: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 14
  },
  subtitulo: {
    color: "#475569",
    marginBottom: 16,
    marginTop: 4
  },
  lista: {
    paddingBottom: 16
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  vazioContainer: {
    alignItems: "center",
    padding: 40
  },
  vazio: {
    textAlign: "center",
    color: "#475569",
    marginTop: 16,
    fontSize: 16
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center"
  },
  iconeContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  infoContainer: {
    flex: 1
  },
  descricao: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 4
  },
  categoria: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 2
  },
  dataHora: {
    fontSize: 12,
    color: "#94A3B8"
  },
  botao: {
    marginTop: 12,
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700"
  }
});
