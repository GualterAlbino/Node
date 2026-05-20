import readline from 'readline';
import { spawn } from 'child_process';
import { createReadStream, createWriteStream } from 'fs';

const inputFilePath = './data/users.ndjson';
const outpuFilePath = './data/validate-users.ndjson';

async function processWithPython() {
  const pythonPRocess = spawn('python3');
}
