const { SlashCommandBuilder, PermissionsBitField, ChannelType, CategoryChannel } = require('discord.js');
const userSchema = require('../../Schemas/user.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('guild')
		.setDescription('Ações de guild.')
		.addStringOption(option =>
			option.setName('opcao')
				.setDescription('Categoria')
				.setRequired(true)
				.addChoices(
					{ name: 'criar', value: 'create' },
					{ name: 'adicionar', value: 'guild_add' },
					{ name: 'remover', value: 'guild_remove' },
				))
		.addStringOption(option =>
			option.setName('guild')
				.setDescription('Guild')
		)
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuario')),

	async execute(interaction) {
		const { guild } = interaction;
		const opcao = interaction.options.getString('opcao');
		const guildParam = interaction.options.getString('guild');
		const usuario = interaction.options.getMember('usuario');

		if (opcao === 'create') {
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
			}

			await guild.roles.create({
				name: `${guildParam}`,
				reason: 'Nova guild criada.',
			}).then(() => {
				interaction.reply({ content: `Guild criada com sucesso!`, ephemeral: true });
			})

			let role = await guild.roles.cache.find(role => role.name === `${guildParam}`);
			await usuario.roles.add(role);
			await guild.channels.create({
				name: `${guildParam}`,
				type: ChannelType.GuildCategory,
				permissionOverwrites: [
					{ id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
					{ id: role, allow: [PermissionsBitField.Flags.ViewChannel] },
				]
			}).then(CategoryChannel => {
				guild.channels.create({ name: `Canal de Texto`, type: ChannelType.GuildText, parent: CategoryChannel }).then(channel => {
					channel.send(`Bem vindo ao canal de texto da guild ${guildParam}!`);
				});
				guild.channels.create({ name: `Canal de Voz`, type: ChannelType.GuildVoice, parent: CategoryChannel });
			});
		}
	}
};