const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema
const PhotoSchema = new Schema({
    img_src:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});
mongoose.model('photos', PhotoSchema);
