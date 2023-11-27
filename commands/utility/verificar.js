const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Schemas/user.js')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('verificar')
		.setDescription('Vincular usuário à conta in-game.')
		.addUserOption(option => option.setName('usuario')
			.setDescription('Usuario para vincular')
			.setRequired(true))
		.addStringOption(option => option.setName('nick')
			.setDescription('Nick em jogo')
			.setRequired(true)),

	async execute(interaction) {
		const user = interaction.options.getUser('usuario');
		const nick = interaction.options.getString('nick');

		try {
			
			const usuario = await userSchema.findOne({ owner: user.id });

			if (!usuario) {
				
				await userSchema.create({
					owner: user.id,
					nicknames: [nick],
				});

				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('🔒 | Verificação')
							.setDescription('Nick vinculado com sucesso!')
							.setColor('Random')
							.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
							.setTimestamp(),
					],
					ephemeral: true,
				});
			}

			if (usuario.nicknames.includes(nick)) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('🔒 | Verificação')
							.setDescription('Este nick já está vinculado!')
							.setColor('Random')
							.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
							.setTimestamp(),
					],
					ephemeral: true,
				});
			}

			usuario.nicknames.push(nick);
			await usuario.save();

			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('🔒 | Verificação')
						.setDescription('Nick vinculado com sucesso!')
						.setColor('Random')
						.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
						.setTimestamp(),
				],
				ephemeral: true,
			});
		} catch (error) {
			console.error('Erro ao executar o comando:', error);
			return interaction.reply('Ocorreu um erro ao processar o comando.');
		}
	},
};
