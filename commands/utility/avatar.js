const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Consiga o avatar do usuário.')
		.addUserOption(option => option.setName('usuario')
			.setDescription('Avatar do usuario para mostrar')),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario');

		if (user) return interaction.reply({
			embeds: [new EmbedBuilder()
				.setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
				.setAuthor({ name: '🖼️ | Avatar de ' + user.username })
				.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
				.setColor("Random")
				.setTimestamp()], ephemeral: true
		});
		return interaction.reply({
			embeds: [new EmbedBuilder()
				.setImage(interaction.user.displayAvatarURL({ dynamic: true, size: 2048 }))
				.setAuthor({ name: '🖼️ | Avatar de ' + interaction.user.username })
				.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
				.setColor("Random")
				.setTimestamp()], ephemeral: true
		});
	},
};