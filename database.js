var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../DataBases/System/SystemInfo.db');

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS SystemInfo (module TEXT , mode TEXT)");
    
    var stmt = db.prepare('INSERT INTO SystemInfo VALUES (?, ?)');
    
    stmt.run(['FileFilter' , 'Off']);
    stmt.run(['RegFilter' , 'Off']);
    stmt.run(['NetFilter' , 'Off']);

    stmt.finalize();
    
    db.each("SELECT * FROM SystemInfo", function(err, row) {
        console.log(row.module + ", " + row.mode);
    });
});
 
db.close();