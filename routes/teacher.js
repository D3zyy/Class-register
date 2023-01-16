const express = require("express");
const router = express.Router();



const mysql = require('mysql2');
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


    //Entry page
router.get("/entry", (req, res) => {


	if (!req.session.loggedin){
res.redirect("/");
	}

	if(roleID === 1){
		
   res.redirect('/blockedAccess');

	};

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


		const valuesClass = [classID];
	 
		connection.query('SELECT firstName, lastName, id_user FROM users WHERE id_class = ?',valuesClass, (error, results) => {
			if (error) throw error;

			const users = results;
			
			res.render("entry", {teacherName: teacherName, 
				subject: subjectName,
				stav : 'Log out' , name : req.session.username  , role : global.roleID, classNumber : classname,
				taughtHours : logCount , users : users
			  });		
		  });	
		});	  
	});
  });

  //Page where we post the form
  router.post("/success", (req, res) => {
  
	if (req.session.loggedin) {
	  res.render("success", {stav : 'Log out' , name : req.session.username  , role : roleID});	




	  
	  const currentTime = new Date();



	  const username = req.session.username;
	const query = `
	SELECT s.jmeno AS subject_name, classes.name as Class, s.id_subject, st.id_subject as subjectID, st.id_class as classID, st.id_user as userID 
	FROM subject_times st
	INNER JOIN subjects s ON st.id_subject = s.id_subject
	inner join classes on st.id_class = classes.id_class
	WHERE st.id_user = (SELECT id_user FROM users WHERE username = ?) AND ? BETWEEN st.start_time AND st.end_time AND st.day = DAYNAME(NOW())
	`;
	const values = [username, currentTime];
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
		const sql = `INSERT INTO entries (date,id_user, id_subject, id_class,  topic, notes,lessonNumber) VALUES (?,?, ?, ?, ?, ?,?)`;
		
		connection.query(sql, data, (err, result) => {
		  if (err) {
			console.log(err);
			
			return;
		  }
		 
		  const entryId = result.insertId;
	     console.log(entryId);
		 
		 let selectedOptions = req.body.selectedOption;
    if (typeof selectedOptions === 'string') {
        selectedOptions = [selectedOptions];
    }
	
		

		 
         console.log(selectedOptions);
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