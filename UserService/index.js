const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const expressListEndpoints = require("express-list-endpoints");

const app = express();
app.use(bodyParser.json());
const connect = require('./database/db.js');
connect();
const cors = require("cors");
app.use(cors()); 

try {
  app.use('/student', require('./routes/student.js'));

  const PORT = 3020;  
  const HOST = '0.0.0.0'; // Listen on all network interfaces
  app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
  console.log(expressListEndpoints(app)); // In ra danh sách các endpoint mà server đang lắng nghe

} catch (error) {
  console.error('Error fetching data or setting up health check:', error);
}
