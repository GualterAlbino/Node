import SqlBricks from 'sql-bricks';
import { once } from 'node:events';
import { select, insert } from './db.js';
import { createServer } from 'node:http';
import { setTimeout } from 'node:timers/promises';

createServer(async (request, response) => {
  if (request.method === 'GET') {
    // Monta a SQL
    const query = SqlBricks.select('name, phone').orderBy('name').from('students').toString();
    const items = select(query);
    return response.end(JSON.stringify(items));
  }

  if (request.method === 'POST') {
    const item = JSON.parse(await once(request, 'data'));
    insert({ table: 'students', items: [item] });

    response.end(
      JSON.stringify({
        message: `Student: ${item.name} created.`
      })
    );
  }
}).listen(3000, () => {
  console.log('Servidor em execução.');
});

await setTimeout(500);

{
  const result = await (
    await fetch('http://localhost:3000', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alacarte',
        phone: '4022-8922'
      })
    })
  ).json();
  console.log('POST', result);
}

{
  const result = await (await fetch('http://localhost:3000')).json();
  console.log('GET', result);
}
