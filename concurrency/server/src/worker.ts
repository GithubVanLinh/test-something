import { parentPort } from 'node:worker_threads';

export class SharedPoint {
  dataview: DataView;

  constructor(array) {
    this.dataview = new DataView(array);
  }

  set x(value) {
    this.dataview.setUint8(0, value);
  }

  set y(value) {
    this.dataview.setUint8(1, value);
  }

  get x() {
    return this.dataview.getUint8(0);
  }

  get y() {
    return this.dataview.getUint8(1);
  }
}

parentPort.on('message', (ms) => {
  const buffer = new SharedArrayBuffer(2);
  const point = new SharedPoint(buffer);
  point.x = point.x + 1;
  point.y = point.y + 1;
  console.log('in worker', point);
  const arr = [];
  for (let i = 0; i < ms * 150; i++) {
    for (let j = 0; j < ms * 150; j++) {
      arr.push(i, j);
      arr.sort((a, b) => a - b);
    }
  }
  parentPort.postMessage(arr);
});
