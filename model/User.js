const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema
const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('users', UserSchema);