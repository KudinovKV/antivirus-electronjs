var net = require('net');

var PIPE_NAME = "unter_pipe_drivers";
var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;

var L = console.log;

module.exports.Send = function SendData(data) {
    var client = net.connect(PIPE_PATH, function() {
        L('Connect to server');
    });
    L('Data to write : ' + data);
    client.write(data);
    client.push();
    client.end();
    L('Correctly write and end');
}