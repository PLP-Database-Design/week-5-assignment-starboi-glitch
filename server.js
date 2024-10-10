const express = require('express');
const app = express(); 
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv'); 

app.use(express.json());
app.use(cors());
dotenv.config(); 


const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    db.connect((err) => {
        // If no connection 
        if(err) return console.log("Error connecting to MYSQL");
        //If connect works successfully
        console.log("Connected to MYSQL as id: ", db.threadId); 
    }) 


// Question 1: Retrieve all patients
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.get('/data', (req, res) => {
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            return res.status(500).send('Error Retrieving data');
        }
        res.render('data', { results: results });
    });
});

//Question Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            return res.status(500).send('Error Retrieving data');
        }
        res.render('data', { results: results });
    });
});

//Question 3: Filter patients by First Name
app.get('/patients', (req, res) => {
    db.query('SELECT first_name FROM patients', (error, results) => {
      if (error) {
        console.error('Error retrieving data from database:', error);
        return res.status(500).send('Error retrieving data from database');
      }
      res.json(results);
    });
  });
  
//Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty', (req, res) => {
    db.query('SELECT provider_specialty FROM providers', (error, results) => {
      if (error) {
        console.error('Error retrieving data from database:', error);
        return res.status(500).send('Error retrieving data from database');
      }
      res.json(results);
    });
  });


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    // Sending a message to the browser 
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });
});