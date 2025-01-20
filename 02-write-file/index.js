const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome! Enter your text (type "exit" to quit):');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye! Have a great day!');
    rl.close();
    writeStream.end();
    return;
  }
  writeStream.write(input + '\n');
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye! Have a great day!');
  rl.close();
  writeStream.end();
});
