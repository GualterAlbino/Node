// Faker
import { faker } from '@faker-js/faker';

// Outros
import User from '../db/user.model';
import { connectDB, closeDB } from '../db/connection';

function generateUser() {
  return {
    name: faker.internet.username(),
    company: faker.company.name(),
    dateBirth: faker.date.past(),
    password: faker.internet.username() + faker.company.name(),
    createdAt: faker.date.past({
      years: 10,
      refDate: new Date()
    }),
    updatedAt: faker.date.past({
      years: 6,
      refDate: new Date()
    }),
    lastPasswordUpdateAt: faker.date.past({
      years: 6,
      refDate: new Date()
    })
  };
}

async function seedUsersSequencial() {
  try {
    for (let i = 0; i < 200_000; i++) {
      const user = generateUser();
      await User.create(user);
    }
    console.log('Usuários inseridos');
  } catch (error) {
    console.error('Erro ao inserir: ', error);
  }
}

async function seedUsersParaleloPromisseAll() {
  const batchSize = 1000; // Tamanho do lote
  try {
    for (let i = 0; i < 200_000; i += 1000) {
      const batch = Array.from({ length: batchSize }, () => generateUser());

      await Promise.all(batch.map((user) => User.create(user)));
      console.log(`${i + batchSize} usuários inseridos`);
    }
    console.log('Usuários inseridos');
  } catch (error) {
    console.error('Erro ao inserir: ', error);
  }
}

async function seedUsersParaleloBulkWrite() {
  const batchSize = 1000; // Tamanho do lote
  try {
    for (let i = 0; i < 200_000; i += 1000) {
      const batch = Array.from({ length: batchSize }, () => generateUser());

      await User.bulkCreate(batch);

      console.log(`${i + batchSize} usuários inseridos`);
    }
    console.log('Usuários inseridos');
  } catch (error) {
    console.error('Erro ao inserir: ', error);
  }
}

async function seedUsers(pTipo: 'Sequencial' | 'ParaleloPromiseAll' | 'ParaleloBulkWrite') {
  switch (pTipo) {
    case 'Sequencial':
      return await seedUsersSequencial();
    case 'ParaleloPromiseAll':
      return await seedUsersParaleloPromisseAll();
    case 'ParaleloBulkWrite':
      return await seedUsersParaleloBulkWrite();
    default:
      throw `O tipo de inserção: "${pTipo}", é inválido!`;
  }
}

(async () => {
  await connectDB();
  console.time('seed-db');
  await seedUsers('Sequencial');
  console.timeEnd('seed-db');
  await closeDB();
})();
