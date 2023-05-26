/*- Blogs Model
```
{ title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, 
tags: {array of string}, category: {string, mandatory}, subcategory: {array of string,
 examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt,
updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: 
false}, 
publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}*/

const mongoose=require('mongoose');

const blogschema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'author',
        required:true
    },
    tags:{
        type:[String],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subcategory:{
        type:[String],
        required:true
    },
    deletedAt:{
        type:Date
    },
    isDeleted:{
        type:Boolean,
        required:true
    },
    publishedAt:{
        type:Date
    },
    isPublished:{
        type:Boolean,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('blog',blogschema);