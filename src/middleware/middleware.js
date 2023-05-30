const jwt = require('jsonwebtoken');
const authorModel = require('../Models/authorModel')

const middlewarefunc = async (req, res, next) => {
  try {
    let token = req.headers['x-api-key'];
    if (!token) {
      return res.status(401).json({ meessage: "Access denied! token not found" })
    }
    jwt.verify(token, "group6priyankaravinarottamvishal", async function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, msg: "Invalid Token" });
      }
      else {
        const authorId = await authorModel.findById(decoded.authorId)
        if (!authorId) return res.status(401)
          .json({ status: false, msg: "author not login" })

        req["x-api-key"] = decoded
        next();

      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
/*if (!verify_token) {
  return res.status(400).json({ msg: "Token is not valid" });
}*/
/*req.access_token= verify_token.authorId;
console.log(req.access_token);*/
/*let author=await authorModel.findById(req.access_token);
if(!author){
    return res.status(404).send({status:false,msg:"No such author exist"});
}*/

const emailvalidation = (req, res, next) => {
  const email = req.body.email
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ status: false, message: "invalid email please enter valid email" })

  }
  next()

}


module.exports.middlewarefunc = middlewarefunc;
module.exports.emailvalidation=emailvalidation;
