const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const expressListEndpoints = require("express-list-endpoints");

const app = express();
app.use(bodyParser.json());
const connect = require('./database/db.js');
connect();

try {

  app.get('/healthcheck', (req, res) => {
    res.status(200).send('Server is up and running');
  });
  app.use('/register', require('./routes/registration.js'));

  const PORT = 3010;
  const HOST = '0.0.0.0'; // Listen on all network interfaces
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
  console.log(expressListEndpoints(app)); // In ra danh sách các endpoint mà server đang lắng nghe

} catch (error) {
  console.error('Error fetching data or setting up health check:', error);
}
