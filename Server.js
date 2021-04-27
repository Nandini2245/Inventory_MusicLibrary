const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/MusicLibrary', (err, database)=>{
    if(err) return console.log(err);
    db= database.db('MusicLibrary')
    app.listen(5000,()=>{
        console.log('Listening at port number 5000')
    })
})

app.set('view engine', 'ejs')
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('public'))

//Home page
app.get('/', (req, res)=>{
    db.collection('music').find().toArray((err,result)=>{
        res.render('home.ejs',{data:result})
    })
})
//add product

app.get('/create', (req,res)=>{
    db.collection('music').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('add.ejs',{data: result})
    })
})
//update page

app.get('/updaterecord', (req,res)=>{
    db.collection('music').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('update.ejs',{data: result})
    })
})

//delete record page

app.get('/deleterecord', (req,res)=>{
    db.collection('music').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('delete.ejs',{data: result})
    })
})

//add new product to collection

app.post('/AddData',(req,res)=>{
    db.collection('music').save(req.body,(err,result)=>{
        if(err) return console.log(err);

        console.log('New Record added')
        res.redirect('/');
    })
})

//update the stock
app.post('/update',(req,res) => {

    db.collection('music').find().toArray((err,result) => {
    if(err)
    return console.log(err)
    for(var i=0;i<result.length;i++)
    {
    if(result[i].aid==req.body.id)
    {
    s=result[i].no_songs
    break
    }
    }
    db.collection('music').findOneAndUpdate({aid:req.body.id},{
       $set: {no_songs: parseInt(s) + parseInt(req.body.no_songs)}}, {sort: {_id:-1}},
    (err,result) => {
    if(err)
    return res.send(err)
    console.log(req.body.id+' record updated')
    res.redirect('/')
    })
    })
    })
    
    //delete the stock
    app.post('/delete',(req,res) => {
    db.collection('music').findOneAndDelete({aid:req.body.id}, (err,result)=>{
    if(err)
    return console.log(err)
    res.redirect('/')
    })
    })











