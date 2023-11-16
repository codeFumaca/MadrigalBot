const { Schema, model } = require('mongoose');

let suggestion = new Schema({
    suggestion: String,
    author: Object
});

module.exports = model('suggestionSchema', suggestion)