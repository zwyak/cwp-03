// client.js
const net = require('net');
const fs = require('fs');
const port = 8124;
const firstRequestStr = 'FILES';
const successReq = 'ASC';
const failedReq = 'DEC';

let args = [];

for (var i = 2; i < process.argv.length; i++) {
  args.push(process.argv[i]);
}

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write(firstRequestStr);
});

client.on('data', function(data) {
  console.log(data);

  if (data == firstRequestStr){
  }else{
    client.destroy();
  }
});

client.on('close', function() {
  console.log('Connection closed');
});
