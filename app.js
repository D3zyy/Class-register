//Declaring essentials
const express = require("express");
const app = express();
const mysql = require('mysql2');
const https = require('https')
var sql = require("mssql");
const fs = require('fs');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const { query, Router } = require("express");
const teacher = require("./routes/teacher");
global.roleID = 2;

//Use a set
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/public', express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'secret',
	cookie: { maxAge: 99999999},
	resave: true,
	saveUninitialized: true

}));

//routes
app.use("/teacher", teacher,);

//Connect to database
const connection  = mysql.createConnection({
host : "sql7.freesqldatabase.com",
user : "sql7596793",
password : "1NbVuH4GIa",
port : "3306",
database :  "sql7596793",

});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});



app.post('/', function(request, response, next) {
	
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
		
		});
		
	} else {
		response.send('Please enter Username and Password!');

	}
	
});


  
app.get("/", (req, res) => {
	req.session.loggedin = false
		req.session.username = null;

   
 res.render("index", {stav : 'Log in', name : req.session.username } );
});




  



	
//Main page after successfully loged in 
app.get("/mainPage", (req, res) => {
  
  if (req.session.loggedin) {
    res.render("mainPage", {stav : 'Log out' , name : req.session.username  , role : roleID});	
	
	} else { 
		
    res.redirect('/');
	}
  
 });
 app.get("/blockedAccess", (req, res) => {
	if(req.session.loggedin === true){
		res.render("blockedAccess",{stav : 'Log out' , name : req.session.username  , role : roleID})
	} else{
      res.redirect("/");
	};
	
});
 app.get("/manageClasses", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			
       res.redirect("blockedAccess");

		};
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_role = 2', (error, results) => {
			if (error) throw error;
		
			// store the results in an array
			const users = results;
		
			// render the HTML template and pass the array to the template
			res.render("manageClasses", {stav : 'Log out' , name : req.session.username  , role : roleID,users: users});
		  });


		


	  } else { 
		  
	  res.redirect('/');
	  }
	
   });

   app.listen(process.env.PORT ||200, function () {
    console.log('listening');
  });


