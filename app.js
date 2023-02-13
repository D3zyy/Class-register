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
	host : "sql8.freemysqlhosting.net",
	user : "sql8597540",
	password : "JUmqiUcLHW",
	port : "3306",
	database :  "sql8597540",

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
		

	}
	
});


  
app.get("/", (req, res) => {
	    req.session.loggedin = false
		req.session.username = null;

   
 res.render("index", {stav : 'Log in', name : req.session.username } );
});




  



	let userID;
	let hasClass;
//Main page after successfully loged in 
app.get("/mainPage", (req, res) => {
	
	   
  if (req.session.loggedin) {
	connection.query('SELECT id_user,id_class from users where username = ? ' ,req.session.username,(error, results) =>{
         
		userID = results[0].id_user;
		hasClass = results[0].id_class;
		console.log(results[0].id_class);
    res.render("mainPage", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass});	
});
	} else { 
		
    res.redirect('/');
	}
    
 });
 app.get("/blockedAccess", (req, res) => {
	if(req.session.loggedin === true){
		res.render("blockedAccess",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})
	} else{
      res.redirect("/");
	};
	
});
app.get("/user/:id_user", (req, res) => {
		 


	if(req.session.loggedin === true && req.params.id_user == userID || req.session.loggedin === true && roleID === 3 ){
		
		connection.query('SELECT users.username as username, users.firstName as firstName,users.lastName as lastName, classes.name as className,roles.name as role from users inner join roles on users.id_role = roles.id_role inner join classes on users.id_class = classes.id_class  where users.id_user = ? ' ,req.params.id_user,(error, results) =>{
	  if(results.length > 0) {

	
			firstName = results[0].firstName;
			lastName = results[0].lastName;
			className = results[0].className;
			username = results[0].username;
			roleName = results[0].role;

			connection.query(' SELECT id_role from users where id_user = ?' ,req.params.id_user,(error, results) =>{
                
				
				res.render("userProfile",{roleColor : results[0].id_role,roleName : roleName,username : username,user_id : userID,specificUserID : req.params.id_user,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,firstName : firstName,lastName : lastName,className : className,class_id : hasClass})

			});

		
	}
	});
	
	} else if(req.params.id_user != userID){
		res.redirect('/blockedAccess');
		
	}
	 else{
      res.redirect("/");
	
	};


});

app.get("/user/changePassword/:id_user", (req, res) => {

	res.render("changePassword",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass});

});

app.post("/user/changePassword/:id_user", (req, res) => {
	idd = req.params.id_user;
	password = req.body.password;

	connection.query('UPDATE users set password = ? where id_user = ? ' ,[password, idd],(error, results) => {
		console.log(password);
		console.log(idd);
		
		
		res.render("success", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID, text : 'Password was succcessfully updated!',class_id : hasClass});	
	req.session.loggedin = false;
	});
});

 app.get("/manageClasses", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			
			res.render("blockedAccess",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})

		} else {

		
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_role = 2', (error, results) => {
			if (error) throw error;
		
			// store the results in an array
			const users = results;
		
			// render the HTML template and pass the array to the template
			res.render("manageClasses", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users,class_id : hasClass});
		  });


		}


	  } else { 
		  
	  res.redirect('/');
	  }
	
   });

   app.listen(process.env.PORT ||200, function () {
    console.log('listening');
  });


