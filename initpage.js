var sqlite3 = require('sqlite3').verbose();

module.exports.ReadSettings = async function ReadSettings(mymodule){
    var mode = '';
    var db = new sqlite3.Database('../DataBases/System/SystemInfo.db');
    var p = await new Promise(function(resolve , reject){
        db.serialize(function() {
            var stmt = db.prepare('SELECT * FROM SystemInfo WHERE SystemInfo.module = (?)');
    
            stmt.each([mymodule], function(err, row) {
                if (err)
                    reject(err);    
                console.log(row.module + ", " + row.mode);
                stmt.finalize();
                resolve(row.mode);
            });
        });
    })
    .then(resdata => {
        db.close();
        console.log('Return value: ' , resdata);
        return resdata;
    })
    .catch(err => {
        console.log('Error: ' , err);
        db.close();
        return 'Off';
    })
    return p;
}


module.exports.WriteSettings = function WriteSettings(mymodule , mode){
    var db = new sqlite3.Database('../DataBases/System/SystemInfo.db');

    var stmt = db.prepare('UPDATE OR REPLACE SystemInfo SET mode = (?) WHERE module = (?)');
    
    stmt.run([mode, mymodule]);

    stmt.finalize();

    db.close();
}