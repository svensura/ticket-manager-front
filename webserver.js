const express = require('express');
const dotenv = require('dotenv')
dotenv.config()



const app = express();
const port = process.env.PORT

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening`));