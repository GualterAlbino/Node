import User from '../db/user.model';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { closeDB, connectDB } from '../db/connection';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'node:fs';

const dataDir = './data';

if (!existsSync(dataDir)) {
  mkdirSync(dataDir);
}

async function* selectEntireDB() {
  const defaultLimite = 1000;
  let skip = 0;

  while (true) {
    const data = await User.findAll({
      limit: defaultLimite,
      offset: skip,
      raw: true
    });

    skip += defaultLimite;

    if (!data.length) {
      break;
    }

    for (const row of data) yield row;
  }
}

let processedItems = 0;
const dataStream = Readable.from(selectEntireDB()).map((item) => {
  processedItems++;
  return JSON.stringify(item) + '\n';
});

(async () => {
  await connectDB();
  console.time('create-file');
  await pipeline(dataStream, createWriteStream(`${dataDir}/legacy_users.ndjson`));
  console.log(`Processed ${processedItems} items`);
  console.timeEnd('create-file');
  await closeDB();
})();
