const express = require('express');
var cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
var countryCodes = require('./model/countryCodes');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('dist'));
app.listen(PORT, () => {
  console.log("application listening on port:", PORT);
})

function fetchCountryCode(countryCode, response) {
  axios.get(`https://api.census.gov/data/2014/intltrade/imp_exp?get=IMPALL2014,EXPALL2014,COUNTRY&SCHEDULE=${countryCode}`)
  .then(res => {
    console.log(res.data)
    response.json(res.data);
  })
}

app.get('/api/countryCodes/:country', function(req,response,next){
  let country = req.params.country;
  let countryCode = countryCodes[country];
  fetchCountryCode(countryCode,response);
})
