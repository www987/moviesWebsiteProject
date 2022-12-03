// Server configurations
const express = require("express");
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const con = require("./mysql")


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});
let query


app.use(express.static('/movies-app/'));
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
  /* let query = "SELECT * FROM film";
  let items = []; */
  /* con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    console.log(items);
    
  }); */
  res.render('index', {
    items: []
  });
}); 

app.get('/lista_wytworni_filmowych.html', (req, res) => {
  /* let query = "SELECT * FROM film";
  let items = []; */
  /* con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    console.log(items);
    
  }); */
  res.render('movies_search.hbs', {
    
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



const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`listening on port ${port}`));