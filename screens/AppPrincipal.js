import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text } from "react-native";
import Inicio from "./Inicio";
import Produtos from "./Produtos";
import AdicionarProduto from "./AdicionarProduto";
import EditarProduto from "./EditarProduto";
import Alertas from "./Alertas";
import Historico from "./Historico";
import Estatisticas from "./Estatisticas";
import {
  carregarProdutos,
  criarProduto,
  editarProduto,
  atualizarQuantidadeProduto,
  removerProduto,
  limparProdutos,
  carregarDadosDemonstracao,
  obterProdutoPorId
} from "../services/repositorioEstoque";
import {
  carregarHistorico,
  adicionarMovimentacao,
  limparHistorico
} from "../services/historico";
import { obterStatusValidade, ordenarPorValidade } from "../utilities/validade";
import { CORES } from "../utilities/cores";

function resumoEstoque(produtos) {
  const base = {
    total: produtos.length,
    vencidos: 0,
    proximos: 0,
    invalidos: 0,
    baixoEstoque: 0
  };

  return produtos.reduce((resumo, produto) => {
    const status = obterStatusValidade(produto.validade);

    if (status.tipo === "vencido") resumo.vencidos += 1;
    if (status.tipo === "proximo") resumo.proximos += 1;
    if (status.tipo === "invalido") resumo.invalidos += 1;
    if (Number(produto.quantidade) <= 5) resumo.baixoEstoque += 1;

    return resumo;
  }, base);
}

export default function AppPrincipal() {
  const [telaAtual, setTelaAtual] = useState("inicio");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [operandoInicio, setOperandoInicio] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [dadosProdutos, dadosHistorico] = await Promise.all([
        carregarProdutos(),
        carregarHistorico()
      ]);

      if (ativo) {
        setProdutos(ordenarPorValidade(dadosProdutos));
        setHistorico(dadosHistorico);
        setCarregando(false);
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, []);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const status = obterStatusValidade(produto.validade);
      const combinaFiltro = filtro === "todos" || status.tipo === filtro;
      const combinaBusca =
        termo.length === 0 ||
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo);

      return combinaFiltro && combinaBusca;
    });
  }, [busca, filtro, produtos]);

  const alertas = useMemo(
    () => produtos.filter((produto) => {
      const status = obterStatusValidade(produto.validade);
      return status.tipo === "vencido" || status.tipo === "proximo";
    }),
    [produtos]
  );

  const resumo = useMemo(() => resumoEstoque(produtos), [produtos]);

  const adicionarProduto = async (produto) => {
    setSalvando(true);
    const atualizados = await criarProduto(produto);
    await adicionarMovimentacao('adicionar', produto);
    const novoHistorico = await carregarHistorico();
    setProdutos(ordenarPorValidade(atualizados));
    setHistorico(novoHistorico);
    setSalvando(false);
    setTelaAtual("produtos");
  };

  const atualizarProduto = async (dadosAtualizados) => {
    if (!produtoEditando) return;

    setSalvando(true);
    const atualizados = await editarProduto(produtoEditando.id, dadosAtualizados);
    await adicionarMovimentacao('editar', { ...produtoEditando, ...dadosAtualizados });
    const novoHistorico = await carregarHistorico();
    setProdutos(ordenarPorValidade(atualizados));
    setHistorico(novoHistorico);
    setProdutoEditando(null);
    setSalvando(false);
    setTelaAtual("produtos");
  };

  const alterarQuantidade = async (id, delta) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const atualizados = await atualizarQuantidadeProduto(id, delta);
    await adicionarMovimentacao(
      delta > 0 ? 'aumentar' : 'diminuir',
      produto,
      { quantidade: Math.abs(delta) }
    );
    const novoHistorico = await carregarHistorico();
    setProdutos(ordenarPorValidade(atualizados));
    setHistorico(novoHistorico);
  };

  const excluirProduto = async (id) => {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const atualizados = await removerProduto(id);
    await adicionarMovimentacao('remover', produto);
    const novoHistorico = await carregarHistorico();
    setProdutos(ordenarPorValidade(atualizados));
    setHistorico(novoHistorico);
  };

  const iniciarEdicao = async (id) => {
    const produto = await obterProdutoPorId(id);
    if (produto) {
      setProdutoEditando(produto);
      setTelaAtual("editar");
    }
  };

  const limparHistoricoConfirmacao = () => {
    Alert.alert(
      "Limpar histórico",
      "Deseja realmente limpar todo o histórico de movimentações?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            await limparHistorico();
            setHistorico([]);
          }
        }
      ]
    );
  };

  const popularDemo = async () => {
    setOperandoInicio(true);
    const atualizados = await carregarDadosDemonstracao();
    setProdutos(ordenarPorValidade(atualizados));
    setOperandoInicio(false);
  };

  const limparEstoque = async () => {
    setOperandoInicio(true);
    const atualizados = await limparProdutos();
    setProdutos(atualizados);
    setOperandoInicio(false);
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.containerCarregando}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.textoCarregando}>Carregando estoque...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {telaAtual === "inicio" && (
        <Inicio
          totalProdutos={resumo.total}
          alertas={resumo.vencidos + resumo.proximos}
          carregando={operandoInicio}
          onEntrar={() => setTelaAtual("produtos")}
          onCarregarDemo={popularDemo}
          onLimparDados={limparEstoque}
        />
      )}

      {telaAtual === "produtos" && (
        <Produtos
          produtos={produtosFiltrados}
          resumo={resumo}
          busca={busca}
          filtro={filtro}
          onBusca={setBusca}
          onFiltro={setFiltro}
          onAdicionar={() => setTelaAtual("adicionar")}
          onAlertas={() => setTelaAtual("alertas")}
          onHistorico={() => setTelaAtual("historico")}
          onEstatisticas={() => setTelaAtual("estatisticas")}
          onVoltar={() => setTelaAtual("inicio")}
          onAumentar={(id) => alterarQuantidade(id, 1)}
          onDiminuir={(id) => alterarQuantidade(id, -1)}
          onRemover={excluirProduto}
          onEditar={iniciarEdicao}
        />
      )}

      {telaAtual === "adicionar" && (
        <AdicionarProduto
          salvando={salvando}
          onSalvar={adicionarProduto}
          onCancelar={() => setTelaAtual("produtos")}
        />
      )}

      {telaAtual === "editar" && (
        <EditarProduto
          produto={produtoEditando}
          salvando={salvando}
          onSalvar={atualizarProduto}
          onCancelar={() => {
            setProdutoEditando(null);
            setTelaAtual("produtos");
          }}
        />
      )}

      {telaAtual === "alertas" && (
        <Alertas
          produtos={alertas}
          onAumentar={(id) => alterarQuantidade(id, 1)}
          onDiminuir={(id) => alterarQuantidade(id, -1)}
          onRemover={excluirProduto}
          onVoltar={() => setTelaAtual("produtos")}
        />
      )}

      {telaAtual === "historico" && (
        <Historico
          historico={historico}
          onVoltar={() => setTelaAtual("produtos")}
          onLimpar={limparHistoricoConfirmacao}
        />
      )}

      {telaAtual === "estatisticas" && (
        <Estatisticas
          produtos={produtos}
          resumo={resumo}
          historico={historico}
          onVoltar={() => setTelaAtual("produtos")}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoPrincipal
  },
  containerCarregando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CORES.fundoPrincipal
  },
  textoCarregando: {
    marginTop: 10,
    color: CORES.textoSecundario,
    fontSize: 16,
    fontWeight: "600"
  }
});
