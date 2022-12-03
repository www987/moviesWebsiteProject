const mysql = require('mysql2');
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DATABASE, DB_RepetitionLimit} = require("./config/config");
const{studio_film, studio, film} = require("./databaseData");
const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "moviesBrowser"
});
let queryFilm = "Insert into film (id, title, release_date, numbers_of_actors) VALUES ";

for(let x in film){
    queryFilm += "("
    for(let k in film[x]){
        queryFilm += `"${film[x][k]}",`
    }
    queryFilm = queryFilm.slice(0, -1);
    queryFilm += "),";
}
queryFilm = queryFilm.slice(0, -1);
console.log(queryFilm);


/* con.query(queryFilm, (err,result) =>{
    if(err) throw err;
    items = result;
    console.log(items);
  });
  module.exports = con; */
