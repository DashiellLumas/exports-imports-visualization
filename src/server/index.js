const express = require('express');
var cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const CENSUS_KEY = process.env.CENSUS_KEY;
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8081;
const app = express();
app.use(cors());
var countryCodes = require('./model/countryCodes');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('dist'));
// app.listen(PORT, () => {
//   console.log("application listening on port:", PORT);
// })
app.listen(PORT, "0.0.0.0");
function fetchCountryCode(countryCode, response,year) {
  axios.get(`https://api.census.gov/data/2014/intltrade/imp_exp?get=IMPALL${year},EXPALL${year},COUNTRY&SCHEDULE=${countryCode}&key=${CENSUS_KEY}`)
  .then(res => {
    console.log(res.data)
    response.json(res.data);
  })
}

app.get('/api/countryCodes/:country/:year', function(req,response,next){
  let year = req.params.year;
  let country = req.params.country;
  let countryCode = countryCodes[country];
  fetchCountryCode(countryCode,response,year);
})
