import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { validarDataISO } from "../utilities/validade";
import { CATEGORIAS } from "../utilities/constantes";
import { CORES } from "../utilities/cores";

export default function EditarProduto({ produto, salvando, onSalvar, onCancelar }) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("Geral");
  const [quantidade, setQuantidade] = useState("");
  const [validade, setValidade] = useState("");

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setCategoria(produto.categoria);
      setQuantidade(String(produto.quantidade));
      setValidade(produto.validade);
    }
  }, [produto]);

  const categoriaAtual = CATEGORIAS.find(c => c.valor === categoria);

  const salvar = () => {
    const nomeFinal = nome.trim();
    const categoriaFinal = categoria.trim() || "Geral";
    const quantidadeNumero = Number(quantidade);

    if (!nomeFinal || !quantidade || !validade.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha nome, quantidade e validade.");
      return;
    }

    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) {
      Alert.alert("Quantidade inválida", "Informe um número inteiro maior ou igual a zero.");
      return;
    }

    if (!validarDataISO(validade.trim())) {
      Alert.alert("Validade inválida", "Use o formato AAAA-MM-DD.");
      return;
    }

    onSalvar({
      nome: nomeFinal,
      categoria: categoriaFinal,
      quantidade: quantidadeNumero,
      validade: validade.trim()
    });
  };

  if (!produto && !salvando) {
    return (
      <View style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.textoCarregando}>Carregando produto...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="edit" size={32} color={CORES.primaria} />
        <Text style={styles.titulo}>Editar Produto</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Nome */}
        <View style={styles.campo}>
          <Text style={styles.label}>
            <MaterialIcons name="label" size={16} color={CORES.primaria} /> Nome do Produto
          </Text>
          <TextInput
            placeholder="Ex: Leite Integral 1L"
            placeholderTextColor={CORES.textoClaro}
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Categoria */}
        <View style={styles.campo}>
          <Text style={styles.label}>
            <MaterialIcons name="category" size={16} color={CORES.primaria} /> Categoria
          </Text>

          {/* Categoria selecionada */}
          <View style={styles.categoriaSelecionada}>
            <Text style={styles.categoriaEmoji}>{categoriaAtual?.icone || "📦"}</Text>
            <Text style={styles.categoriaNome}>{categoria}</Text>
          </View>

          {/* Picker de categorias */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {CATEGORIAS.map((cat) => (
                <Picker.Item
                  key={cat.valor}
                  label={`${cat.icone} ${cat.valor}`}
                  value={cat.valor}
                  color={CORES.textoPrincipal}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.dica}>Selecione a categoria no menu acima</Text>
        </View>

        {/* Quantidade */}
        <View style={styles.campo}>
          <Text style={styles.label}>
            <MaterialIcons name="inventory" size={16} color={CORES.primaria} /> Quantidade
          </Text>
          <View style={styles.inputIcone}>
            <TextInput
              placeholder="0"
              placeholderTextColor={CORES.textoClaro}
              style={[styles.input, styles.inputNumero]}
              value={quantidade}
              keyboardType="numeric"
              onChangeText={setQuantidade}
            />
            <Text style={styles.unidade}>unidades</Text>
          </View>
        </View>

        {/* Validade */}
        <View style={styles.campo}>
          <Text style={styles.label}>
            <MaterialIcons name="event" size={16} color={CORES.primaria} /> Data de Validade
          </Text>
          <TextInput
            placeholder="AAAA-MM-DD (Ex: 2026-12-31)"
            placeholderTextColor={CORES.textoClaro}
            style={styles.input}
            value={validade}
            onChangeText={setValidade}
          />
          <Text style={styles.dica}>Formato: Ano-Mês-Dia</Text>
        </View>
      </View>

      {/* Botões */}
      <TouchableOpacity
        style={[styles.botaoPrincipal, salvando && styles.botaoDesabilitado]}
        onPress={salvar}
        disabled={salvando}
        activeOpacity={0.8}
      >
        {salvando ? (
          <>
            <MaterialIcons name="hourglass-empty" size={22} color="#FFFFFF" />
            <Text style={styles.textoBotao}>Salvando...</Text>
          </>
        ) : (
          <>
            <MaterialIcons name="check-circle" size={22} color="#FFFFFF" />
            <Text style={styles.textoBotao}>Salvar Alterações</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={onCancelar}
        disabled={salvando}
        activeOpacity={0.7}
      >
        <MaterialIcons name="close" size={20} color={CORES.textoPrincipal} />
        <Text style={styles.textoSecundario}>Cancelar</Text>
      </TouchableOpacity>

      <View style={styles.espacoFinal} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerCarregando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.fundoPrincipal,
  },
  textoCarregando: {
    marginTop: 10,
    color: CORES.textoSecundario,
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: CORES.fundoPrincipal,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "900",
    color: CORES.primaria,
  },
  form: {
    gap: 24,
  },
  campo: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: CORES.textoPrincipal,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: CORES.cinza300,
    backgroundColor: CORES.fundoCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: CORES.textoPrincipal,
    fontWeight: "500",
  },
  inputIcone: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  inputNumero: {
    flex: 1,
  },
  unidade: {
    fontSize: 14,
    fontWeight: "600",
    color: CORES.textoSecundario,
  },
  categoriaSelecionada: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: CORES.primaria + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CORES.primaria + '30',
  },
  categoriaEmoji: {
    fontSize: 32,
  },
  categoriaNome: {
    fontSize: 18,
    fontWeight: "700",
    color: CORES.primaria,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: CORES.primaria + '30',
    backgroundColor: CORES.fundoSecundario,
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 150,
  },
  pickerItem: {
    fontSize: 18,
    color: CORES.textoPrincipal,
  },
  dica: {
    fontSize: 12,
    color: CORES.textoClaro,
    fontStyle: "italic",
    marginTop: 4,
  },
  botaoPrincipal: {
    backgroundColor: CORES.primaria,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: CORES.primaria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 16,
  },
  botaoSecundario: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CORES.cinza300,
    backgroundColor: CORES.fundoCard,
  },
  textoSecundario: {
    textAlign: "center",
    color: CORES.textoPrincipal,
    fontWeight: "700",
    fontSize: 15,
  },
  espacoFinal: {
    height: 40,
  },
});
