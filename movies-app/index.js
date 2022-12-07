// Server configurations
const express = require("express");
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const con = require("./mysql")


con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database!");
});


app.use(express.static('/movies-app/'));
app.engine('hbs', hbs.engine({
  helpers: {
    removeDate: function (options) {
      let string = options.fn(this);
      let dateString = new Date(string);
      if (!isNaN(dateString.getFullYear())) {
        dateString = dateString.toLocaleDateString("en-CA", {
          day: "2-digit",
          year: "numeric",
          month: "2-digit",
        }).replace(/\//g, '-').replace(/,/, '');
        return dateString;
      }
      return "-";
    }
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
  res.render('index', {
  });
});

app.get('/lista_wytworni_filmowych.html', (req, res) => {
  let query = "SELECT * FROM studio";
  let items = [];
  con.query(query, (err, result) => {
    if (err) throw err;
    items = result;
    res.render('studio_list', {
      items: items
    });
    // render hast to be in this block because it is asynchronus
  });
});
app.get('/lista_filmow.html', (req, res) => {
  let query = "SELECT * FROM film";
  let items = []; 
  con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    //console.log(items);
    res.render('movies_list', {
      items: items
    });
  });
});
app.get('/wyszukiwarka_filmow.html/options', (req, res) => {
  let query = "SELECT name, id FROM studio";
  let items = []; 
  con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    res.send(items)
    //console.log(items);
  });
});
var mainID;
app.post('/wyszukiwarka_filmow.html/connection', (req, res) => {
  mainID = req.body.ID
});

app.get('/wyszukiwarka_filmow.html/connection', (req, res) => {
  let query = `SELECT studio_id, film_id, main_studio, displayed_from, displayed_to, id FROM studio_film WHERE id='${mainID}'`;
  con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    res.send(items)
    //console.log(items);
  });
});
app.get('/wyszukiwarka_filmow.html', (req, res) => {
  console.log(req.query, "wyszukiwarka_filmow.html get res.query");
  let query = `SELECT s.name, sf.id, f.title,sf.main_studio, f.release_date FROM studio_film sf INNER JOIN film f ON f.id = sf.film_id INNER JOIN studio s ON s.id = sf.studio_id WHERE s.id = '${req.query.studio_choose}'`;
  let items = []; 
  con.query(query, (err,result) =>{
    if(err) throw err;
    items = result;
    res.render('movies_search', {
      movies:items
    });
  });
});
app.post('/lista_wytworni_filmowych.html', (req, res) => {
  console.log(req.body);
  console.log(req.body.studio_name_v);
  let sql = `DELETE from studio WHERE id= ${req.body.ID}`;
  
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/lista_wytworni_filmowych.html');
  }) 
})
app.post('/wyszukiwarka_filmow.html/edit', (req, res) => {
  if(req.body.main_studio_v == "on"){
    req.body.main_studio_v = 1;
  }
  else{
    req.body.main_studio_v = 0;
  }
  let sql = `UPDATE studio_film SET studio_id='${req.body.id_wf_p_v}', film_id='${req.body.id_f_p_v}', main_studio='${req.body.main_studio_v}', displayed_from='${req.body.displayed_from_v}', displayed_to='${req.body.displayed_to_v}' WHERE ID ='${req.body.id_name_v}'`;
  
  con.query(sql, (err, result) => {
    if (err){
      res.redirect('/wyszukiwarka_filmow.html#modal_8');
      console.log("ERROR UPDATE studio MYSQL", err);
    }
    else{
      res.redirect('/wyszukiwarka_filmow.html#modal_9');
    }
  })
})
app.post('/lista_wytworni_filmowych.html/edit', (req, res) => {
  console.log(req.body);
  console.log(req.body.studio_name_v);
  console.log("test","a"+req.body.studio_closed_v+"s", typeof req.body.studio_closed_v)
  if(typeof req.body.studio_closed_v === 'string'){
    if(req.body.studio_closed_v.length == 0)
      req.body.studio_closed_v = null;
    else
      req.body.studio_closed_v = `'${req.body.studio_closed_v}'`
  }
  else{
    req.body.studio_closed_v = `'${req.body.studio_closed_v}'`
  }
  let sql = `UPDATE studio SET name='${req.body.studio_name_v}', address ='${req.body.studio_address_v}', founded='${req.body.studio_founded_v}', closed=${req.body.studio_closed_v} WHERE ID ='${req.body.id_name_v}'`;
  
  con.query(sql, (err, result) => {
    if (err){
      res.redirect('/lista_wytworni_filmowych.html#modal_8');
      console.log("ERROR UPDATE studio MYSQL", err);
    }
    else{
      res.redirect('/lista_wytworni_filmowych.html#modal_7');
    }
  })
})
app.post('/lista_wytworni_filmowych.html/add', (req, res) => {
  console.log(req.body);
  console.log(req.body.studio_name_v);
  if(typeof req.body.studio_closed === 'string'){
    if(req.body.studio_closed.length == 0)
    req.body.studio_closed = null;
    else
    req.body.studio_closed = `'${req.body.studio_closed}'`
  }
  else{
    req.body.studio_closed = `'${req.body.studio_closed}'`
  }
  let sql = `INSERT INTO studio (name,address,founded,closed) VALUES ('${req.body.studio_name}', '${req.body.studio_address}','${req.body.studio_founded}',${req.body.studio_closed})`;
  
  con.query(sql, (err, result) => {
    if (err){
      res.redirect('/lista_wytworni_filmowych.html#modal_8');
      console.log("ERROR INSERT studio MYSQL", err);
    }
    else{
      res.redirect('/lista_wytworni_filmowych.html#modal_6');
    }
  })
})
app.post('/lista_filmow.html/edit', (req, res) => {
  //console.log(req.body, "TEST");
  console.log("TEST123");
  let sql = `UPDATE film SET title='${req.body.film_name_v}',release_date='${req.body.release_date_v}', numbers_of_actors=${req.body.actors_number_v} WHERE ID ='${req.body.id_name_v}'`;
  
  con.query(sql, (err, result) => {
    if (err){
      res.redirect('/lista_filmow.html#modal_8');
      console.log("ERROR UPDATE movies MYSQL", err);
    }
    else{
      res.redirect('/lista_filmow.html#modal_7');
      console.log("ALA123");
      console.log(result);
    }
  })
  console.log("ALAAAA");
})
app.post('/lista_filmow', (req, res) => {
  let sql = `DELETE from film WHERE id= ${req.body.ID}`;
  
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/lista_wytworni_filmowych.html');
  }) 
})
app.post('/wyszukiwarka_filmow.html/delete', (req, res) => {
  let sql = `DELETE from studio_film WHERE id= ${req.body.ID}`;
  
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/wyszukiwarka_filmow.html');
  }) 
})
app.post('/lista_filmow.html/add', (req, res) => {
  let sql = `INSERT INTO film (title,release_date,numbers_of_actors) VALUES ('${req.body.film_name}', '${req.body.release_date}','${req.body.actors_number}')`;
  
  con.query(sql, (err, result) => {
    if (err){
      res.redirect('/lista_filmow.html#modal_8');
      console.log("ERROR INSERT film MYSQL", err);
    }
    else{
      res.redirect('/lista_filmow.html#modal_6');
    }
  })
})
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));