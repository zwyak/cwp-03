// server.js
const net = require('net');
const fs = require('fs');
const path = require('path');
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
  client.RequestNumber = 0;

  client.on('data', (data) => {

    client.RequestNumber = client.RequestNumber + 1;

    if ( (data == firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(successReq);
    }else if ( (data != firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(failedReq);
      client.destroy();
    }else{
      console.log(data);

      fs.mkdir(`${client.ID}`, { recursive: true }, (err) => {
          if (err) throw err;

          fs.writeFile(path.join(serverFiles, `${client.ID}`, data), data, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
      });
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
