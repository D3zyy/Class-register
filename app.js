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
	cookie: { maxAge: 99990 },
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
	req.session.loggedin = false
		req.session.username = null;

   
 res.render("index", {stav : 'Log in', name : req.session.username } );
});



app.get("/entry", (req, res) => {
	// získejte aktuální čas
	const currentTime = new Date();
  
	// vyberte data o probíhajících předmětech z tabulky subject_times pro aktuálního učitele
	const username = req.session.username;
	const query = `
	SELECT s.jmeno AS subject_name, classes.name as Class, s.id_subject, st.id_subject as subjectID, st.id_class as classID, st.id_user as userID 
	FROM subject_times st
	INNER JOIN subjects s ON st.id_subject = s.id_subject
	inner join classes on st.id_class = classes.id_class
	WHERE st.id_user = (SELECT id_user FROM users WHERE username = ?) AND ? BETWEEN st.start_time AND st.end_time AND st.day = DAYNAME(NOW())
	`;
	const values = [username, currentTime];
	
	connection.query(query, values, (error, results) => {
	  if (error) throw error;
  
	  // pokud jsou výsledky dotazu prázdné, nastavte hodnoty formuláře na "Neučí"
	  let teacherName = "Neučí";
	  let subjectName = "Neučí";
	  let classname= "Neučí";
	  let subjectID = null;
	  let userID = null;
	  let classID = null;
	  let logCount;
	  
  
	  // pokud jsou výsledky dotazu nějaké, použijte první řádek výsledků pro vyplnění formuláře
	  if (results.length > 0) {
		teacherName = req.session.username;
	
		subjectName = results[0].subject_name;	
		classname = results[0].Class
		subjectID = results[0].subjectID;
		userID = results[0].userID;
		classID = results[0].classID;
		
		

	  }
	  const sql = `SELECT COUNT(*) as count FROM entries WHERE id_user = ? AND id_subject = ? AND id_class = ?`;
		const values = [userID, subjectID, classID];
		
		connection.query(sql, values, (error, results) => {
		  if (error) throw error;
		  logCount = results[0].count + 1;  
		console.log(logCount);


		res.render("entry", {teacherName: teacherName,
			subject: subjectName,
			stav : 'Log out' , name : req.session.username  , role : roleID, classNumber : classname,
			taughtHours : logCount
		  });
		});
	  
	  // zobrazte stránku s vyplněným formulářem
	  
	});
  });
  


	
//Main page after successfully loged in 
app.get("/mainPage", (req, res) => {
  
  if (req.session.loggedin) {
    res.render("mainPage", {stav : 'Log out' , name : req.session.username  , role : roleID});	
	
	} else { 
		
    res.redirect('/');
	}
  
 });
 app.get("/blockedAcces", (req, res) => {
	if(req.session.loggedin === true){
		res.render("blockedAcces",{stav : 'Log out' , name : req.session.username  , role : roleID})
	} else{
      res.redirect("/");
	};
	
});
 app.get("/manageClasses", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			session
       res.redirect("blockedAcces");

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


app.listen(200, function(err)  {
console.log("listening on port 200");
});

