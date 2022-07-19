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

    
    var url = "https://sheetdb.io/api/v1/zzmes3we8nbnp";
    
    return axios.get(url).then(res => {
      res.data.map(person => {

        if (person.Pedido == np) {
          
           response.json({"fulfillmentMessages":
           [
            {
              "card": {
                 "title": "Pizzaria PLN ",
                 "subtitle": "Pedido = " + npame,
                  "imageUri": "https://cdn.glitch.com/ed90767e-7d31-49a0-944f-1e1f4f07b572%2Fprevisao.png?v=1615465390523"
              }
            },
            {
             "text" :{
                "text": ["Temperatura atual = " + temperaturaAtual + "º"]
             }
            },
            {
             "text" :{
                "text": ["Temperatura máxima = " + temperaturaMaxima + "º"]
             }
            },
            {
             "text" :{
                "text": ["Temperatura mínima = " + temperaturaMinima + "º"]
             }
            }
             
           ]
        });

          
          response.json({"fulfillmentText" : "Nome no pedido " + person.Nome});
        } else {
          response.json({"fulfillmentText" : "Pedido " + np + " não encontrado!!!"});
        }
            
      });
    });
    
  }

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
