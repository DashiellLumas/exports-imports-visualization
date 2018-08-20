const express = require('express');
require('dotenv').config();
const axios = require('axios');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static('dist'));


app.listen(PORT, () => {
  console.log("application listening on port:", PORT);
})
