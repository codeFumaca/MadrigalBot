const { Events } = require('discord.js');
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Pronto! Iniciei como ${client.user.tag}`)

		if(!mongoURL) return;

		await mongoose.connect(mongoURL)

		if (mongoose.connect) {
			console.log('Conectado ao banco de dados!')
		} else {
			console.log('Erro ao conectar ao banco de dados!')
		}
	},
};