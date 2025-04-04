const express = require('express');
const userRoute = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const { saveUser, getAllUsers } = require('./models/userModel')
const app = express();
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const OTPAuth = require('otpauth');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(session({ secret: 'super-secret', resave: false,
// saveUninitialized: true }));

// Création d'un utilisateur en mémoire
const user = {
    email: 'demo',
    password: '123',
    totpSecret: null,
    mfaValidated: false
    };

app.get('/login', (req, res) => {
    res.render('login');
    });

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === user.email && password === user.password) {
    // req.session.authenticated = true;
    res.redirect('/verify');
    } else {
    res.send('Mauvais identifiants.');
    }
    });

 app.get('/verify', async (req, res) => {
    // if (!req.session.authenticated) return res.redirect('/');
    if (!user.totpSecret) {
    // Générer une clé TOTP
    const totp = new OTPAuth.TOTP({
    issuer: 'MFA-Demo-App',
    label: user.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30
     });

    user.totpSecret = totp.secret.base32;
    const otpauthUrl = totp.toString(); // format otpauth://...
    const qr = await QRCode.toDataURL(otpauthUrl); // génération d'un qr

    return res.render('verify', { qr });
    }
    res.render('verify', { qr: null });
});

app.post('/verify', (req, res) => {
    const { token } = req.body;
    const totp = new OTPAuth.TOTP({
    issuer: 'MFA-Demo-App',
    label: user.email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(user.totpSecret)
    });
    const now = Date.now();
    const delta = totp.validate({ token, timestamp: now });
    if (delta !== null) {
    user.mfaValidated = true;
    res.redirect('/secret');
    } else {
    res.send('Code TOTP invalide.');
    }
    });



app.get('/secret', (req, res) => {
    if (req.session.authenticated && user.mfaValidated) {
    res.render('secret');
    } else {
    res.redirect('/');
}})

// Spécifier le moteur de templates EJS
app.set('view engine', 'ejs');
// Route racine
app.get('/', (req, res) => {
        res.render('index', { username: 'Sachiyo', password: '12345' });
    });

// Verifier avec JWT ( email or name is correct etc)    
app.get('/private', (req, res) => {
    const isHaveJWT = false;

    if(!isHaveJWT) {
        res.status(400).send("You can not accepet")
    } else {
        next();
    }
        // res.render('private', { username: 'Lily', password: '55555' });
    });

app.get('/admin', (req, res) => {
        res.render('admin', { username: 'Leon', password: '22222' });
    });
      
    
getAllUsers((rows) => {
    rows => [users];
    // logique qui va comparer les passwords et générer le token  
        
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

// app.get('/users',(req, res) => {
//     getAllUsers((users) => {
//       res.json(users); 
    //   const isVaild = bcrypt.compare(password, user.password);
    //   if(!isVaild) {
    //       res.status(401).send('Mot de passe incorrect')
    //       return
    //   }      // authentication de JWT
    //   const token = jwt.login({ username: user.username, role: "user"}, jwt_secret_key )
  
    //   res.cookie('token', token, { httpOnly: true, sameSite: "lax"})
    //   res.status(200).send("Bien connect")
      
//     });
//   });

app.listen(PORT, () => {
    console.log(process.env)
    console.log(`Server listening on port ${PORT}`);
});
