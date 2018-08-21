const express = require('express');
require('dotenv').config();
const axios = require('axios');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static('dist'));

app.get('/api/exports', function(req,response,next){
  axios.get(`https://api.census.gov/data/2014/intltrade/imp_exp?get=EXPALL2014,COUNTRY&SCHEDULE=5700`)
  .then(res => {
    response.json(res.data);
  })
})

app.get('/api/imports', function(req,response,next){
  axios.get(`https://api.census.gov/data/2014/intltrade/imp_exp?get=IMPALL2014,COUNTRY&SCHEDULE=5700`)
  .then(res => {
    response.json(res.data);
    console.log("this is ==>", res.data[1]);
  })
})

app.listen(PORT, () => {
  console.log("application listening on port:", PORT);
})
