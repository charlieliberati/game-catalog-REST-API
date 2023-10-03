const jwt = require("jsonwebtoken");
const JWTSecret = "asdfghjkl";

function auth(req, res, next){
  const authToken = req.headers['authorization'];
  if(authToken != undefined){
    const token = authToken.split(' ')[1];
    jwt.verify(token, JWTSecret, (err,data) => {
      if(err){
        res.json({err:'invalid token'}).status(401);
      }else{
        req.token = token;
        req.loggedUser = {id: data.id, email: data.email};
        next();
        //console.log(data);
      }
    });
  }else{
    res.json({err:'invalid token'}).status(401);
  }
}

module.exports = auth;