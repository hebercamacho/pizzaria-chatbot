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




app.post("/pizzaria", async function(request, response) {

  var intentName = request.body.queryResult.intent.displayName;
  
  if (intentName == "consultar_pedido") {    
   
    var np  = request.body.queryResult.parameters['numero_pedido'];
    
    axios.get("https://sheetdb.io/api/v1/8cg2kxdnvfg9b?Pedido=" + np).then( res => {
      
     if (res.data.length === 0)
      return response.json({"fulfillmentText" : "Pedido " + np + " não encontrado!!!"});  

      res.data.map( person => {
        
        
           return response.json({"fulfillmentMessages":
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
  
  if (intentName == "cadastrar_pedido") {
    var np=0;
    await axios.get('https://sheetdb.io/api/v1/8cg2kxdnvfg9b/count')
    .then( res => {           
       np = res.data.rows + 1;       
    });
    
    var nome  = request.body.queryResult.parameters['nome_cliente'];
    var sabor = request.body.queryResult.parameters['sabor_pizza'];
    var status  = 'pedido recebido';
    console.log(np)
    const dados = [{Pedido: np, Nome: nome, Sabor: sabor, Status: status}];
    
    axios.post("https://sheetdb.io/api/v1/8cg2kxdnvfg9b", dados)
    .then( res => {
      return response.json({"fulfillmentText" : "Pedido " + np + " cadastrado com sucesso."});
    })
    .catch( error => {
      return response.json({"fulfillmentText" : "Houve um erro no cadastro do seu pedido. " + error});
    });    
    
  }
  
   if (intentName == "atualizar_status") {
   
    var np  = request.body.queryResult.parameters['numero_pedido'];
    var status  = request.body.queryResult.parameters['status'];
    
    const dados = [{Pedido: np, Status: status}];
    
    axios.patch("https://sheetdb.io/api/v1/8cg2kxdnvfg9b/Pedido/" + np, dados).then( res => {
    
      response.json({"fulfillmentText" : "Pedido atualizado com sucesso..."});
      
    })
    .catch(error => { 
    
       response.json({"fulfillmentText" : "Pedido " + np + " não encontrado!!!"});  
           
     });
    
  }
  
   if (intentName == "total_pedidos") {
   
    axios.get('https://sheetdb.io/api/v1/8cg2kxdnvfg9b/count')
     
    .then( res => {
           
       response.json({"fulfillmentText" : "Total de pedidos = " + res.data.rows}); 
      
    });
   }

});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
