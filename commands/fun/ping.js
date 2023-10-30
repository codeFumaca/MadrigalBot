const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Testa seu ping.'),

	async execute(interaction) {

		let ping = interaction.client.ws.ping;
		
		let embed = new EmbedBuilder()
			.setColor("Random")
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp()
			.setFooter({ text: 'Copyright © Supremy Flyff' })
			.setDescription(`<a:tchauzin:1103141276590813224> Olá ${interaction.user}, seu ping é: \`Carregando...\`.`);

		let embed2 = new EmbedBuilder()
			.setColor("Random")
			.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
			.setTimestamp()
			.setFooter({ text: 'Copyright © Supremy Flyff' })
			.setDescription(`<a:tchauzin:1103141276590813224> Olá ${interaction.user}, seu ping é: ${interaction.client.ws.ping} ms.`);

		await interaction.reply({ embeds: [embed], fetchReply: true , ephemeral: true})
		interaction.editReply({ embeds: [embed2] , ephemeral: true})
	},
};