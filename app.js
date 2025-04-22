const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/myapp');

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
  
});


app.get('/about', (req,res) => {
    res.sendFile(path.join(__dirname+'/about.html'));
   
  });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
