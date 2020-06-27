var vcapServices = require('vcap_services');
var express = require('express');  
var bodyParser = require('body-parser'); 
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient;
var app = express();  
const path = require('path')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

let url;
var credentials = vcapServices.getCredentials('mlab');
url=credentials.uri;

if (url==null){
  url="mongodb://mongo:27017/mynewdb";}

// Connect to the db 

MongoClient.connect(url, function(err, db) {
 if(!err) {
    console.log("Connected to Ebay Database");

app.use(express.static('public')); //making public directory as static directory  
app.use(bodyParser.json());

app.get('/', function (req, res) {  
   console.log("Got a GET request for homepage");  
   res.send('<h1>HelloWorld!</h1>');  
})
/*JS client side files has to be placed under a folder by name 'public' */

app.get('/index.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "index.html" );    
})  

app.get('/insert.html', function (req, res) {
    res.sendFile( __dirname + "/" + "insert.html" );
})

//-------------------------Login--------------------------------------//

app.get("/authenticate", function(req, res) {
 
  var username = req.query.usr;
  var password = req.query.pwd;
 
    if((username == "Ebay123")&&(password == "welcome123")) {
      res.sendFile(path.join(__dirname, 'public','home.html'));
    } 
    else {
      res.sendFile(path.join(__dirname, 'public','index.html'));
    }
  }); 

/* to access the posted data from client using request body (POST) or request params(GET) */
//-----------------------POST METHOD-------------------------------------------------
app.post('/process_post', function (req, res) {
    /* Handling the AngularJS post request*/
    console.log(req.body);
  res.setHeader('Content-Type', 'text/html');
    /*response has to be in the form of a JSON*/
    req.body.serverMessage = "NodeJS replying to angular"
        /*adding a new field to send it to the angular Client */
    //console.log("Sent data are (POST):usn :"+req.body.usn+"  name="+req.body.name+"cgpa:"+req.body.cgpa+"12th per"+req.body.per+"backlog"+req.body.bck+"semester"+req.body.sem+"extra curicular"+req.body.exc);
    // Submit to the DB
    var Eno = parseInt(req.body.Eno);
    var Ename = req.body.Ename;
    var loc = req.body.loc;
    
  db.collection('Event').insert({Eno:Eno,Ename:Ename,loc:loc});
    res.end("Item Inserted-->"+JSON.stringify(req.body));
    /*Sending the respone back to the angular Client */
});

//--------------------------GET METHOD-------------------------------
app.get('/process_get', function (req, res) { 
// Submit to the DB
var Eno = parseInt(req.body.Eno);
var Ename = req.body.Ename;
var loc = req.body.loc;
  db.collection('Event').insertOne({Eno:Eno,Ename:Ename,loc:loc,time:time});
    console.log("Sent data are (GET): Item no :"+Eno+" Item name :"+Ename+"Location"+loc);
    res.end("Item Inserted-->"+JSON.stringify(req.body));
}) 

//--------------UPDATE------------------------------------------
app.get('/update.html', function (req, res) {
    res.sendFile( __dirname + "/" + "update.html" );
})

app.get("/update", function(req, res) {
  var name1=req.query.name;
 
  //-----------------------------------------
  db.collection('Event', function (err, data) {
        data.update({"Eno":Eno},{$set:{"Eno":"newEno"}},{multi:true},
            function(err, result){
        if (err) {
          console.log("Failed to update data.");
      } else {
        res.send(result);
        console.log("Item Updated")
      }
        });
    });
})  
//...............search........................................................
app.get('/search.html', function (req, res) {  
   res.sendFile( __dirname + "/" + "search.html" );    
})

app.get("/search", function(req, res) {
  
  var usnnum=parseInt(req.query.usn);
    db.collection('Item').find({Eno:Eno}).toArray(function(err, docs) {
    if (err) {
      console.log(err.message+ "Failed to get data.");
    } else {
      res.status(200).json(docs);
    }
  });
  });
  app.get("/search", function(req, res) {

    var bcknum=parseInt(req.query.bck);
      db.collection('Event').find({Ename:Ename}).toArray(function(err, docs) {
      if (err) {
        console.log(err.message+ "Failed to get data.");
      } else {
        res.status(200).json(docs);
      }
    });
    });
   
    

//--------------DELETE------------------------------------------
app.get('/delete.html', function (req, res) {  
  res.sendFile( __dirname + "/" + "delete.html" );    
})

app.get("/delete", function(req, res) {

 var Eno = parseInt(req.query.Eno);
 db.collection('Event', function (err, data) {
       data.remove({"Eno" : Eno}, function(err, result){
       if (err) {
         console.log("Failed to remove data.");
     } else {
       res.send(result);
       console.log("Item Deleted from cart -> "+Eno)
     }
       });
   });
   
 });
app.get('/display', function (req, res) { 
//-----DISPLAY IN JSON FORMAT  -------------------------
/*db.collection('student').find({}).toArray(function(err, docs) {
    if (err) {
      console.log("Failed to get data.");
    } else 
  {
    res.status(200).json(docs);
    }
  });*/
//-------------DISPLAY USING EMBEDDED JS -----------
 db.collection('Event').find().sort({Eno:1}).toArray(
    function(err , i){
        if (err) return console.log(err)
        res.render('disp.ejs',{Event: i})  
     })
//---------------------// sort({empid:-1}) for descending order -----------//
}) 
app.get('/help', function (req, res) {  
   console.log("Got a GET request for /help");  
   res.send('Ebay can help you find items on literally anything you wish for!');  
})  
 
var server = app.listen(8080, function () {    
var port = server.address().port  
console.log("listening on http://localhost:%s/", port)  
})  
}
else
{   db.close();  }
  
});
 