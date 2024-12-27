import { DatabaseSync } from 'node:sqlite';
import SqlBricks from 'sql-bricks';

// :memory: é um banco de dados em memória
// Caso queira salvar em um arquivo, basta passar o caminho
const database = new DatabaseSync('./db.sqlite');

// Inicializar o banco de dados (Criação de tabelas com dados iniciais)
function runSeed(items) {
  database.exec(
    `
    DROP TABLE IF EXISTS students
    `
  );

  database.exec(
    `
    CREATE TABLE students(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL
    ) STRICT
    `
  );

  // Insere os dados no banco
  insert({ table: 'students', items: items });

  // Monta a SQL
  ;;const query = SqlBricks.select('name, phone').orderBy('name').from('students').toString();

  // Consulta os dados
  const dados = select(query);

  console.table(dados);
}

export function select(query) {
  return database.prepare(query).all();
}

export function insert({ table, items }) {
  const { text, values } = SqlBricks.insertInto(table, items).toParams({ placeholder: '?' });

  const insertStatement = database.prepare(text);
  insertStatement.run(...values);
}

runSeed([
  {
    name: 'Gualter Albino',
    phone: '32 999999999'
  },
  {
    name: 'Erick Wendel',
    phone: '11 999999999'
  },
  {
    name: 'Alastor do Radio',
    phone: '11 999999999'
  }
]);
