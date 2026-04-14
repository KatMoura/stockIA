# StokIA - MVP Mobile

Aplicativo mobile (Expo + React Native) para controle de estoque com foco em pequenas operacoes (mercado de bairro, cantina, farmacia pequena, estoque escolar).

## Problema real

Pequenos negocios costumam controlar estoque em caderno ou planilha manual. Isso causa:
- perda por vencimento;
- falta de visibilidade de itens com baixo estoque;
- demora para localizar produtos.

## Proposta de valor

Entregar uma versao minima, funcional e utilizavel por usuarios reais para:
- cadastrar produtos rapidamente;
- monitorar validade;
- agir sobre estoque com atualizacao imediata de quantidade.

## Escopo MVP implementado

- cadastro de produto (nome, categoria, quantidade, validade);
- painel com busca e filtros por status de validade;
- alerta de produtos vencidos e proximos de vencer;
- controle de estoque por item (+1, -1 e remocao);
- metricas essenciais (total, baixo estoque, proximos e vencidos);
- persistencia local com AsyncStorage.

## Recurso de demonstracao (seminario)

Na tela inicial ha dois atalhos:
- `Carregar dados de demonstracao`: popula o app com dados simulados prontos para demo;
- `Limpar dados locais`: reinicia o estado para nova apresentacao.

Isso permite apresentar tanto o conceito de **prototipo com dados simulados** quanto o **MVP funcional**.

## Mapeamento direto dos criterios da atividade

1. Versao mobile: app executa em Android/iOS via Expo.
2. MVP: contem o conjunto minimo de funcionalidades para resolver um problema especifico (gestao de estoque e validade).
3. Prototipo de alta fidelidade: interface navegavel e consistente, com opcao de dados simulados para demonstracao.
4. Problema real: controle de estoque e reducao de perdas por vencimento.

## Estrutura principal

- `stokia/telas/AppPrincipal.js`: fluxo principal de telas e estado global.
- `stokia/telas/Produtos.js`: painel principal do estoque.
- `stokia/telas/AdicionarProduto.js`: formulario com validacao.
- `stokia/telas/Alertas.js`: tela focada em risco de validade.
- `stokia/telas/componentes/ItemProduto.js`: card do item com acoes de estoque.
- `stokia/servicos/repositorioEstoque.js`: camada de persistencia.
- `stokia/utilitarios/validade.js`: regras de validade e ordenacao.

## Como rodar

```bash
cd stokia
npm install
npm run start
```

## Roteiro curto para o seminario (5-7 min)

1. Problema e publico-alvo (1 min).
2. Fluxo da solucao no app (2 min).
3. Demo ao vivo com dados simulados e operacoes de estoque (2-3 min).
4. Limites atuais e proximos passos (1 min): autenticacao, backend/API, relatorios e notificacoes push.

## Equipe

Preencher nomes dos integrantes (ate 3 alunos).
