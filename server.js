// server.js
const net = require('net');
const fs = require('fs');
const port = 8124;
const firstRequestStr = 'FILES';
const successReq = 'ASC';
const failedReq = 'DEC';
const serverFiles = './server_files'

let seed = 3106;

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');
  client.ID = Date.now() + seed++;

  client.on('data', (data) => {
    console.log(data);

    if (data == firstRequestStr){
      client.write(successReq);
    }else{
      client.write(failedReq);
      client.destroy();
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
