const express = require('express')

const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (req, res, next)=> {
    res.send('on index')
})

app.post('/signup', (req, res, next)=> {
    console.log(req.body)
    res.send('signup called')
    //hash du password
    // enregistrement du user en base
    const { username, password } = req.body;

    try {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hash(password, saltRounds);
  
      const newUser = new User({ username, password: hashedPassword });
      newUser.save();
  
      res.status(201).send('User registered successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
})

app.post('/signin', (req, res, next)=> {
    res.send('signin')
    // recupere dans le body le username
    //comparer 
    const { username, password } = req.body;

    try {
      const user = User.findOne({ username });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const passwordMatch = bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        res.send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
})

app.listen(port, ()=> {
    console.log(`server listen on port ${port}`)
})

