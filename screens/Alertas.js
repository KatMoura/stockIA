import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ItemProduto from "./components/ItemProduto";

export default function Alertas({ produtos, onAumentar, onDiminuir, onRemover, onVoltar }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alertas de validade</Text>
      <Text style={styles.subtitulo}>Itens vencidos ou proximos de vencer</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemProduto
            produto={item}
            onAumentar={onAumentar}
            onDiminuir={onDiminuir}
            onRemover={onRemover}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum item vencido ou proximo da validade.</Text>
        }
        contentContainerStyle={produtos.length === 0 ? styles.listaVazia : undefined}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.botao} onPress={onVoltar}>
        <Text style={styles.textoBotao}>Voltar ao painel</Text>
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
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A"
  },
  subtitulo: {
    color: "#475569",
    marginBottom: 10
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: "center"
  },
  vazio: {
    textAlign: "center",
    color: "#475569"
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
