const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

module.exports = { // Criando Slash o comando
	data: new SlashCommandBuilder()
		.setName('patchnotes')
		.setDescription('Postar um novo patch notes')
		.addChannelOption(canal =>
			canal.setName('canal')
				.setDescription('Canal para postar o patch notes')
				.setRequired(true)),
	async execute(interaction) { // Ação após utilizar o comando

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) { // Verificações
			return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
		}

		let canal = interaction.options.getChannel('canal');

		if (canal.type !== ChannelType.GuildAnnouncement && canal.type !== ChannelType.GuildText) {
			return interaction.reply({ content: "O canal selecionado não é um canal de anúncios!", ephemeral: true })
		};

		const modal = new ModalBuilder() // inicio modal
			.setCustomId('Patch')
			.setTitle('Novo Patch Notes');

		const tituloInput = new TextInputBuilder()
			.setCustomId('tituloInput')
			.setMaxLength(255)
			.setLabel("Qual o título do Patch ?")
			.setPlaceholder('Digite o título do Patch')
			.setStyle(TextInputStyle.Short);

		const mudancasInput = new TextInputBuilder()
			.setCustomId('mudancasInput')
			.setLabel("Quais as mudanças ?")
			.setMaxLength(4000)
			.setPlaceholder('Digite as informações do Patch')
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(tituloInput);
		const secondActionRow = new ActionRowBuilder().addComponents(mudancasInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal); // fim do modal

		const modalIteraction = await interaction.awaitModalSubmit({
			time: 3000000,
			filter: i => i.user.id === interaction.user.id,
		}).catch(error => {
			console.error("Erro ao publicar patch: "+error)
			return null;
		})
		if (!modalIteraction) return;

		const titulo = modalIteraction.fields.getTextInputValue('tituloInput');
		const mudancas = modalIteraction.fields.getTextInputValue('mudancasInput');

		canal.send('@everyone')
			.then(sentMessage => sentMessage.delete());

		canal.send({
			embeds: [new EmbedBuilder()
				.setColor("Random")
				.setAuthor({ name: 'Patch Notes 🛠️' })
				.setDescription(`${mudancas}`)
				.setThumbnail('https://cdn.discordapp.com/attachments/1082081325462331432/1136080958521614477/5560c1073dccaeae79d558935cac555c.png')
				.setTimestamp()
				.setTitle(titulo)
				.addFields(
                    { name: "Atenciosamente,", value: `Staff Flyff Madrigal`, inline: true })
				.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
			]
		})

		modalIteraction.reply({ content: `Patch enviado com sucesso!`, ephemeral: true })
			.then(() => console.log('Sucesso ao enviar um novo Patch!'))
			.catch((error) => console.error(`Erro ao enviar mensagem: ${error}`));
	},
};