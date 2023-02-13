const express = require("express");
const router = express.Router();
const csv = require("fast-csv");
const fs = require("fs");


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
			connection.query("SELECT id_user,firstName,lastName from users where id_class = (select id_class from entries where id_entry = ?)", [id], function (error, results, fields) {
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
				
			  });
		});
	}
	  });
//Entries
router.get("/downland", (req, res) => {



	res.render("downland", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID});	

});
router.post("/download", (req, res) => {
	connection.query(
	  `SELECT entries.datum , classes.name as Třída, subjects.jmeno as Předmět, entries.topic as Téma, entries.notes as Poznámky, entries.lessonNumber as ČísloHodinyVRoce, 
			 users.firstName as Jméno, users.lastName as Příjmení , absence.duvod, absence.omluveno
	  FROM entries
	  INNER JOIN classes ON entries.id_class = classes.id_class 
	  INNER JOIN subjects ON entries.id_subject = subjects.id_subject 
	  INNER JOIN absence ON absence.id_entry = entries.id_entry 
	  INNER JOIN users ON absence.id_user = users.id_user 
	  WHERE entries.datum BETWEEN ? AND ?`,
	  [req.body.od, req.body.do],
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
let userID;
router.get("/entries", (req, res) => {
	
	if (!req.session.loggedin){
		res.redirect("/");
			} else	if(roleID === 1){
				
		   res.redirect('/blockedAccess');
		
			} else {

			
			connection.query('SELECT id_class,id_user from users where username = ? ' ,req.session.username,(error, results) =>{
         
			userID = results[0].id_user;
			hasClass = results[0].id_class;
			connection.query('SELECT datum,entries.lessonNumber,entries.id_entry, classes.name,subjects.jmeno FROM entries inner join classes on entries.id_class = classes.id_class inner join subjects on entries.id_subject = subjects.id_subject where id_user = ? ', userID,(error, results) => {
				if (error) throw error;
				if(results.length > 0){
					var date = new Date(results[0].datum);
					var formattedDate = date.toLocaleDateString();	
				}
				const users = results;

				res.render("entries", {class_id : hasClass,user_id : userID,stav : 'Odhlásit se' , name : req.session.username  , role : roleID,users: users, date : formattedDate});
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
	const values = [username,currentTime];
	
	connection.query(query, values, (error, results) => {
	  if (error) throw error;
  if(results.length < 1){
		res.redirect('enterManually');
		res.end();
	  } else {

	 
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


		const valuesClass = [classID];
	 
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_class = ?',valuesClass, (error, results) => {
			if (error) throw error;

			const users = results;







			
			
			res.render("entry", {class_id : hasClass,user_id : userID,eacherName: teacherName, 
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

		hasClass = results[0].id_class;



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
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_class = ?', classID, (error, results) => {
			if (error) throw error;

			const users = results;

			connection.query('SELECT name FROM classes WHERE id_class = ?', classID, (error, results) => {
				classNumberr = results[0].name;  
				
				
				
				
				connection.query('SELECT jmeno FROM subjects WHERE id_subject = ?', subjectID, (error, results) => {
                 subjectName = results[0].jmeno
             
				 connection.query('SELECT id_user FROM users WHERE username = ?', req.session.username, (error, results) => {
					userID = results[0].id_user
			
					connection.query(`SELECT COUNT(*) as count FROM entries WHERE id_user = ? AND id_subject = ? AND id_class = ?`, [userID, subjectID, classID], (error, result) => {
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
SELECT  id_user
from users
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
		
		
		const subject = req.body.subject;
		const classNumber = req.body.classNumber;
		const taughtHours = req.body.taughtHours;
		const topic = req.body.topic;
		const notes = req.body.notes;
		const absence = req.body.absence;
		const lessonNumber = req.body.taughtHours;
		
		subjectID = results[0].subjectID;
		userID = results[0].userID;
		classID = results[0].classID;
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
  
// Get the selected options



		
	  });







	
	  // Insert the data into the "entries" table
	  

	  
	  } else { 
		  
	  res.redirect('/');
	  }
	
   });


module.exports = router;