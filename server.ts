import { config } from 'dotenv';
import app from './app';
const fs = require('fs');
const https = require('https');

config();

const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://admin:12345@assignment.rfllk.mongodb.net/assignment?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }, 
(res: any) =>
  console.log("Db Connected")
)


const keyPath = './sslcert/wild.klikpal.pem';
const crtPath = './sslcert/wild.klikpal.CRT';
const caPath = './sslcert/wild.klikpal.cabundle';

var privateKey = fs.readFileSync(keyPath, 'utf8');

var certificate = fs.readFileSync(crtPath, 'utf8');

var cabundle = fs.readFileSync(caPath, 'utf8');

var credentials = {
  key: privateKey,
  cert: certificate,
  ca: cabundle,
  rejectUnauthorized: false,
};

const Apps = new app().app;

var httpsServer = https.createServer(credentials, Apps);

const start = () => {
  httpsServer.listen(process.env.PORT, () => {
    console.log(`Server up: https://localhost:${process.env.PORT}`); //PORT=3000
  });
};

start();

process.on('exit', (reason) => {
  console.log(`connection exit`, reason);
});

process.on('uncaughtException', (reason) => {
  console.log(`connection uncaughtException`, reason);
});
process.on('unhandledRejection', (reason) => {
  console.log('Reason: ' + JSON.stringify(reason));
});
// npm run dev: to tun the project
