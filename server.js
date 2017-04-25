const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogPostRouter = require('./blogPostRouter');


const app = express();
app.use(morgan('common'));
app.use('/posts', blogPostRouter);

mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./model');


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to database at ${databaseUrl}`);
    mongoose.connect(databaseUrl, err => {
      if (err) {return reject(err);}
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      }).on('error', err => reject(err));
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close( err => {
        if(err) {return rject(err);}
        resolve();
      });
    });
  });
}

if(require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
