const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

module.exports.LogWrite = function WriteInFile(data){
    var datetime = new Date();
    // Windows and FreeBSD
    fs.open('C:\\UnterAV\\Logs\\CloudSystem.txt', 'a', (err, fd) => {
        fs.writeFile(fd, '[ ' + datetime + ' ] ' + data + '\n', 'utf-8' , (err) => {
            if (err) {
                console.log(err);
            }
            fs.close(fd, function() {
                console.log("The logfile has been succesfully saved");
            }) 
        });
    });
}

// CloudSystem 
// FileSystem
// RegSystem
// NetSystem

module.exports.LogWriteDb = function WriteInDatabase(submodule, eventtext){
    var db = new sqlite3.Database('../DataBases/System/Events.db');
    
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS Events (data TEXT  , submodule TEXT , eventtext TEXT)");

        var datetime = new Date();
        var stmt = db.prepare('INSERT INTO Events VALUES (?, ?, ?)');

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' , hour: 'numeric' , minute: 'numeric' , second:'numeric' };

        stmt.run([datetime.toLocaleDateString('en-EN' , options), submodule, eventtext]);
        stmt.finalize();
        
        //db.each('SELECT * FROM Events', function(err, row) {
        //    console.log('\n\n=================================================================\n\n');
        //   console.log(row);
        //});

    });
   
    db.close();
}