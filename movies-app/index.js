// Server configurations
const express = require("express");
const mysql = require('mysql2');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_DATABASE, DB_RepetitionLimit} = require("./config/config");


app.use(express.static('public'));
app.engine('hbs', hbs.engine({
  helpers: {
    isCompleted: function (status) {
        if (status == "completed") {
            return true
        } else {
            return false
        }
    },
  },
  layoutsDir: __dirname + '/views/layouts',
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  let query = "SELECT * FROM film";
  let items = [];
  con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    console.log(items);
    res.render('index', {
      items: items
    });
  });
});
app.post('/', (req, res) => {
  console.log(req.body);
  let data = [
    [req.body.task, "2020-10-10", 12]
  ];
  let sql = "INSERT INTO film (title, release_date, numbers_of_actors) VALUES ?";
  res.redirect('/');
  con.query(sql, [data], (err,result) => {
    if(err) throw err;
    console.log(result);
  })
})
const con = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "moviesBrowser"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
  });


const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`listening on port ${port}`));