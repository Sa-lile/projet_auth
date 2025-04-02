require('dotenv').config(); 
const mysql = require('mysql2'); 

// Configuration de connexion 
const connection = mysql.createConnection({ 
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME  
}); 

// Connexion à la base de données 
connection.connect(err => { 
  if (err) { 
    console.error('Erreur de connexion :', err.stack); 
    return;   
  } 
  console.log('Connecté avec succès à la base de données !'); 
});
// Faire une requête SQL simple 
connection.query('SELECT * FROM users', (error, results) => { 
  if (error) throw error; 

  console.log('Résultats :', results); 
}); 
const users = [];

const saveUser = (userData) => {
    users.push(userData);
    console.log("Utilisateur enregistré:", userData);
    return userData;
};

module.exports = { saveUser };

// Fermer la connexion après avoir terminé 
connection.end(); 