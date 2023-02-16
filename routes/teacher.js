const express = require("express");
const router = express.Router();
const csv = require("fast-csv");
const fs = require("fs");
let hasClass;

const mysql = require('mysql2');
const { exit } = require("process");
const connection  = mysql.createConnection({
	host : "sql8.freemysqlhosting.net",
	user : "sql8597540",
	password : "JUmqiUcLHW",
	port : "3306",
	database :  "sql8597540",

});
    connection.connect(function(err) {
      if (err) throw err;
    
    });

	router.post("/absence/omluvit", (req, res) => {
		if(req.session.loggedin === true) {
			connection.query("SELECT id_class from users where username = ?", req.session.username, function (error, results, fields){
				
						hasClass = results[0].id_class;
			

		if (!req.session.loggedin) {
		  res.redirect("/");
		} else if (roleID === 1) {
		  res.redirect('/blockedAccess');
		} else if (roleID === 2  && hasClass != null && req.session.loggedin === true || roleID === 3 && req.session.loggedin === true){
			
			connection.query("SELECT id_class from users where id_user = ?", [req.body.user_id], function (error, results, fields){
       
				idClassUser = results[0].id_class;
		
		if( idClassUser === hasClass && req.session.loggedin === true|| roleID === 3 && req.session.loggedin === true) {

			function convertDate(date) {
				const [month, day, year] = date.split('/');
				return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			  }
				const sqlDate = convertDate(req.body.datum); 

				connection.query("UPDATE absence INNER JOIN entries ON absence.id_entry = entries.id_entry SET absence.omluveno = 'ano', absence.duvod = ? WHERE entries.datum = ? AND absence.id_user = ?", [req.body.duvod,sqlDate,req.body.user_id], function (error, results, fields){
					res.send();
					
			});


		};
			});
		}
	});
};
	  });

	  router.post("/absence/smazat", (req, res) => {
		if(req.session.loggedin === true) {
			connection.query("SELECT id_class from users where username = ?", req.session.username, function (error, results, fields){
			
						hasClass = results[0].id_class;
			

		if (!req.session.loggedin) {
		  res.redirect("/");
		} else if (roleID === 1) {
		  res.redirect('/blockedAccess');
		} else if (roleID === 2  && hasClass != null && req.session.loggedin === true || roleID === 3 && req.session.loggedin === true){
			
			connection.query("SELECT id_class from users where id_user = ?", [req.body.user_id], function (error, results, fields){
      
				idClassUser = results[0].id_class;
		
		if( idClassUser === hasClass && req.session.loggedin === true|| roleID === 3 && req.session.loggedin === true) {

			function convertDate(date) {
				const [month, day, year] = date.split('/');
				return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			  }
				const sqlDate = convertDate(req.body.datum); 

				connection.query("DELETE FROM absence WHERE id_entry IN (SELECT id_entry FROM entries WHERE datum = ?) AND absence.id_user = ?", [sqlDate,req.body.user_id], function (error, results, fields){
					res.send();
			});


		};
			});
		}
	});
};
		
}); 
	  router.post("/absence/neurceno", (req, res) => {
		if(req.session.loggedin === true) {
			connection.query("SELECT id_class from users where username = ?", req.session.username, function (error, results, fields){
			
						hasClass = results[0].id_class;
			

		if (!req.session.loggedin) {
		  res.redirect("/");
		} else if (roleID === 1) {
		  res.redirect('/blockedAccess');
		} else if (roleID === 2  && hasClass != null && req.session.loggedin === true || roleID === 3 && req.session.loggedin === true){
			
			connection.query("SELECT id_class from users where id_user = ?", [req.body.user_id], function (error, results, fields){

				idClassUser = results[0].id_class;
		
		if( idClassUser === hasClass && req.session.loggedin === true|| roleID === 3 && req.session.loggedin === true) {

			function convertDate(date) {
				const [month, day, year] = date.split('/');
				return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			  }
				const sqlDate = convertDate(req.body.datum); 

				connection.query("UPDATE absence INNER JOIN entries ON absence.id_entry = entries.id_entry SET absence.omluveno = 'cekani', absence.duvod = ? WHERE entries.datum = ? AND absence.id_user = ?", [req.body.duvod,sqlDate,req.body.user_id], function (error, results, fields){
					res.send();
					
			});


		};
			});
		}
	});
};
	  });


	  router.post("/absence/pridatDuvod", (req, res) => {
		if(req.session.loggedin === true) {
		
			connection.query("SELECT id_user from users where username = ?", req.session.username, function (error, results, fields){
      idd_user = results[0].id_user;
	  console.log(req.body.user_id + " " +results[0].id_user)
		 if (req.body.user_id == idd_user || roleID === 3){
			
		
			function convertDate(date) {
				const [month, day, year] = date.split('/');
				return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			  }
				const sqlDate = convertDate(req.body.datum); 

				connection.query("UPDATE absence INNER JOIN entries ON absence.id_entry = entries.id_entry set absence.duvod = ? WHERE entries.datum = ? AND absence.id_user = ?", [req.body.duvod,sqlDate,req.body.user_id], function (error, results, fields){
					
					res.send();
					
			});


		
		
		} else {
			res.redirect('/');
		}
	});
} else {
	res.redirect('/');
}


	  });


	  
	  router.post("/absence/neomluvit", (req, res) => {
		if(req.session.loggedin === true) {
			connection.query("SELECT id_class from users where username = ?", req.session.username, function (error, results, fields){
				
						hasClass = results[0].id_class;
			
		
		if (!req.session.loggedin) {
		  res.redirect("/");
		} else if (roleID === 1) {
		  res.redirect('/blockedAccess');
		} else if (roleID === 2  && hasClass != null && req.session.loggedin === true || roleID === 3 && req.session.loggedin === true){
		
			connection.query("SELECT id_class from users where id_user = ?", [req.body.user_id], function (error, results, fields){
     
				idClassUser = results[0].id_class;
		
		if( idClassUser === hasClass && req.session.loggedin === true|| roleID === 3 && req.session.loggedin === true) {

			function convertDate(date) {
				const [month, day, year] = date.split('/');
				return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			  }
				const sqlDate = convertDate(req.body.datum); 

				connection.query("UPDATE absence INNER JOIN entries ON absence.id_entry = entries.id_entry SET absence.omluveno = 'ne', absence.duvod = ? WHERE entries.datum = ? AND absence.id_user = ?", [req.body.duvod,sqlDate,req.body.user_id], function (error, results, fields){
					res.send();
					
			});


		};
			});
		}
	});
} ;
	  });

	router.post("/:id_entry/edit", (req, res) => {
		if (!req.session.loggedin){
			res.redirect("/");
				} else	if(roleID === 1){
					
			   res.redirect('/blockedAccess');
			
				} else {

		
		const id = req.params.id_entry;
        taughtHours = req.body.taughtHours;
        notes = req.body.notes;
        topic = req.body.topic;
        users = req.body.name;

		
		connection.query("DELETE FROM absence WHERE id_entry = ?", id, function (error, results, fields){
		
		
				let selectedOptions = req.body.selectedOption;
				if (typeof selectedOptions === 'string') {
					selectedOptions = [selectedOptions];
				}
				
					
			
					 
					 
					 if(selectedOptions != null){
			
					
					  // Insert the selected options into the "absence" table
					  for (let i = 0; i < selectedOptions.length; i++) {
						
						  const sql = "INSERT INTO absence(id_entry,id_user) VALUES(?,?)";
						  const data = [id, selectedOptions[i]];
						  connection.query(sql, data, (err, result) => {
							if (err) {
							  console.log(err);
					  
							  
							}
						  });
					  }
					}


		connection.query("UPDATE entries SET lessonNumber = ?,topic = ?, notes = ? where id_entry = ?", [taughtHours,topic,notes,id], function (error, results, fields) {
			res.render("success", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID, text : 'Data has been successfully updated!'});	
	
		
			});
		});
		}
	});

	router.get("/:id_entry/edit", (req, res) => {
		if (!req.session.loggedin){
			res.redirect("/");
				} else	if(roleID === 1){
					
			   res.redirect('/blockedAccess');
			
				} else {

				
		const id = req.params.id_entry;
		
		connection.query("SELECT users.id_user, users.firstName, users.lastName FROM users INNER JOIN absence ON users.id_user = absence.id_user WHERE absence.id_entry = ?", [id], function (error, results, fields) {
			users = results;
			connection.query("SELECT id_user,firstName,lastName from users where id_class = (select id_class from entries where id_entry = ?) AND id_role = 1", [id], function (error, results, fields) {
            allUsers = results;
			});



  connection.query("SELECT lessonNumber,topic,notes FROM entries WHERE id_entry = ?", [id], function (error, results, fields) {
	
	res.render("edit", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users, allUsers : allUsers,taughtHours : results[0].lessonNumber, topic : results[0].topic, notes : results[0].notes});
  });
		});
	}
	});

	router.post("/:id_entry/delete", (req, res) => {

		if (!req.session.loggedin){
			res.redirect("/");
				} else	if(roleID === 1){
					
			   res.redirect('/blockedAccess');
			
				} else {

				

		const id = req.params.id_entry;
	  
		connection.query("DELETE FROM absence WHERE id_entry = ?", [id], function (error, results, fields) {
			connection.query("DELETE FROM entries WHERE id_entry = ?", [id], function (error, results, fields) {
				if (error) throw error;
				res.send();
				
			  });
		});
	}
	  });






	  
