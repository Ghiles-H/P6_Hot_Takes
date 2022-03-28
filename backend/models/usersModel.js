const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: {        //email unique 
        type: String,
        require: true,
        unique: true
    },
    password: {     //password à hacher avant d'être envoyer dans la database
        type: String,
        require: true
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);