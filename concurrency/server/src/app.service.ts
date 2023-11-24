import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Worker } from 'node:worker_threads';
// import { fork } from 'child_process';

@Injectable()
export class AppService {
  async getHello() {
    const value = await delay(1);
    console.log((value as Array<any>).length);
    return 'Hello world!';
  }
}

// worker_threads;
async function delay(ms: number) {
  return new Promise((resolve, reject) => {
    console.log('in main');
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));
    worker.postMessage(ms);
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

// child_process
// async function delay(ms: number) {
//   return new Promise((resolve, reject) => {
//     console.log('main process');
//     const child_process = fork(path.resolve(__dirname, 'child_process.js'));
//     child_process.on('message', resolve);
//     child_process.on('error', reject);
//     child_process.on('exit', (code) => {
//       if (code !== 0)
//         reject(new Error(`Worker stopped with exit code ${code}`));
//     });
//     child_process.send(ms);
//   });
// }

// normal
// async function delay(ms: number) {
//   return new Promise((resolve) => {
//     const arr = [];
//     for (let i = 0; i < ms * 150; i++) {
//       for (let j = 0; j < ms * 150; j++) {
//         arr.push(i, j);
//         arr.sort((a, b) => a - b);
//       }
//     }
//     resolve(arr);
//   });
// }
