import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ItemProduto from "./components/ItemProduto";
import { FILTROS } from "../utilities/constantes";

function CartaoResumo({ titulo, valor, alerta }) {
  return (
    <View style={[styles.cartaoResumo, alerta && styles.cartaoResumoAlerta]}>
      <Text style={styles.cartaoTitulo}>{titulo}</Text>
      <Text style={styles.cartaoValor}>{valor}</Text>
    </View>
  );
}

export default function Produtos({
  produtos,
  resumo,
  busca,
  filtro,
  onBusca,
  onFiltro,
  onAdicionar,
  onAlertas,
  onVoltar,
  onAumentar,
  onDiminuir,
  onRemover,
  onEditar,
  onHistorico,
  onEstatisticas
}) {
  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.titulo}>Painel de Estoque</Text>
        <TouchableOpacity onPress={onVoltar}>
          <Text style={styles.link}>Inicio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gradeResumo}>
        <CartaoResumo titulo="Total" valor={resumo.total} />
        <CartaoResumo titulo="Baixo estoque" valor={resumo.baixoEstoque} alerta={resumo.baixoEstoque > 0} />
        <CartaoResumo titulo="Proximos" valor={resumo.proximos} alerta={resumo.proximos > 0} />
        <CartaoResumo titulo="Vencidos" valor={resumo.vencidos} alerta={resumo.vencidos > 0} />
      </View>

      <TextInput
        placeholder="Buscar por nome ou categoria"
        style={styles.busca}
        value={busca}
        onChangeText={onBusca}
      />

      <View style={styles.filtros}>
        {FILTROS.map((item) => {
          const ativo = filtro === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.filtroBotao, ativo && styles.filtroBotaoAtivo]}
              onPress={() => onFiltro(item.id)}
            >
              <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemProduto
            produto={item}
            onAumentar={onAumentar}
            onDiminuir={onDiminuir}
            onRemover={onRemover}
            onEditar={onEditar}
          />
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto para esse filtro.</Text>}
        contentContainerStyle={produtos.length === 0 ? styles.listaVazia : undefined}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.acoesPrincipais}>
        <TouchableOpacity style={styles.botaoIcone} onPress={onHistorico}>
          <MaterialIcons name="history" size={24} color="#FFFFFF" />
          <Text style={styles.textoBotaoIcone}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoIcone} onPress={onEstatisticas}>
          <MaterialIcons name="bar-chart" size={24} color="#FFFFFF" />
          <Text style={styles.textoBotaoIcone}>Estatísticas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botaoPrincipal} onPress={onAdicionar}>
        <MaterialIcons name="add-circle" size={22} color="#FFFFFF" />
        <Text style={styles.textoBotao}>Novo produto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoAlerta} onPress={onAlertas}>
        <MaterialIcons name="warning" size={22} color="#FFFFFF" />
        <Text style={styles.textoBotao}>Alertas de validade</Text>
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
    alignItems: "center",
    marginBottom: 10
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A"
  },
  link: {
    color: "#0F172A",
    fontWeight: "600"
  },
  gradeResumo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  cartaoResumo: {
    width: "48%",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    padding: 10
  },
  cartaoResumoAlerta: {
    backgroundColor: "#FEE2E2"
  },
  cartaoTitulo: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600"
  },
  cartaoValor: {
    marginTop: 4,
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "800"
  },
  busca: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8
  },
  filtros: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  filtroBotao: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF"
  },
  filtroBotaoAtivo: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A"
  },
  filtroTexto: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 12
  },
  filtroTextoAtivo: {
    color: "#FFFFFF"
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: "center"
  },
  vazio: {
    textAlign: "center",
    color: "#475569"
  },
  acoesPrincipais: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10
  },
  botaoIcone: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6
  },
  textoBotaoIcone: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14
  },
  botaoPrincipal: {
    backgroundColor: "#0F172A",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  botaoAlerta: {
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700"
  }
});
