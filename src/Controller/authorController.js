
const authorModel = require('../Models/authorModel')

const jwt = require('jsonwebtoken');
const authorCreate = async (req, res) => {
    try {
        let { fname, lname, title, email, password } = req.body;


        title = title.trim()
        const vab = ['Mr', 'Mrs', 'Miss']
        if (!vab.includes(title)) return res.status(400).send({ status: false, message: "Please provide valid title" })

        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({ message: "Please provide strong password" });
        }

        email = email.toLowerCase()

        //checking unqiue email should be there
        const authorData = await authorModel.findOne({ email: email })

        if (authorData)
            return res.status(400).send({
                status: false, message: "email already exists"
            })

        const author = new authorModel({
            fname,
            lname,
            title,
            email,
            password
        });

        const createdAuthor = await author.save();
        res.status(201).json(createdAuthor);
    } catch (error) {
        res.status(500).json({
            status: false, message: error.message
        })
    }
};



const login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: "userid and password must be needed" })
        }
        let author = await authorModel.findOne({ email: email, password: password });
        if (!author) {
            return res.status(401).json({ status: false, message: "userid and password is invalid" })
        }
        let token = jwt.sign({ group: "Group6", project: "Blog Project", authorId: author._id.toString() }, "group6priyankaravinarottamvishal");
        /*if(!token){
            res.status(404).json({msg:""});
        }*/
        res.setHeader('x-api-key', token);
        res.status(200).json({ status: true, "token": token });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
}
// Get all authors
const getAllAuthors = async (req, res) => {
    try {
        const authors = await authorModel.find();
        res.status(200).json(authors);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};
module.exports.authorCreate = authorCreate;
module.exports.login = login;
module.exports.getAllAuthors = getAllAuthors;