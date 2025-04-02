const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { saveUser } = require('../models/userModel')

// Inscription
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer et sauvegarder l'utilisateur
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Connexion
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Vérifier le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }

        res.send('Login successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

module.exports = { registerUser, loginUser };
