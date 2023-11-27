const { Schema, model } = require('mongoose');

let char = new Schema({
    owner: { type: String, required: true },
    nicknames: { type: Array },
});

module.exports = model('userSchema', char)