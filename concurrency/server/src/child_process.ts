process.on('message', (ms: number) => {
  console.log('in child process');
  const arr = [];
  for (let i = 0; i < ms * 150; i++) {
    for (let j = 0; j < ms * 150; j++) {
      arr.push(i, j);
      arr.sort((a, b) => a - b);
    }
  }
  process.send(arr);
});
