const express = require("express");
const app = express();
const mysql = require('mysql2');
const https = require('https')
var sql = require("mssql");
const fs = require('fs');
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const { query, Router } = require("express");

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/public', express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'secret',
	cookie: { maxAge: 5000 },
	resave: false,
	saveUninitialized: false

}));

const connection  = mysql.createConnection({
host : "localhost",
user : "root",
password : "password",
port : "3306",
database :  "tridnice",

});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

let roleID;

app.post('/', function(request, response) {
	
	let username = request.body.username;
	let password = request.body.password;
	
	
	if (username && password) {
	    

		connection.query('SELECT username,password,id_role  FROM users WHERE username = ? AND password = ? ' , [username, password], function(error, results) {
			
			if (error) throw error;
			
			if (results.length > 0) {
				
				roleID = results[0].id_role;             
				request.session.loggedin = true;
				request.session.username = username;

				
				
			
		
				response.redirect('/mainPage');
			} else {
				response.redirect('/');
			}			
			response.end();
		});
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.get("/", (req, res) => {
	req.session.loggedin === false
		req.session.username = null;

   
 res.render("index", {stav : 'Log in', name : req.session.username } );
});

app.get("/mainPage", (req, res) => {
  
  if (req.session.loggedin) {
    res.render("mainPage", {stav : 'Log out' , name : req.session.username  , role : roleID});	
	
	} else { 
		
    res.redirect('/');
	}
  
 });



app.listen(200, function(err)  {
console.log("listening on port 200");
});

