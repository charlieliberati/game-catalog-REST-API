const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const Game = require("./Game");
const User = require("./User");
//const sequelize = require("sequelize");
const cors = require("cors");
const auth = require("./Middleware");
const jwt = require("jsonwebtoken");

const JWTSecret = "asdfghjkl";

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/games", auth, (req, res) => {
  const tk = req.token;
  const data = req.loggedUser;
  //console.log(tk);
  //console.log(data);
  Game.findAll({}).then(games => {
    //console.log(games);
    res.json(games);
  }); 
  
/*
  //retorno de statuscode adequado
  res.statusCode = 200;
  res.json(DB.games);*/
});

app.get("/game/:id", auth, (req, res) => {
  //HATEOAS: Hypermedia as the Engine of Application State
  var HATEOAS = [
    {
      href: "http://localhost:8080/games",
      method: "GET",
      rel: "Geta all games"
    },{
      href: "http://localhost:8080/game/"+req.params.id,
      method: "DELETE",
      rel: "Delete this game"
    },
    {
      href: "http://localhost:8080/game/"+req.params.id,
      method: "PUT",
      rel: "Update game"
    },
    {
      href: "http://localhost:8080/auth",
      method: "POST",
      rel: "Login and athentication"
    }
  ]

  if(isNaN(req.params.id)){
    //retorno de statuscode adequado
    res.status(400).json({err: "invalid id format"});
  }else{
    var id = parseInt(req.params.id);
    Game.findOne({
      where: {
        id: id
      }
    }).then(game => {        
        if(game == null){
          res.status(404).json({err: "id not found"});
        }else{
          res.status(200).json({game: game, _links: HATEOAS});
        }
        //res.statusCode = 200;
    });
  }
});

app.post("/game",auth, async (req, res) => {

  

  var {title, price, year} = req.body;

  if(await gameExists(title,null)==null){
    Game.create({
      title: title,
      price: price,
      year: year,
    }).then(async () => {
      const game = await gameExists(title, null);
      const id = game.id;
      const HATEOAS = [
        {
          href: "http://localhost:8080/games",
          method: "GET",
          rel: "Geta all games"
        },{
          href: "http://localhost:8080/game/"+id,
          method: "DELETE",
          rel: "Delete this game"
        },
        {
          href: "http://localhost:8080/game/"+id,
          method: "PUT",
          rel: "Update game"
        },
        {
          href: "http://localhost:8080/auth",
          method: "POST",
          rel: "Login and athentication"
        }
      ]
      res.status(200).json({game: game,_links: HATEOAS});
    });
  }else{
    res.status(409).json({err: "registering failed, title already exists"});
  }
  
});

app.delete("/game/:id",auth, async (req, res) => {
  const HATEOAS = [
    {
      href: "http://localhost:8080/games",
      method: "GET",
      rel: "Geta all games"
    },
    {
      href: "http://localhost:8080/auth",
      method: "POST",
      rel: "Login and athentication"
    }
  ]

  if(req.params.id!=undefined){
      var id = parseInt(req.params.id);
      if(!isNaN(id)){
        if(await gameExists(null,id) != null){
          Game.destroy({
              where: {
                  id:id
              }
          }).then(() =>
          res.status(200).json({message: "game sucessfully removed",_links: HATEOAS})
          );
        }else{
          res.status(404).json({err: "game not found"});
        }
      }else{ //não é numero
        res.sendStatus(400);
      }
  }else{// é nulo
    res.sendStatus(400);
  }
});


//post, put e patch podem ser usados
//o put é o mais padronizado atualmente
//put envia dados tanto por url quanto por formulário
app.put("/game/:id",auth, async (req, res) => {
  var id = parseInt(req.params.id);
  if(isNaN(id)){ 
    res.sendStatus(400);
  }
  if(await gameExists(null,id) != null){
    Game.update({title: req.body.title}, {where: {
      id:id
    }}).then(() => {}).catch(err => {
      res.sendStatus(400);
    });
    Game.update({price: req.body.price}, {where: {
      id:id
    }}).then(() => {}).catch(err => {
    res.sendStatus(400);
    });
    Game.update({year: req.body.year}, {where: {
      id:id
    }}).then(() => {}).catch(err => {
    res.sendStatus(400);
    });

    const game = await gameExists(null, id);
    const HATEOAS = [
      {
        href: "http://localhost:8080/games",
        method: "GET",
        rel: "Geta all games"
      },{
        href: "http://localhost:8080/game/"+id,
        method: "DELETE",
        rel: "Delete this game"
      },
      {
        href: "http://localhost:8080/game/"+id,
        method: "PUT",
        rel: "Update game"
      },
      {
        href: "http://localhost:8080/auth",
        method: "POST",
        rel: "Login and athentication"
      }
    ]

    res.status(200).json({game: game, _links: HATEOAS});
  }else{
    res.status(404).json({err: "game not found"});
  }
});


app.listen(8080, () =>{
  console.log("API rodando")
});

async function userExists(email){
  return await User.findOne({
    where: {
      email: email
    }});
}
async function gameExists(title, id){
  if(title){
    return await Game.findOne({
      where: {
        title: title
      }});
  }
  if(id){
    return await Game.findOne({
      where: {
        id: id
      }});
  }
}

//registro
app.post("/signup", async(req, res) => {
  var {name, email, password} = req.body;
  //console.log({name, email, password});
  if(name!="" && email!="" && password!=""){
    var user = await userExists(email);
    //console.log(user);
    if(user==null){
      console.log("criando usuario "+name);
      User.create({
        name: name,
        email: email,
        password: password
        }).then(() => {
          res.sendStatus(200);
        });
    }else{
      res.status(409).json({err: "email already in use"})}
    
  }else{
    res.sendStatus(400);
  }
  //call auth
});
//autenticação
app.post("/auth", (req, res) => {
  var {email, password} = req.body;
  if(email!="" && password!=""){
    User.findOne({
      where: {
        email: email,
        password: password
      }}).then(user =>{
        if(user!=undefined){
          //res.json({token: "TOKEN_MANUAL"})
          jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn:'2h'}, (err,token) => {
            if(err){
              res.json({err: 'internal failure'}).status(400);
            }else{
              res.json({token: token}).status(200);
            }
          });
        }else{
          res.status(401).json({err: "wrong email or password"});
        }  
      });
    
  }else{
    res.status(404).json({err: "email or password missing"});
  }  
});



module.exports = router;

//npm install
//npm install --save express
//npm install --save sequelize
//npm install --save mysql2 //dependencia do sequelize
//npm install --save body-parser //biblioteca do express para formularios
//npm install --save ejs //template engine
//npm install cors --save //para permitir acesso local externo a API
//nodemon index.js
//