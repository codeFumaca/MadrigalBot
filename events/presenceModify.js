const { ActivityType, Events } = require('discord.js');

let presencas = [
	{ name: 'no Flyff Madrigal', type: ActivityType.Playing },
	{ name: 'Sala Secreta aos Domingos!', type: ActivityType.Competing },
	{ name: 'na Twitch', type: ActivityType.Streaming, url: 'https://www.twitch.tv/flyffmadrigaloficial' },
	{ name: 'novidades em breve!', type: ActivityType.Listening },
	
]

module.exports = {
	name: Events.ClientReady,
	execute(client) {

		setInterval(() => {
			let random = Math.floor(Math.random() * presencas.length);

			client.user.setPresence({
				activities: [presencas[random]],
				status: 'dnd',
			});
		}, 300000);
	},
};