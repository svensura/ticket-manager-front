const express = require('express');
const app = express();
const port = process.env.PORT

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening on port: ${PORT}`));