# API de Intervalos de Produtores

API REST que calcula o **intervalo mínimo e máximo entre vitórias
consecutivas de produtores** com base no dataset do **Golden Raspberry
Awards**.

A aplicação carrega o dataset CSV em um **banco SQLite em memória** e
expõe um endpoint para consultar os intervalos calculados.

---

# Stack Tecnológica

- Node.js
- TypeScript
- Express
- SQLite (em memória)
- Jest (testes de integração)
- Pino (logs estruturados)
- Docker

---

# Executando a Aplicação

## Com Docker

### Ambiente de desenvolvimento

```bash
docker compose --profile dev up --build
```

### Ambiente de produção

```bash
docker compose --profile prod up --build
```

A API ficará disponível em:

http://localhost:3000

---

## Executando localmente

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

---

# Endpoint da API

## Obter intervalos entre vitórias de produtores

    GET /producers/intervals

### Exemplo de resposta

```json
{
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

---

# Testes

Executar todos os testes:

```bash
npm test
```

O projeto possui **testes de integração** que validam:

- Estrutura da resposta da API
- Resultados determinísticos
- Tratamento de erros
- Inicialização correta do banco de dados

---

# Estrutura do Projeto

    src/
      app/
      controllers/
      services/
      repositories/
      database/
      utils/

    test/
      integration/

A arquitetura separa as responsabilidades em camadas:

- **Controllers** -> Camada HTTP
- **Services** -> Regras de negócio
- **Repositories** -> Acesso a dados
- **Database** -> Inicialização do SQLite

---

# Logs

A aplicação utiliza **Pino** para logs estruturados.

Os logs incluem:

- Método HTTP
- Rota acessada
- Código de status
- Tempo de resposta
- IP do cliente

No ambiente de desenvolvimento os logs são exibidos em formato
**pretty**. Durante os testes os logs são simplificados para evitar
ruído.

---

# Dataset

A aplicação carrega o **dataset CSV fornecido** durante a inicialização
e armazena os dados em um **SQLite em memória**.

Essa abordagem torna a API:

- rápida
- determinística
- ideal para testes automatizados

---

# Observações

- O banco é recriado a cada inicialização da aplicação.
- O dataset é carregado automaticamente no bootstrap da aplicação.
- A API foi projetada para ser simples de executar em ambiente local
  ou via Docker.
