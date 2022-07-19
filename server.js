// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

const axios = require("axios");

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});



app.post("/planilha", function(request, response) {

  var intentName = request.body.queryResult.intent.displayName;
  
  if (intentName == "consultar_pedido") {
   
    var np  = request.body.queryResult.parameters['numero_pedido'];
    
    var url = "https://docs.google.com/spreadsheets/d/1lEsYaFcs2lirK-QFI-dhQVdizXx0J861c5qwNgx8PFY/edit#gid=0";
    return axios.get(url).then(response)
  }

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
