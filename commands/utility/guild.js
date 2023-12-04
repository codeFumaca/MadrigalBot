const { SlashCommandBuilder, PermissionsBitField, ChannelType, CategoryChannel } = require('discord.js');
const guildSchema = require('../../Schemas/guild.js');

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


		switch (opcao) {
			case 'create':
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
					guild.channels.create({ name: `canal de voz`, type: ChannelType.GuildVoice, parent: CategoryChannel });
				});
				guildSchema.create({
					name: guildParam,
					owner: usuario.id,
					members: [],
				});
				break;
			case 'guild_add':
				const guildFind = await guildSchema.findOne({ owner: interaction.user.id });

				if (!guildFind) return interaction.reply({ content: 'Você não é líder de uma guild.', ephemeral: true });
				if (!usuario) return interaction.reply({ content: 'Você não mencionou um usuário.', ephemeral: true });
				if (guildFind.members.includes(usuario.id)) return interaction.reply({ content: 'Este usuário já está na guild.', ephemeral: true });

				guildFind.members.push(usuario.id);
				await guildFind.save();

				await usuario.roles.add(await guild.roles.cache.find(role => role.name === `${guildFind.name}`));

				await interaction.reply({ content: 'Membro adicionado com sucesso!', ephemeral: true });
				break;
			case 'guild_remove':
				const guildFind2 = await guildSchema.findOne({ owner: interaction.user.id });

				if (!guildFind2) return interaction.reply({ content: 'Você não é líder de uma guild.', ephemeral: true });
				if (!usuario) return interaction.reply({ content: 'Você não mencionou um usuário.', ephemeral: true });
				if (!guildFind2.members.includes(usuario.id)) return interaction.reply({ content: 'Este usuário não está na guild.', ephemeral: true });

				guildFind2.members.splice(guildFind2.members.indexOf(usuario.id), 1);
				await guildFind2.save();

				await usuario.roles.remove(await guild.roles.cache.find(role => role.name === `${guildFind2.name}`));

				await interaction.reply({ content: 'Membro removido com sucesso!', ephemeral: true });
				break;
		}
	}
};