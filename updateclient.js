let fs = require('fs');
let http = require('http');
var unzipa = require('unzipper')
var regedit = require('regedit')
const notification = require('node-notifier');
const func_reg = require('modules/../../regestry.js');

var user = 'C:\\Users\\' + require("os").userInfo().username
var antivairusPath = user + "\\Downloads\\UnterAV\\"


var current_version = 0;

regedit.list('HKLM\\SYSTEM\\CurrentControlSet\\Services\\UnterAV', function (err, result) {
    current_version = result["HKLM\\SYSTEM\\CurrentControlSet\\Services\\UnterAV"]["values"]["CurrentVersion"]['value']

    var options = {
        host: '192.168.131.129',
        port: 8091,
        method: 'GET',
    };

    options.path = '/version'

    var request = http.get(options, function (response) {
        var actual_version = response.headers['version'];

        console.log('actual_version' , actual_version);
        console.log('current_version' , current_version);

        if (actual_version > current_version) {

            if (!fs.existsSync(antivairusPath)) {
                fs.mkdirSync(antivairusPath);
            }

            notification.notify({
                title: 'UnterAV',
                message: 'Start updating , current version : ' + current_version
            });

            var filepath = antivairusPath + "UnterAV.zip"
            var file = fs.createWriteStream(filepath);
            options.path = '/update';

            console.log('Start download');

            var request = http.get(options, function (response) {
                response.pipe(file);

                file.on('finish', () => {
                    console.log("Finish load...."); 
                    
                    file.close();

                    fs.createReadStream(filepath).pipe(unzipa.Extract({ path: 'C:\\UnterAV\\'}))
                    .on('close', function() {

                        func_reg.Write(actual_version, 'CurrentVersion');

                        notification.notify({
                            title: 'UnterAV',
                            message: 'UnterAV become more uber , current version : ' + actual_version
                        });
                    }
                    );
                });

            })
            
            .on('error', function (err) {
                console.log("Download file error ", err);
            });

        } 
        else {
            notification.notify({
                title: 'UnterAV',
                message: 'UnterAV already using uber version : ' + actual_version
            });
        }
    })
    .on('error', function (err) {
        console.log("GET reqiest error", err);
    });
})