router.get("/downland", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
				connection.query('SELECT users.id_user,users.id_class,classes.name,classes.id_class from users inner join classes on users.id_class = classes.id_class  where users.username = ? ', req.session.username, (error, results) => {
					if (error) {
					  // Handle the error
					} else if (results && results.length > 0) {
					  if (results[0].name) {
						className = results[0].name;
						classID = results[0].id_class;
						userID = results[0].id_user;
						hasClass = results[0].id_class;
						res.render("downland", {classID : classID,className : className,class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	
					  } else {
						userID = results[0].id_user;
						hasClass = results[0].id_class;
						className = null;
						res.render("downland", {className : className,class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	
					  }
					} else {
						connection.query('SELECT id_user,id_class from users   where username = ? ', req.session.username, (error, results) => {
							userID = results[0].id_user;
									hasClass = results[0].id_class;
							connection.query('SELECT name,id_class from classes  where id_user = ? ', userID, (error, results) => {
								if (results) {
									className = results[0].name;
									classID = results[0].id_class;
									res.render("downland", {classID : classID,className : className,class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	
								  } else {
									
									className = null;
									res.render("downland", {className : className,class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	
								  }
							});
			
						  });
					}
				  });
				  
									
				
				}


	

});
router.post("/download", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
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
  });


  router.post("/downloadMyClass", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
	connection.query(
	  `SELECT entries.datum , classes.name as Třída, subjects.jmeno as Předmět, entries.topic as Téma, entries.notes as Poznámky, entries.lessonNumber as ČísloHodinyVRoce, 
			 users.firstName as Jméno, users.lastName as Příjmení , absence.duvod, absence.omluveno
	  FROM entries
	  INNER JOIN classes ON entries.id_class = classes.id_class 
	  INNER JOIN subjects ON entries.id_subject = subjects.id_subject 
	  INNER JOIN absence ON absence.id_entry = entries.id_entry 
	  INNER JOIN users ON absence.id_user = users.id_user 
	  WHERE entries.datum BETWEEN ? AND ? AND entries.id_class = ?`,
	  [req.body.od, req.body.do,classID],
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
} 
  });


let userID;
router.get("/entries", (req, res) => {
	
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
				connection.query('SELECT id_class from users where username = ? ' ,req.session.username,(error, results) =>{
					hasClass = results[0].id_class;
				

					connection.query('SELECT id_class,id_user from users where username = ? ' ,req.session.username,(error, results) =>{
         
						userID = results[0].id_user;
						hasClass = results[0].id_class;
						connection.query('SELECT datum,entries.lessonNumber,entries.id_entry, classes.name,subjects.jmeno FROM entries inner join classes on entries.id_class = classes.id_class inner join subjects on entries.id_subject = subjects.id_subject where id_user = ? ', userID,(error, results) => {
							if (error) throw error;
							
							for(var j= 0; j < results.length; j++) {
								var date = results[j].datum;
								var formattedDate = date.toLocaleDateString();	
								results[j].datum = formattedDate;
							};
					
							
							const users = results;
			
							res.render("entries", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users, date : formattedDate});
						  });
			
						});

				});
			
			
			}
});
    //Entry page
router.get("/entry", (req, res) => {


	if (!req.session.loggedin){
res.redirect("/");
	} else	if(roleID === 1){
		
   res.redirect('/blockedAccess');

	} else {

		

	// získejte aktuální čas
	const currentDate = new Date();

	const currentSQLDate = currentDate.toISOString().slice(0, 10); // převod na SQL formát data (YYYY-MM-DD)
	const currentSQLTime = currentDate.toTimeString().slice(0, 8); // převod na SQL formát času (HH:MM:SS)
	




	// vyberte data o probíhajících předmětech z tabulky subject_times pro aktuálního učitele
	const username = req.session.username;
	const query = `
	SELECT s.jmeno AS subject_name, classes.name as Class, s.id_subject, st.startTIme,st.endTIme,st.startDate,st.endDate,st.id_subject as subjectID, st.id_class as classID, st.id_user as userID 
	FROM subject_times st
	INNER JOIN subjects s ON st.id_subject = s.id_subject
	inner join classes on st.id_class = classes.id_class
	WHERE st.id_user = (SELECT id_user FROM users WHERE username = ?) AND ? BETWEEN st.startDate AND st.endDate  AND ? BETWEEN st.startTime AND st.endTime  AND st.day = DAYNAME(NOW())
	`;
	const values = [username,currentSQLDate,currentSQLTime];
	
	connection.query(query, values, (error, results) => {
	  if (error) throw error;
  if(results.length < 1){
		res.redirect('enterManually');
		res.end();
	  } else {
    console.log(results);
	 
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
	  } else {
		console.log('not found');
	  }
	   
	  const sql = `SELECT COUNT(*) as count FROM entries WHERE  id_subject = ? AND id_class = ?`;
		const values = [subjectID, classID];
		
		connection.query(sql, values, (error, results) => {
		  if (error) throw error;
		  logCount = results[0].count + 1;  


		const valuesClass = [classID];
	 
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_class = ?',valuesClass, (error, results) => {
			if (error) throw error;

			const users = results;







			
			
			res.render("entry", {class_id : hasClass,user_id : userID,teacherName: teacherName, 
				subject: subjectName,
				stav : 'Odhlásit se' , name : req.session.username  , role : global.roleID, classNumber : classname,
				taughtHours : logCount , users : users
			  });		
		  });	
		});	
	}  

	});
}
  });
  router.get("/enterManually", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
		
	connection.query('SELECT name,id_class from classes', (error, results) => {
		if (error) throw error;

		const users = results;





		res.render('enterManually',{class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users : users});

		
		
			
	  });	

	  	
	
	} 
	
   });

   router.post("/enterManuallySubject", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
		
	connection.query('SELECT subjects.id_subject, subjects.jmeno from subject_times  inner join subjects on subject_times.id_subject = subjects.id_subject where id_class = ?', req.body.selectedOption,(error, results) => {
		if (error) throw error;
		const users = results;
		const classID = req.body.selectedOption;
		const subjectID = req.body.selectedSubject;
		
		connection.query('SELECT jmeno,id_subject from subjects where id_class = ?', req.body.selectedOption,(error, results) =>{

			
				
				
				
				
				res.render('enterManuallySubject',{class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users : users,clasIDD : req.body.selectedOption});

			
			
		});
		
		

		





		

		
		
			
	  });	

	  	
	} 
	  
	
   });


   router.post("/enterManuallyForm", (req, res) => {
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {
	
		const classID = req.body.selectedOption;
		const subjectID = req.body.selectedSubject;
		const sql = `SELECT COUNT(*) as count FROM entries WHERE id_user = ? AND id_subject = ? AND id_class = ?`;
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_class = ? AND id_role = 1', classID, (error, results) => {
			if (error) throw error;

			const users = results;

			connection.query('SELECT name FROM classes WHERE id_class = ?', classID, (error, results) => {
				classNumberr = results[0].name;  
				
				
				
				
				connection.query('SELECT jmeno FROM subjects WHERE id_subject = ?', subjectID, (error, results) => {
                 subjectName = results[0].jmeno
             
				 connection.query('SELECT id_user FROM users WHERE username = ?', req.session.username, (error, results) => {
					userID = results[0].id_user
			
					connection.query(`SELECT COUNT(*) as count FROM entries WHERE id_subject = ? AND id_class = ?`, [subjectID, classID], (error, result) => {
                          pocet = result[0].count + 1;
						
						  if (error) throw error;
						res.render('enterManuallyForm',{class_id : hasClass,user_id : userID,taughtHours : pocet,subjectJmeno : subjectName,classNumber : classNumberr,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users, teacherName : req.session.username});
					});
					

				});	
					





				});	
			});	

			
			
			
		  });	

	  	
	} 
   });
  //Page where we post the form
  router.post("/success", (req, res) => {
  
	if (req.session.loggedin) {
	  res.render("success", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID ,text : 'Data has been successfully submitted'});	


     

	  
	  const currentTime = new Date();



	  const username = req.session.username;
	  const queryUSER = `
	SELECT  id_user
	from users
WHERE username = ? 
`;
const queryCLASS = `
SELECT  id_class
from classes
WHERE name = ?
`;
const querySUBJECT = `
SELECT  id_subject
from subjects
WHERE jmeno = ?
`;
	const query = `
	SELECT  st.id_subject as subjectID, st.id_class as classID, st.id_user as userID
FROM subject_times st
INNER JOIN subjects s ON st.id_subject = s.id_subject
inner join classes on st.id_class = classes.id_class
WHERE st.id_user = (SELECT id_user FROM users WHERE username = ?) 
AND st.id_class = (select id_class from classes where name = ?)
AND st.id_subject = (select id_subject from subjects where jmeno = ?)
	`;
	
	const values = [username,req.body.classNumber, req.body.subject];
	  connection.query(query, values, (err, results) => {
		if(1 === 4) {
			subjectID = results[0].subjectID;
			userID = results[0].userID;
			classID = results[0].classID;

			const subject = req.body.subject;
			const classNumber = req.body.classNumber;
			const taughtHours = req.body.taughtHours;
			const topic = req.body.topic;
			const notes = req.body.notes;
			const absence = req.body.absence;
			const lessonNumber = req.body.taughtHours;
			
			
			var d = new Date();
			var date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
	
	
			// získejte aktuální čas
		
	
	const data = [date,userID, subjectID, classID, topic, notes,lessonNumber];
			const sql = `INSERT INTO entries (datum,id_user, id_subject, id_class,  topic, notes,lessonNumber) VALUES (?,?, ?, ?, ?, ?,?)`;
			
			connection.query(sql, data, (err, result) => {
			  if (err) {
				console.log(err);
				
				return;
			  }
			 
			  const entryId = result.insertId;
			 
			 
			 let selectedOptions = req.body.selectedOption;
		if (typeof selectedOptions === 'string') {
			selectedOptions = [selectedOptions];
		}
		
			
	
			 
			 
			 if(selectedOptions != null){
	
			
			  // Insert the selected options into the "absence" table
			  for (let i = 0; i < selectedOptions.length; i++) {
				  const sql = `INSERT INTO absence (id_user, id_entry) VALUES (?,?)`;
				  const data = [selectedOptions[i], entryId];
				  connection.query(sql, data, (err, result) => {
					if (err) {
					  console.log(err);
			  
					  
					}
				  });
			  }
			}
			});
	  

		} else {
			const queryUSER = `
	SELECT  id_user
	from users
WHERE username = ? 
`;
const queryCLASS = `
SELECT  id_class
from classes
WHERE name = ?
`;
const querySUBJECT = `
SELECT  id_subject
from subjects
WHERE jmeno = ?
`;
			connection.query(queryUSER, username, (err, results) => {
				userID = results[0].id_user;
				connection.query(querySUBJECT, req.body.subject, (err, results) => {
					subjectID = results[0].id_subject;
					connection.query(queryCLASS, req.body.classNumber, (err, results) => {
						classID = results[0].id_class;


						const subject = req.body.subject;
						const classNumber = req.body.classNumber;
						const taughtHours = req.body.taughtHours;
						const topic = req.body.topic;
						const notes = req.body.notes;
						const absence = req.body.absence;
						const lessonNumber = req.body.taughtHours;
						
						
						var d = new Date();
						var date = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
				
				
						// získejte aktuální čas
					
				
				const data = [date,userID, subjectID, classID, topic, notes,lessonNumber];
				
						const sql = `INSERT INTO entries (datum,id_user, id_subject, id_class,  topic, notes,lessonNumber) VALUES (?,?, ?, ?, ?, ?,?)`;
						
						connection.query(sql, data, (err, result) => {
						  if (err) {
							console.log(err);
							
							return;
						  }
						 
						  const entryId = result.insertId;
						 
						 
						 let selectedOptions = req.body.selectedOption;
					if (typeof selectedOptions === 'string') {
						selectedOptions = [selectedOptions];
					}
					
						
				
						 
						 
						 if(selectedOptions != null){
				
						
						  // Insert the selected options into the "absence" table
						  for (let i = 0; i < selectedOptions.length; i++) {
							  const sql = `INSERT INTO absence (id_user, id_entry) VALUES (?,?)`;
							  const data = [selectedOptions[i], entryId];
							  connection.query(sql, data, (err, result) => {
								if (err) {
								  console.log(err);
						  
								  
								}
							  });
						  }
						}
						});
				  

					});
				});
			});
			
			
		};

	
		
		
// Get the selected options



		
	  });







	
	  // Insert the data into the "entries" table
	  

	  
	  } else { 
		  
	  res.redirect('/');
	  }
	
   });


module.exports = router;