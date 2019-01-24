const express = require('express');
const app = express();

const fileUpload = require('express-fileupload');

const keys = require('./config/keys');

const mongoose = require('mongoose');
mongoose.connect(keys.mongoDBURI)
  .then(() => { console.log('connected to mongoDB'); })
  .catch(() => { console.log('Could not connect to mongoDB...'); });

app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('index page');
});

const moveFileToTempFolder = (fileObj) => {
  return new Promise((resolve, reject) => {
    if(!fileObj) resolve();
    const filePath = `${__dirname}/upload/${fileObj.name}`;
    fileObj.mv(
      filePath,
      (err) => {
        if(err) reject(err);
        else resolve(filePath);
      }
    );
  });
};

app.post('/upload', (req, res, next) => {
  let promises = [];
  for(let i = 0;i < 3 ;i++) {
    console.log(req.files[`img${i + 1}`].name);
    promises[i] = moveFileToTempFolder(req.files[`img${i + 1}`]);
  }
  Promise.all([promises[0], promises[1], promises[2]])
    .then((values) => {
      console.log(values);
      return res.send(values);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });

});

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);