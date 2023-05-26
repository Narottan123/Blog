
const authorModel = require('../Models/authorModel')

const jwt=require('jsonwebtoken');
const authorCreate = async (req, res) => {
    let data = req.body;
    let saveddata = await authorModel.create(data);
    res.status(200).send({ message: saveddata });
}
const login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let author = await authorModel.findOne({ email: email, password: password });
        if (!author) {
            res.status(404).json({ message: "userid and password is invalid" })
        }
        let token=jwt.sign({name:"Narottam",authorId:author._id.toString()},"group6priyankaravinarottamvishal");
        if(!token){
            res.status(404).json({msg:"token is not found"});
        }
        res.setHeader('x-api-key',token);
        res.status(200).json({status:true,"token":token});
    }
    catch (err) {
           res.status(500).json({message:err.message})
    }
}
module.exports.authorCreate = authorCreate;
module.exports.login=login;