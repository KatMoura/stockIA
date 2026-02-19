import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CORES } from "../utilities/cores";

export default function Inicio({
  totalProdutos,
  alertas,
  carregando,
  onEntrar,
  onCarregarDemo,
  onLimparDados
}) {
  return (
    <View style={styles.container}>
      {/* Header com gradiente simulado */}
      <View style={styles.header}>
        <View style={styles.iconeLogo}>
          <MaterialIcons name="inventory" size={48} color={CORES.primaria} />
        </View>
        <Text style={styles.titulo}>StokIA</Text>
        <Text style={styles.subtitulo}>Sistema Inteligente de Gestão de Estoque</Text>
      </View>

      {/* Cartões de estatísticas */}
      <View style={styles.cartoes}>
        <View style={styles.cartao}>
          <View style={[styles.iconeCartao, { backgroundColor: CORES.primaria + '15' }]}>
            <MaterialIcons name="inventory-2" size={32} color={CORES.primaria} />
          </View>
          <Text style={styles.numero}>{totalProdutos}</Text>
          <Text style={styles.label}>Produtos Cadastrados</Text>
        </View>

        <View style={[styles.cartao, alertas > 0 && styles.cartaoAlerta]}>
          <View style={[styles.iconeCartao, { backgroundColor: alertas > 0 ? CORES.alerta + '15' : CORES.info + '15' }]}>
            <MaterialIcons
              name={alertas > 0 ? "warning" : "check-circle"}
              size={32}
              color={alertas > 0 ? CORES.alerta : CORES.info}
            />
          </View>
          <Text style={[styles.numero, alertas > 0 && { color: CORES.alerta }]}>{alertas}</Text>
          <Text style={styles.label}>Alertas de Validade</Text>
        </View>
      </View>

      {/* Botões principais */}
      <TouchableOpacity
        style={styles.botaoPrincipal}
        onPress={onEntrar}
        activeOpacity={0.8}
      >
        <MaterialIcons name="dashboard" size={24} color="#FFFFFF" />
        <Text style={styles.textoBotao}>Acessar Painel de Controle</Text>
      </TouchableOpacity>

      {/* Seção de demo */}
      <View style={styles.secaoDemo}>
        <Text style={styles.tituloDemo}>Demonstração</Text>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={onCarregarDemo}
          disabled={carregando}
          activeOpacity={0.7}
        >
          <MaterialIcons name="science" size={20} color={CORES.primaria} />
          <Text style={styles.textoSecundario}>Carregar Dados de Demonstração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoLimpar}
          onPress={onLimparDados}
          disabled={carregando}
          activeOpacity={0.7}
        >
          <MaterialIcons name="delete-sweep" size={20} color={CORES.erro} />
          <Text style={styles.textoLimpar}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </View>

      {carregando && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={CORES.primaria} />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <MaterialIcons name="info-outline" size={16} color={CORES.textoClaro} />
        <Text style={styles.footerText}>MVP • Versão 1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoPrincipal,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
  },
  iconeLogo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: CORES.primaria + '10',
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: CORES.primaria + '20',
  },
  titulo: {
    fontSize: 42,
    fontWeight: "900",
    color: CORES.primaria,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitulo: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: "center",
    fontWeight: "600",
  },
  cartoes: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  cartao: {
    flex: 1,
    backgroundColor: CORES.fundoCard,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: CORES.primaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: CORES.primaria + '10',
  },
  cartaoAlerta: {
    borderColor: CORES.alerta + '30',
  },
  iconeCartao: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  numero: {
    fontSize: 32,
    fontWeight: "900",
    color: CORES.primaria,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: CORES.textoSecundario,
    fontWeight: "600",
    textAlign: "center",
  },
  botaoPrincipal: {
    width: "100%",
    backgroundColor: CORES.primaria,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: CORES.primaria,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  secaoDemo: {
    marginTop: 24,
    width: "100%",
  },
  tituloDemo: {
    fontSize: 16,
    fontWeight: "700",
    color: CORES.textoPrincipal,
    marginBottom: 12,
  },
  botaoSecundario: {
    width: "100%",
    backgroundColor: CORES.fundoSecundario,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: CORES.primaria + '20',
    marginBottom: 10,
  },
  textoSecundario: {
    color: CORES.primaria,
    fontWeight: "700",
    fontSize: 14,
  },
  botaoLimpar: {
    width: "100%",
    backgroundColor: CORES.fundoCard,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: CORES.cinza300,
  },
  textoLimpar: {
    color: CORES.erro,
    fontWeight: "700",
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  loadingText: {
    color: CORES.primaria,
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: CORES.textoClaro,
    fontWeight: "500",
  },
});
