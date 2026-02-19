import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { obterStatusValidade } from "../../utilities/validade";

export default function ItemProduto({ produto, onAumentar, onDiminuir, onRemover, onEditar }) {
  const status = obterStatusValidade(produto.validade);

  const confirmarRemocao = () => {
    Alert.alert(
      "Remover produto",
      `Deseja remover ${produto.nome} do estoque?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => onRemover(produto.id) }
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.linhaTopo}>
        <View style={styles.infoPrincipal}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.categoria}>{produto.categoria}</Text>
        </View>

        <Text style={[styles.status, { color: status.cor }]}>{status.texto}</Text>
      </View>

      <Text style={styles.dado}>Qtd: {produto.quantidade}</Text>
      <Text style={styles.dado}>Validade: {produto.validade}</Text>

      <View style={styles.acoes}>
        <TouchableOpacity style={styles.botaoAcao} onPress={() => onDiminuir(produto.id)}>
          <MaterialIcons name="remove" size={18} color="#0F172A" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoAcao} onPress={() => onAumentar(produto.id)}>
          <MaterialIcons name="add" size={18} color="#0F172A" />
        </TouchableOpacity>

        {onEditar && (
          <TouchableOpacity style={styles.botaoEditar} onPress={() => onEditar(produto.id)}>
            <MaterialIcons name="edit" size={16} color="#2563EB" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.botaoRemover} onPress={confirmarRemocao}>
          <MaterialIcons name="delete" size={16} color="#B91C1C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  infoPrincipal: {
    flex: 1,
    paddingRight: 8
  },
  nome: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A"
  },
  categoria: {
    marginTop: 2,
    color: "#475569",
    fontWeight: "600",
    fontSize: 12
  },
  status: {
    fontWeight: "800",
    fontSize: 12
  },
  dado: {
    marginTop: 4,
    color: "#334155"
  },
  acoes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  botaoAcao: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center"
  },
  botaoEditar: {
    marginLeft: "auto",
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  botaoRemover: {
    marginLeft: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center"
  }
});
