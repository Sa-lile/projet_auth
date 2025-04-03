const express = require('express');
const userRoute = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const { saveUser, getAllUsers } = require('./models/userModel')
const app = express();

// Spécifier le moteur de templates EJS
app.set('view engine', 'ejs');
// Route racine
app.get('/', (req, res) => {
        res.render('index', { username: 'Sachiyo', password: '12345' });
    });

app.get('/private', (req, res) => {
            res.render('private', { username: 'Lily', password: '55555' });
        });

const PORT = process.env.PORT || 3000; 
// const users = [{ username: 'sachiyo', password: '12345'}]; // Simule une base de données
const users = []
// Middleware to parse JSON bodies in requests
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use('/api/users', userRoute);



app.post('/register', async(req, res, next) => {
    const {username, password} = req.body;
    // const isAlreadlyRegistered = users.find(user => user.username === username);
    const users = await getAllUsers() // S'assurer que users est bien un tableau;
    console.log(users)
    const isAlreadlyRegistered = users.find(user =>  user.username === username);
    if(isAlreadlyRegistered) {
        res.status(400).send('User already registered')
    }
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
        username,
        password : hashedPassword
    }

    // Ajouter l'utilisateur
    // users.push({ username, password: hashedPassword });
    const result = saveUser(userData);
    if (result) {
        res.status(200).send('New User successfully registered');
    } else {
        res.status(500).send('New User not registered');
    }
})

app.post('/login', async(req, res, next) => {
    const { username, password } = req.body;

    const user = users.find(user => {
        return user.username === username;
    })
    if(!user) {
        res.status(404).send('Utilisateur non enregistre');
        return
    }
    
    const isVaild = await bcrypt.compare(password, user.password);
    if(!isVaild) {
        res.status(401).send('Mot de passe incorrect')
        return
    }      // authentication de JWT
    const token = jwt.login({ username: user.username, role: "user"}, jwt_secret_key )

    res.cookie('token', token, { httpOnly: true, sameSite: "lax"})
    res.status(200).send("Bien connect")
});


app.get('/admin', (req, res, next) => {
    res.status(200).render('private');
})

app.listen(PORT, () => {
    console.log(process.env)
    console.log(`Server listening on port ${PORT}`);
});
