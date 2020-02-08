var regedit = require('regedit')

// 'Protectedfiles' - Фильтр файловой системы
// 'Protectedregistry' - Фильтр реестра
// 'rules' - Сетевая защита

module.exports.Write = function WriteData(data , modules) {
    
    if (modules == 'rules')
    {
        regedit.putValue({
        'HKLM\\SYSTEM\\CurrentControlSet\\Services\\UnterAV\\': {
            rules: {
                value: data,
                type: 'REG_SZ'
               }
            }
        }, function(err) {
            console.log(err)
        });
    }
    else if (modules == 'Protectedfiles'){
        regedit.putValue({
            'HKLM\\SYSTEM\\CurrentControlSet\\services\\UnterAV\\': {
                Protectedfiles: {
                    value: data,
                    type: 'REG_SZ'
                   }
                }
            }, function(err) {
                console.log(err)
            });
    }
    else if (modules == 'Protectedregistry'){
        regedit.putValue({
            'HKLM\\SYSTEM\\CurrentControlSet\\services\\UnterAV\\': {
                Protectedregistry: {
                    value: data,
                    type: 'REG_SZ'
                   }
                }
            }, function(err) {
                console.log(err)
            });
    }
    else if (modules == 'CurrentVersion'){
        regedit.putValue({
            'HKLM\\SYSTEM\\CurrentControlSet\\services\\UnterAV\\': {
                CurrentVersion: {
                    value: data,
                    type: 'REG_SZ'
                   }
                }
            }, function(err) {
                console.log(err)
            });
    }
    else
        console.log('Error then try to write')
}

module.exports.Read = async function ReadData(modules) 
{
    let p = await new Promise(function(resolve , reject){
        regedit.list(['HKLM\\SYSTEM\\CurrentControlSet\\Services\\UnterAV'] , 
        (err, result) => {
            if (!err)
            {
                resdata = result['HKLM\\SYSTEM\\CurrentControlSet\\Services\\UnterAV'].values[modules].value;
                resolve(resdata);
            }
            else
                reject(err);
        })
    })
    .then(resdata => {
        return resdata;
    })
    .catch(err => {
        console.log('Error : ' , err);
        return null;
    })
    return p;
}