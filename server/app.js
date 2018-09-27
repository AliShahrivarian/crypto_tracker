const express = require("express");
const routes = require('./routes/');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const router = express.Router();

let port = 5000 || process.env.PORT;

routes(router);

app.use(cors());
app.use(bodyParser.json());



app.use('/api', router);

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});