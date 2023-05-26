const jwt = require('jsonwebtoken');

const middlewarefunc = (req, res, next) => {
  let token = req.headers['x-api-key'];
  try {
    let verify_token = jwt.verify(token, "group6priyankaravinarottamvishal");
    /*if (!verify_token) {
      return res.status(400).json({ msg: "Token is not valid" });
    }*/
    let id = verify_token.authorId;
    console.log(id);
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports.middlewarefunc = middlewarefunc;
