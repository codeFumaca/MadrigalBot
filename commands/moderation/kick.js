const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { PUNISHMENTS_CHANNEL } = process.env;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them (but not really).')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuario para ser kickado')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('motivo')
				.setDescription('Motivo do kick.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
		}

		const user = interaction.options.getMember('usuario');
		let motivo = interaction.options.getString('motivo');
		const canal = interaction.guild.channels.cache.get(PUNISHMENTS_CHANNEL)

		if (motivo === null) motivo = "Não definido.";

		user.kick().then(() => {
			canal.send({
				embeds: [new EmbedBuilder()
					.setColor("Random")
					.setTitle("Kick! <:kick:1103937833149939802>")
					.setDescription(`O usuário ${user} foi kickado com sucesso! `)
					.setFooter({ text: 'Copyright © Flyff Madrigal' })
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))
					.addFields(
						{ name: 'Motivo: ', value: `${motivo}`, inline: true },
						{ name: 'ID: ', value: `${user.id}`, inline: true },
						{ name: 'Staff: ', value: `${interaction.user}`, inline: true },)
					.setTimestamp()]
			}),
				interaction.reply({ content: "Usuário punido!", ephemeral: true })
		}).catch(e => {
			interaction.reply({
				embeds: [new EmbedBuilder()
					.setColor("Red")
					.setAuthor({ name: "❌ | Error" })
					.setDescription(`Não foi possível kickar ${user} do servidor!\n*Contate um Administrador e informe o motivo.*`)
					.addFields(
						{ name: 'Motivo: ', value: `${e.message}`, inline: true },)
					.setFooter({ text: 'Copyright © Flyff Madrigal' })
					.setTimestamp()
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))], ephemeral: true
			})
		})
	},
};