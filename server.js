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
    
    return axios.get("https://sheetdb.io/api/v1/zzmes3we8nbnp/search?Pedido=" + np).then( res => {
      res.data.map( person => {
        
           response.json({"fulfillmentMessages":
           [
            {
              "card": {
                 "title": "Pizzaria PLN ",
                 "subtitle": "Número do Pedido = " + np,
                  "imageUri": "https://cdn.glitch.global/ed90767e-7d31-49a0-944f-1e1f4f07b572/pizza.png?v=1658261784666"
              }
            },
            {
             "text" :{
                "text": ["Nome = " + person.Nome]
             }
            },
            {
             "text" :{
                "text": ["Status = " + person.Status]
             }
            }
             
           ]
          });

            
      });
    });
    
  }
  
   if (intentName == "consultar_pedido") {
    
   
    var np  = request.body.queryResult.parameters['numero_pedido'];

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
