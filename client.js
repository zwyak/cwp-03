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
  client.RequestNumber = 0;
  client.write(firstRequestStr);
});

client.on('data', function(data) {

  client.RequestNumber = client.RequestNumber + 1;

  if ( (data == successReq) && (client.RequestNumber == 1) ){
    console.log(data);
    for (var i = 0; i < args.length; i++) {
      if (fs.existsSync(args[i])){
        fs.readdir(args[i], function(err, list) {
          for (var i = 0; i < list.length; i++) {
            if ( fs.lstatSync(list[i]).isFile() ){
              const buf = Buffer.from(list[i]);
              client.write(buf);
            }
          }
        });
      }
    }
}else if ( (data != successReq) && (client.RequestNumber == 1) ){
    console.log(data);
    client.destroy();
  }
});

client.on('close', function() {
  console.log('Connection closed');
});
