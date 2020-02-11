// client.js
const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8124;
const firstRequestStr = 'FILES';
const successReq = 'ASC';
const failedReq = 'DEC';

let args = [];
let currentPath;

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
        currentPath = args[i];
        fs.readdir(args[i], function(err, list) {
          for (var j = 0; j < list.length; j++) {
            if ( path.extname(list[j]) == '.js' ){
              console.log(currentPath + list[j]);
              let sync = fs.createReadStream(path.join(currentPath + list[j]) || defaults.SYNC_FILE);

              sync.on('error', function(e) {
                console.error(e);
              });

              sync.on('open', function() {
                sync.pipe(client);
              });

              sync.on('finish', function() {
                console.log('finish');
              });
            }
          }
        });
      }
    }
  }else if ( (data != successReq) && (client.RequestNumber == 1) ){
    console.log(data);
    client.destroy();
  }else{
    //
  }
});

client.on('close', function() {
  console.log('Connection closed');
});
