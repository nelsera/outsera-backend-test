# Changelog

Todas as mudanças importantes deste projeto serão documentadas neste arquivo.

---

## [1.1.0] - 2026-03-06

### Adicionado

- Pré-processamento dos intervalos de prêmios dos produtores durante a inicialização da aplicação.
- O cálculo dos intervalos agora é executado na fase de **bootstrap da aplicação**, evitando recálculo a cada requisição da API.

### Melhorado

- Melhoria de performance ao calcular os intervalos **apenas uma vez no startup da aplicação**.
- Redução do tempo de resposta do endpoint, pois os resultados agora são **pré-calculados**.

---

## [1.0.1] - 2026-03-05

### Melhorado

- O carregador de CSV agora possui **tratamento explícito de erros**.
- A causa original do erro é preservada para facilitar **debug e observabilidade**.

---

## [1.0.0] - 2026-03-05

### Adicionado

- Endpoint `GET /producers/intervals` que retorna o intervalo mínimo e máximo entre vitórias consecutivas de produtores.
- Carregamento do dataset CSV durante a inicialização da aplicação.
- Utilitário para parsing dos nomes de produtores no dataset.
- Implementação da lógica de negócio para cálculo dos intervalos entre prêmios.
- Middleware global para tratamento de erros da API.

### Testes

- Testes de integração cobrindo:
  - respostas bem-sucedidas (`200`)
  - resultados determinísticos
  - validação da estrutura da resposta
  - cenários de erro (`503` quando o banco não está inicializado e `404` para rotas inexistentes)

### Infraestrutura

- Banco de dados **SQLite em memória** para execução rápida e determinística.
- Ambiente Docker para execução da API (perfis de desenvolvimento e produção).
- Jest configurado com **suporte a TypeScript (`ts-jest`)**.
- Suporte a **alias de caminhos** para imports mais limpos (ex: `#database`, `#repositories`, `#utils`).

### Melhorado

- Logging estruturado utilizando **Pino**.
- Logs de requisição HTTP incluindo:
  - método HTTP
  - rota acessada
  - código de status
  - tempo de resposta
  - IP do cliente

- Logs automaticamente simplificados durante execução de testes para evitar ruído.
