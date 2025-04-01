const express = require('express');
const userRoute = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Définit un port par défaut à 3000 si non défini

// Middleware to parse JSON bodies in requests
app.use(express.json());


app.use('/api/users', userRoute);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
