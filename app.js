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
const { log } = require("console");
global.roleID = 1;

//Use a set
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use('/public', express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'secret',
	cookie: { maxAge: 500000},
	resave: false,
	saveUninitialized: false

}));

//routes
app.use("/teacher", teacher,);

//Connect to database
const connection  = mysql.createConnection({
	host : "sql.freedb.tech",
    user : "freedb_dezyy",
    password : "hz5@&u%3&2DYZN#",
    port : "3306",
    database :  "freedb_Tridnice",

});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Připojeno k databázi!");
});


//Admin
app.post("/smazatUzivatele", (req, res) => {
	console.log(req.body.id_user);
	if(req.session.loggedin === true && roleID === 3){
		connection.query('SELECT roles.name  FROM users inner join roles on users.id_role = roles.id_role  WHERE id_user = ? ' , [req.body.id_user], function(error, results) {
           if(results[0].name === 'admin'){
          res.redirect('/');
		   } else {

			connection.query('DELETE FROM absence WHERE id_user = ? ' , [req.body.id_user], function(error, results) {
      
	  connection.query('DELETE FROM entries WHERE id_user = ? ' , [req.body.id_user], function(error, results) {
		
		connection.query('DELETE FROM subject_times WHERE id_user = ? ' , [req.body.id_user], function(error, results) {
		
			connection.query('DELETE FROM users WHERE id_user = ? ' , [req.body.id_user], function(error, results) {
				
				res.send();
					  });
				  });
			  });
			});
		}



		});




	} else{
      res.redirect("/");
	};




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
		response.redirect('/');

	}
	
});

app.get("/download-student", (req, res) => {

	if(req.session.loggedin === true){
		res.render("downloadStudent", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	
	} else{
      res.redirect("/");
	};

	
	

});

app.get("/import", (req, res) => {

	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1 || roleID === 2){
				
		   res.redirect('/blockedAccess');
		
			} else {


				res.render("import", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass});	




				
			}

	
	

});


app.post("/download-student", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			}  else {
				
				if(idUSER != user_id){
					res.redirect('/');
				} else{
					connection.query('SELECT id_user from users where username = ? ', req.session.username,(error, results) =>{
						idUSER = results[0].id_user;
				
	connection.query(
	  `SELECT entries.datum , classes.name as Třída, subjects.jmeno as Předmět, entries.topic as Téma, entries.notes as Poznámky, entries.lessonNumber as ČísloHodinyVRoce, 
			 users.firstName as Jméno, users.lastName as Příjmení , absence.duvod, absence.omluveno
	  FROM entries
	  INNER JOIN classes ON entries.id_class = classes.id_class 
	  INNER JOIN subjects ON entries.id_subject = subjects.id_subject 
	  INNER JOIN absence ON absence.id_entry = entries.id_entry 
	  INNER JOIN users ON absence.id_user = users.id_user 
	  WHERE entries.datum BETWEEN ? AND ? AND entries.id_user = ?`,
	  [req.body.od, req.body.do,idUSER],
	  (error, results) => {
		if (error) {
		  console.error(error);
		  return;
		}

		// Úprava datumu
		for (let i = 0; i < results.length; i++) {
		  var date = new Date(results[i].datum);
		  var formattedDate = date.toLocaleDateString();
		  results[i].datum = formattedDate;
		}
  
		const fileStream = fs.createWriteStream("data.csv");
  
		csv
		  .write(results, { headers: true })
		  .pipe(fileStream)
		  .on("finish", () => {
	
  
			// Nastavení hlaviček souboru pro stahování
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
			  "Content-Disposition",
			  `attachment; filename=data-${req.body.od}-${req.body.do}.csv`
			);
  
			// Vrácení souboru jako odpovědi na požadavek
			fs.createReadStream("data.csv").pipe(res);
		  });
	  }
	);
});
}
} 
  });

  
