/*- Author Model
```
{ fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }
```*/

const mongoose = require("mongoose");

const authorschema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
        validate: [
            {
                validator: (value) => {
                    return value.length >= 2 && value.length <= 50;
                },
                message: 'First Name must be between 2 and 50 characters long'
            },
            {
                validator: (value) => {
                    return /^[a-zA-Z\s]+$/.test(value);
                },
                message: 'First Name can only contain letters and spaces'
            }
        ]
    },

    lname: {
        type: String,
        required: true,
        trim: true,
        validate: [
            {
                validator: (value) => {
                    return value.length >= 2 && value.length <= 50;
                },
                message: 'Last Name must be between 2 and 50 characters long'
            },
            {
                validator: (value) => {
                    /*^ - Asserts the start of the string.
                     [a - zA - Z\s] + - Character set that matches one or more 
                     occurrences of uppercase and lowercase letters(a- z and A- Z) or 
                     whitespace characters (\s).*/
                    return /^[a-zA-Z\s]+$/.test(value);
                },
                message: 'Last Name can only contain letters and spaces'
            }
        ]
    },
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        required: [true,"title should be given"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate:{
            validator:(value)=>{
                const emailRegex=/^[A-Z0-9._%+-]+@[A-Z0-9._%+-]+\.[A-Z]{2,}$/i;
                return emailRegex.test(value);
            },
            message:"Invalid email address"
        }


    },
    password: {
        type: String,
        required: true,
        trim:true
    }
})

module.exports = mongoose.model('author', authorschema);