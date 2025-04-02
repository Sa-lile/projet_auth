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

// Enregistre nouveau utilisateur
const saveUser = (userData) => {
  //userData : username, password
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  const values = [userData.username, userData.password];
  
  connection.query(query, values, (error, result) => { 
    if (error) {
        console.error("Erreur SQL:", error);
        return;
    } 
    console.log("Utilisateur ajouté :", result);
});
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
// connection.end(); 
// error : Can't add new command when connection is in closed state -> deleted connection.end()