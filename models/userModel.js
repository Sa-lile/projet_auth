require('dotenv').config(); 
const mysql = require('mysql2'); 

// Configuration de connexion 
const connection = mysql.createConnection({ 
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,  
}); 

// Connexion à la base de données 
connection.connect(err => { 
  if (err) { 
    console.error('Erreur de connexion :', err.stack); 
    return;   
  } 
  console.log('Connecté avec succès à la base de données !'); 
});


const saveUser = (userData) => {
  //userData : username, password
    connection.query(`ÌNSERT INTO users (username, password) VALUES(${userData.username},${userData.password})`, (error, result)=> { 
      if(error) {
        throw error;
      } else {
        console.log(result)
      }
      })
    return userData;
};

const getAllUsers = () => {
  connection.query('SELECT * FROM users', (error, results) => { 
    if (error) {
      throw error; 
    } else {
      return results;
    } 
  }); 
}
module.exports = { saveUser, getAllUsers };

// Fermer la connexion après avoir terminé 
connection.end(); 