const express=require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const route=require('./route/route')

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

try{
    mongoose.connect("mongodb://127.0.0.1:27017/Blog_Management?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.1",{
    useNewUrlParser:true
})
}
catch(error){
    console.log(error);
}

/*mongoose.connect("mongodb+srv://rraj34361:bXgwmkpBz9CHdAfr@cluster0.brjrlou.mongodb.net/Blogging-project", {
useNewUrlParser: true 
}).then(()=> {
    console.log("MongoDB is Connected");

}).catch((err) => {
console.log(err);
})*/

app.use('/',route);

app.listen(3000,()=>{
    console.log("port 3000");
})