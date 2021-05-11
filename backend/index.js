const express = require('express');
const config = require('./config/app');
const app = express();
const router  =require('./router');
const cors = require('cors');
const port = config.appPort;
const http = require('http');
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(router);
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/uploads'));

const server = http.createServer(app);
const SocketServer = require('./socket');
SocketServer(server);
server.listen(port,()=>{
    console.log(`Listening on port ${port}`);

});

