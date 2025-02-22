const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/mydatabase', {useNewUrlParser: true, useUnifiedTopology: true})
const PhotoSchema = new Schema({
    title: String,
    description: String,
    
})
const Photo = mongoose.model('Photo', PhotoSchema);
Photo.create({
    title: 'Mtfgh',
    description: 'Thdsfgfhjkhlh.'
})