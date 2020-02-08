const net = require('net');
const notification = require('node-notifier');
const initpage = require('modules/../../initpage.js');
const func_notify = require('modules/../../notification.js');
const logs = require('modules/../../log.js');

var L = console.log;

// СТАТИЧЕСКИЙ АНАЛИЗ
// WIN API
// СЕТЕВОЙ
// ДИНАМИЧЕСКИЙ АНАЛИЗ

module.exports.StartServer = function StartServer(PIPE_NAME){
    
    var PIPE_PATH = "\\\\.\\pipe\\" + PIPE_NAME;

    var server = net.createServer(function(stream) {
        L(PIPE_NAME + ' : on connection');

        stream.on('data', function(c) {
            notification_data = c.toString();
            L(PIPE_NAME + ' get data:', notification_data , '\n');
            var message = notification_data.split('(^_^)');
            for(let i = 0 ; i < message.length ; i++){
                if(message[i].includes('event.')){
                    L('event');
                    let notify_body = message[i].replace('event.' , '');
                    notification.notify({
                        title: 'UnterAV',
                        message: notify_body
                    });
                    logs.LogWriteDb(PIPE_NAME, notify_body);
                }
                else if(message[i].includes('log.')){
                    L('log');
                    logs.LogWriteDb(PIPE_NAME, message[i].replace('log.' , ''));
                }
                else if(message[i].includes('file(+).')){
                    L('clear file');
                    logs.LogWriteDb(PIPE_NAME, message[i].replace('file(+).' , ''));
                }
                else if(message[i].includes('file(-).')){
                    L('malware file');
                    // TODO : do smth
                    logs.LogWriteDb(PIPE_NAME, message[i].replace('file(-).' , ''));
                }
                else if(message[i].includes('net')){
                    L('\nnetwork alert\n');
                    var rules = message[i].replace('net' , '').split('|');
                    var notif_text = "";
                    var block_rules = rules[0] , alert_rules = rules[1];
                    L('BLOCK : [' , block_rules , ']');
                    L('ALERT : [' , alert_rules , ']');
                    for (let i = 0 ; i < block_rules.length ; i++)
                    {
                        notif_text += 'Сработало блокирующее правило номер ' + block_rules[i] + '!';
                    }
                    if (notif_text.length != 0)
                    {
                        notification.notify({
                            title: 'UnterAV',
                            message: notif_text
                        });
                        logs.LogWriteDb(PIPE_NAME, notif_text);                        
                    }
                    notif_text = "";
                    for (let i = 0 ; i < alert_rules.length ; i++)
                    {
                        notif_text += 'Сработало правило номер ' + alert_rules[i] + '!';
                    }
                    if (notif_text.length != 0)
                    {
                        notification.notify({
                            title: 'UnterAV',
                            message: notif_text
                        });
                        logs.LogWriteDb(PIPE_NAME, notif_text);
                    }
                }
                else if(message[i].includes('flt')){
                    L('file or reg alert');
                    var rules = message[i].replace('flt' , '');
                    if (rules[0] == '1')
                    {
                        // file
                        let notif_text = 'Сработало ' + rules[1] + ' правило системы файловой фильтрации !';
                        notification.notify({
                            title: 'UnterAV',
                            message: notif_text
                        });
                        logs.LogWriteDb(PIPE_NAME, notif_text);
                    }
                    else if (rules[0] == '2')
                    {
                        // reg
                        let notif_text = 'Сработало ' + rules[1] + ' правило системы фильтрации реестра !';
                        notification.notify({
                            title: 'UnterAV',
                            message: notif_text
                        });
                        logs.LogWriteDb(PIPE_NAME, notif_text);
                    }
                }
            }            
        });
    });

    server.listen(PIPE_PATH,function(){
        L(PIPE_NAME + ' : on listening');
    })
}