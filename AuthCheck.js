const JWT = require("jsonwebtoken");
cookieParser = require('cookie-parser');

const isLoggedIn = (req, res, next) => {
  let token = req.signedCookies.AuthCookie;
  console.log(req.signedCookies);
  if(token == undefined){
    return res.send(JSON.stringify({msg:"protected route"}));
  }
  
  JWT.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.send(err);
    }
    req.currentUser = JWT.decode(token, { json: true });
    console.log(req.currentUser)
  });
  next();
};

module.exports = isLoggedIn;
