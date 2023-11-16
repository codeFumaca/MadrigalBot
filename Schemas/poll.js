const { Schema, model } = require('mongoose');

let poll = new Schema({
    Msg: String,
    Aceitaram: [],
    Negaram: [],
    Guild: String,
    Autor: String
});

module.exports = model('pollSchema', poll)