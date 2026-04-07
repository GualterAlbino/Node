// Faker
import { faker } from '@faker-js/faker';

// Outros

import User from '../db/user.model';
import { Readable } from 'node:stream';
import { connectDB, closeDB } from '../db/connection';

function generateUserStream(pTotalUsuarios: number) {
  let count = 0;

  return new Readable({
    objectMode: true,
    read() {
      // Se o contador for maior ou igual ao parâmetro envia um .push(null) indicando que a stream acabou
      if (count >= pTotalUsuarios) {
        this.push(null);
        return;
      }

      const user = {
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

      // Incrementa
      count++;
      this.push(user);
    }
  });
}

async function insertUserStream(pTotalUsuarios: number) {
  const userStream = generateUserStream(pTotalUsuarios);
  const batchSize = 1000;
  let batch = [];

  for await (const user of userStream) {
    batch.push(user);

    if (batch.length >= batchSize) {
      try {
        await User.bulkCreate(batch);
        batch = [];
      } catch (error) {
        console.error('Error inserting batch', error);
      }
    }
  }

  if (batch.length > 0) {
    try {
      await User.bulkCreate(batch);
      batch = [];
    } catch (error) {
      console.error('Error inserting batch', error);
    }
  }
}

(async () => {
  await connectDB();
  console.time('seed-stream');
  await insertUserStream(200_000);
  console.timeEnd('seed-stream');
  await closeDB();
})();
