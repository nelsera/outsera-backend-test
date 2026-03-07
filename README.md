# API de Intervalos de Produtores

API REST que calcula o **intervalo mínimo e máximo entre vitórias
consecutivas de produtores** com base no dataset do **Golden Raspberry
Awards**.

A aplicação carrega o dataset CSV em um **banco SQLite em memória**,
realiza o **processamento dos intervalos durante o bootstrap da
aplicação** e expõe um endpoint para consultar o resultado.

---

# Vídeo de Demonstração

Gravei um vídeo de aproximadamente **20 minutos** explicando:

- arquitetura da aplicação
- organização do código
- fluxo de processamento
- execução da API
- execução dos testes

Vídeo:

https://drive.google.com/file/d/15xbhEzMRU3dk81k7SvUXtZBaAIdUyh6C/view

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

# Arquitetura da Aplicação

A aplicação segue uma separação simples de responsabilidades:

- **Controllers** -> Camada HTTP
- **Services** -> Regras de negócio
- **Repositories** -> Acesso a dados
- **Database** -> Inicialização do banco SQLite
- **Utils** -> Funções auxiliares

Estrutura de diretórios:

    src/
      app/
      controllers/
      services/
      repositories/
      database/
      utils/

    test/
      integration/

Essa estrutura permite manter:

- código organizado
- responsabilidades bem separadas
- facilidade para testes

---

# Fluxo de Inicialização

Durante o **bootstrap da aplicação** ocorre o seguinte fluxo:

1.  Criação do banco **SQLite em memória**
2.  Carregamento do **dataset CSV**
3.  Normalização dos dados
4.  Persistência dos filmes vencedores no banco
5.  Processamento dos intervalos de produtores
6.  Disponibilização do endpoint HTTP

O cálculo dos intervalos é realizado **apenas uma vez durante a
inicialização da aplicação**.
Isso torna a API mais eficiente, pois evita recalcular os dados a cada
requisição.

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

A API ficará disponível em:

    http://localhost:3000

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
- Tratamento de erros
- Inicialização correta do banco de dados

Os testes utilizam **Jest** como o teste runner e supertest para ajudar nas requisições http.
