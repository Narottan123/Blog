const express=require("express");
const bodyParser=require("body-parser")
const mongoose=require("mongoose");
const route=require('./route/route')

const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/*try{
    mongoose.connect("mongodb+srv://narattamsarkar91:pJO4W2WQoODI53Fn@cluster0.fqieqnn.mongodb.net/blog_project",{
    useNewUrlParser:true
})
}
catch(error){
    console.log(error);
}*/

mongoose.connect("mongodb+srv://Narottam2000:Sarkar2000@cluster0.bciguah.mongodb.net/blog", {
useNewUrlParser: true 
}).then(()=> {
    console.log("MongoDB is Connected");

}).catch((err) => {
console.log(err);
})

app.use('/',route);

app.listen(3000,()=>{
    console.log("port 3000");
})
