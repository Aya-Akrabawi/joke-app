'use strict'

//Dependencies:
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const pg = require('pg');
const ejs = require('ejs');
const superagent = require('superagent');

//useful express codes
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);


//Routes:
app.get('/',homepage);
app.post('/favorite',addTofav)
app.get('/favorite',renderfav)
app.get('/details/:ids',showDetails)
app.put('/details/:ids',updating)
app.delete('/details/:ids',del)
app.get('/random',randomly);


//functions:
function homepage(req,res){
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`
    superagent.get(url).then(result=>{
        // console.log(result.body);
        res.render('index',{data:result.body})
    })
}
function addTofav(req,res){
    // console.log('req.body',req.body);
    let sql = `INSERT INTO jdwal(id, type, setup, punchline) VALUES($1,$2,$3,$4);`
    let value = [req.body.id, req.body.type, req.body.setup, req.body.punchline]
    client.query(sql,value).then(()=>{
        res.redirect('/favorite')
        // console.log('redirect');
    })
}

function renderfav(req,res){
    let sql = `select *from jdwal`
    client.query(sql).then(result=>{
        console.log('result.rows',result.rows);
        res.render('fav',{data:result.rows})
    })
}

function showDetails(req,res){
    let sql = `select * from jdwal where ids=$1`
    
    let value = [req.params.ids]
    client.query(sql,value).then(result=>{
        // console.log('result.rows',result.rows);
        res.render('det',{data:result.rows[0]})
       
    })
}

function updating(req,res){
    let sql = `UPDATE jdwal SET id=$1, type=$2, setup=$3, punchline=$4 WHERE id=$5;`
    let value = [req.body.id, req.body.type, req.body.setup, req.body.punchline, req.params.ids]
    client.query(sql,value).then(()=>{
        res.redirect(`/details/${req.params.ids}`)
       
    })
}

function del(req,res){
    let sql = `delete from jdwal WHERE id=$1;`
    let value = [req.params.ids]
    client.query(sql,value).then(()=>{
        res.redirect(`/favorite`)
       
    })
}

function randomly(req,res){
    let url = `https://official-joke-api.appspot.com/jokes/programming/random`
    superagent.get(url).then(result=>{
        console.log(result.body);
        result.body.foreach(item=>{
            res.render('rand',{data:item.body})
        })
    })
}

client.connect().then(()=>{
    app.listen(PORT,()=>{
        console.log(`you are listening to port: ${PORT}`);
    })
})
