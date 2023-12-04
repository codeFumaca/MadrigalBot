const { Schema, model } = require('mongoose');

let guild = new Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    members: { type: Array },
});

module.exports = model('guildSchema', guild)