app.get("/", (req, res) => {
	    req.session.loggedin = false
		req.session.username = null;

   
 res.render("index", {stav : 'Přihlásit se', name : req.session.username } );
});

app.get("/class/:id_class", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
	connection.query('SELECT users.id_user,users.firstName,users.lastName,roles.name from users  inner join roles on users.id_role = roles.id_role  where users.id_class = (SELECT id_class from classes where id_class = ? )' ,req.params.id_class,(error, results) => {


 const users = results;

 connection.query ('SELECT name from classes where id_class = ?' , req.params.id_class, function(error, results){
   
    
	res.render("classProfile",{className : results[0].name,users: users,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})

 });

 
	});



}
});


app.get("/absence/:id_user", (req, res) => {
	
	if(req.session.loggedin === true && req.params.id_user == userID || req.session.loggedin === true && roleID === 3 || req.session.loggedin === true && roleID === 2 ){
		
		
        
		const idUser = req.params.id_user;
	
		connection.query('SELECT firstName,lastName from users where id_user = ? ' ,[idUser],(error, results) =>{
		 const firstNameUser = results[0].firstName;
		 const lastNameUser = results[0].lastName;
	     console.log(idUser);
			connection.query(`SELECT entries.datum, absence.omluveno,absence.duvod,COUNT(absence.id_absence) AS absence_count 	FROM entries INNER JOIN absence ON absence.id_entry = entries.id_entry WHERE absence.id_user = ? GROUP BY entries.datum,absence.omluveno,absence.duvod`, [idUser], (error, results) => {
	        
		

		
				for(var j= 0; j < results.length; j++) {
					var date = new Date(results[j].datum);
					var options = { day: '2-digit', month: '2-digit', year: 'numeric' };
					var formattedDate = date.toLocaleDateString('cs-CZ', options).replace(/\./g, '/');
					formattedDate = formattedDate.split(' ').map(s => s.trim()).join('');
	
					results[j].datum = formattedDate;
				};
			
			absenceID = req.params.id_user;
		    idUserPrihlasen = userID;
			const users = results;
			console.log(results);
			res.render("absence", {
				idUserPrihlasen : idUserPrihlasen,
				absenceID : absenceID,
				IDrole : roleID,
				date : formattedDate,
				users : users,
				user_id: userID,
				stav: 'Odhlásit se',
				name: req.session.username,
				firstNameUser : firstNameUser,
				lastnameUser : lastNameUser,
				role: roleID,
				class_id: hasClass,
				user_id : idUser
			});
		});
		});
		
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {

				res.redirect("/");
}
});

  


	let userID;
	let hasClass;
//Main page after successfully loged in 
app.get("/mainPage", (req, res) => {
	
	   
  if (req.session.loggedin) {
	connection.query('SELECT id_user,id_class from users where username = ? ' ,req.session.username,(error, results) =>{
         
		userID = results[0].id_user;
		hasClass = results[0].id_class;

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
		 


	if(req.session.loggedin === true && req.params.id_user == userID || req.session.loggedin === true && roleID === 3 || req.session.loggedin === true && roleID === 2 ){
		
		connection.query('SELECT  users.username as username, users.firstName as firstName,users.lastName as lastName, roles.name as role from users inner join roles on users.id_role = roles.id_role   where users.id_user = ? ' ,req.params.id_user,(error, results) =>{
	  if(results.length > 0) {

	
			firstName = results[0].firstName;
			lastName = results[0].lastName;
			className = results[0].className;
			username = results[0].username;
			roleName = results[0].role;
    
			


			connection.query('SELECT id_role,id_class from users where id_user = ?' ,req.params.id_user,(error, results) =>{
                idRole = results[0].id_role;
				idCLass = results[0].id_class;
				if(results[0].id_role > roleID  ) {
					res.redirect('/blockedAccess');
				} else {

				


				connection.query('SELECT id_class from users where id_user = ?' ,req.params.id_user,(error, results) =>{
				
					if(results[0].id_class != null) {
				
						hasClass = results[0].id_class;
						connection.query('SELECT name from  classes where id_class = ?' ,hasClass,(error, results) => {
                              className = results[0].name;
							res.render("userProfile",{roleColor : idRole,roleName : roleName,username : username,user_id : userID,specificUserID : req.params.id_user,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,firstName : firstName,lastName : lastName,className : className,class_id : hasClass})
						});
					} else{
						hasClass = null;
						res.render("userProfile",{roleColor : idRole,roleName : roleName,username : username,user_id : userID,specificUserID : req.params.id_user,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,firstName : firstName,lastName : lastName,className : className,class_id : null})
					};
				});


			
			}
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
	if (!req.session.loggedin){
		res.redirect("/");
			} else {
	res.render("changePassword",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass});
			}
});

app.post("/user/changePassword/:id_user", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else { 
	idd = req.params.id_user;
	password = req.body.password;

	connection.query('UPDATE users set password = ? where id_user = ? ' ,[password, idd],(error, results) => {
		
		
		
		res.render("success", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID, text : 'Heslo bylo úspěšně změněno',class_id : hasClass});	
	req.session.loggedin = false;
	});
}
});

app.get("/predmety", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			
			res.render("blockedAccess",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})

		} else {

		
		connection.query('SELECT jmeno,id_subject FROM subjects  ', (error, results) => {
			if (error) throw error;
		
			// store the results in an array
			const users = results;
		
			// render the HTML template and pass the array to the template
			res.render("predmety", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users,class_id : hasClass});
		  });


		}


	  } else { 
		  
	  res.redirect('/');
	  }
	
   });


 app.get("/uzivatele", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			
			res.render("blockedAccess",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})

		} else {

		
		connection.query('SELECT users.firstName, users.lastName,roles.name,users.id_user FROM users inner join roles on users.id_role = roles.id_role ', (error, results) => {
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

   app.post("/smazatPredmet", (req, res) => {

	if(req.session.loggedin === true && roleID === 3){
		

	
		
		connection.query('DELETE FROM entries WHERE id_subject = ? ' , [req.body.id_subject], function(error, results) {
			console.log("tady")
			connection.query('DELETE FROM subject_times WHERE id_subject = ? ' , [req.body.id_subject], function(error, results) {
				console.log("tady")
			connection.query('DELETE FROM subjects WHERE id_subject = ? ' , [req.body.id_subject], function(error, results) {
				console.log("tdadada")
				res.send();
			});
					});
				});
			
		



	




	} else{
      res.redirect("/");
	};




});




   app.post("/smazatTridu", (req, res) => {

	if(req.session.loggedin === true && roleID === 3){
		

		
		connection.query('DELETE FROM subject_times WHERE id_class = ? ' , [req.body.id_class], function(error, results) {
			console.log("tady")
			connection.query('UPDATE users set id_class = ? WHERE id_class = ? ' , [null,req.body.id_class], function(error, results) {
				console.log("tady")
			connection.query('DELETE FROM classes WHERE id_class = ? ' , [req.body.id_class], function(error, results) {
				console.log("tdadada")
				res.send();
					  });
					});
				});
			
		



	




	} else{
      res.redirect("/");
	};




});


   app.get("/tridy", (req, res) => {
  
	if (req.session.loggedin )  {
		if(roleID === 2 || roleID === 1){
			
			res.render("blockedAccess",{user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,class_id : hasClass})

		} else {

		
		connection.query('SELECT classes.name, users.firstName, users.lastName,classes.id_class FROM users INNER JOIN classes ON users.id_class = classes.id_class where users.id_role = 2 ', (error, results) => {
			if (error) throw error;
		
			// store the results in an array
			const users = results;
	
			// render the HTML template and pass the array to the template
			res.render("tridy", {user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users,class_id : hasClass});
		  });


		}


	  } else { 
		  
	  res.redirect('/');
	  }
	
   });



   app.listen(process.env.PORT ||200, function () {
    console.log('listening');
  });


