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
let queryStudio = "Insert into studio (id, name, address, founded, closed) VALUES ";
let queryStudioFilm = "Insert into studio_film (studio_id, film_id, main_studio, displayed_from, displayed_to) VALUES ";
let queryCreateFilm = "CREATE TABLE film (id int(11) NOT NULL, title varchar(100) COLLATE utf8mb4_polish_ci NOT NULL,release_date date NOT NULL,numbers_of_actors int(11) NOT NULL)";
let queryCreateStudio = "CREATE TABLE `studio` (`id` int(11) NOT NULL,`name` varchar(100) COLLATE utf8mb4_polish_ci NOT NULL,`address` varchar(150) COLLATE utf8mb4_polish_ci NOT NULL,`founded` date NOT NULL,`closed` date DEFAULT NULL);";
let queryCreateStudioFilm = "CREATE TABLE `studio_film` (`studio_id` int(11) NOT NULL,`film_id` int(11) NOT NULL,`main_studio` tinyint(1) DEFAULT NULL,`displayed_from` date NOT NULL,`displayed_to` date DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;";

function createQuery(query, data){
    for(let x in data){
        query += "("
        for(let k in data[x]){
            if(typeof data[x][k] === "object"){
                query += `${null},`
            }
            else{
                query += `"${data[x][k]}",`
            }  
        }
        query= query.slice(0, -1);
        query += "),";
    }
    query = query.slice(0, -1);
    return query;
}
/* queryFilm = createQuery(queryStudio, studio)
console.log(queryFilm);  */
/* queryStudio = createQuery(queryStudio, studio);
console.log(queryStudio); */
/* queryStudioFilm = createQuery(queryStudioFilm, studio_film);
console.log(queryStudioFilm); */
function sendQuery(query){
    con.query(query, (err,result) =>{
        if(err) throw err;
        items = result;
        return items;
      });
}
// sendQuery(queryFilm)
// sendQuery(queryStudio)
// sendQuery(queryStudioFilm)
//sendQuery(queryCreateFilm)
//sendQuery(queryCreateStudio)
//sendQuery(queryCreateStudioFilm)
  module.exports = con; 
