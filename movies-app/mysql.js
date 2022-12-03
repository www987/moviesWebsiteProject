const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DATABASE, DB_RepetitionLimit} = require("./config/config");
const{studio_film, studio, film} = require("/databaseData");
const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "moviesBrowser"
});
module.exports = con;
