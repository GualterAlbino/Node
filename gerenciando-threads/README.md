# Gerenciando Threads

<h1 align="center">
  Repositório dedicado a exemplos de gerenciamento de threads utilizando Node.js Worker Threads
</h1>

<p align="center">
  <a href="https://www.linkedin.com/in/gualter/">
    <img alt="Feito por: " src="https://img.shields.io/badge/Feito%20por%3A%20-Gualter%20Albino-%231158c7">
  </a>
  <a href="https://github.com/GualterAlbino/NodeStreams/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/GualterAlbino/NodeStreams">
  </a>
</p>

## :dart: Sobre

Este repositório conta com alguns exemplos simples de gerenciamento de threads utilizando Node.js Worker Threads. O objetivo é demonstrar como podemos criar e gerenciar threads em Node.js para realizar tarefas de forma eficiente e escalável, sem a necessidade de bloquear o thread principal.

## :rocket: Comandos

-- Arquivo "seed.ts" para popular o banco de dados com 200.000 registros utilizando diferentes abordagens:

```bash
  npx ts-node-dev src/seed/seed.ts
```

- ParaleloPromiseAll: Executando as operações de escrita uma após a outra, o que é ineficiente e demorado
- PromisseAll: Executando em paralelo e sobrecarregando o banco de dados com multiplas operações de escrita
- ParaleloBulkWrite: Executando em paralelo utilizando o método bulkWrite (inserção em lote), que é mais eficiente e reduz a sobrecarga no banco de dados

Obs: Lembre de alternar os parâmetros da função da closure desse arquivo observar as diferenças de desempenho entre as abordagens.

-- Arquivo "seed-with-streams.ts" para popular o banco de dados utilizando streams, o que é mais eficiente e escalável:

```bash
npx ts-node-dev src/seed/seed-with-streams.ts
```

-- Arquivo "export-db.js" para exportar os dados do banco de dados utilizando streams, o que é mais eficiente e escalável:

```bash
npx ts-node-dev src/scripts/export-db.ts
```

Obs: Exporta no formato ndjson, onde cada linha é um objeto JSON, facilitando a leitura e processamento dos dados posteriormente.



Paralelo 1 (Promise All):
seed-db: 1:58.387 (m:ss.mmm)


Paralelo 1 (Inserção em Lote):
seed-db: 0:24.77 (m:ss.mmm)



Streams:
seed-stream: 00:24.55 (m:ss.mmm)
