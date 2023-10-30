const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anuncio')
		.setDescription('Postar um novo anúncio')
		.addChannelOption(canal =>
			canal.setName('canal')
				.setDescription('Canal para postar o patch notes')
				.setRequired(true)),
	async execute(interaction) {

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
		}

		let canal = interaction.options.getChannel('canal');

		if (canal.type !== ChannelType.GuildText && canal.type !== ChannelType.GuildAnnouncement) {
			return interaction.reply({ content: "O canal selecionado não é um canal de anúncios!", ephemeral: true })
		};

		const modal = new ModalBuilder() // inicio modal
			.setCustomId('Anuncio')
			.setTitle('Novo Anuncio');

		const tituloInput = new TextInputBuilder()
			.setCustomId('tituloInput')
			.setMaxLength(255)
			.setLabel("Qual o título do Anuncio ?")
			.setPlaceholder('Digite o título do anuncio')
			.setStyle(TextInputStyle.Short);

		const infoInput = new TextInputBuilder()
			.setCustomId('infoInput')
			.setLabel("Qual o corpo do anuncio ?")
			.setMaxLength(4000)
			.setPlaceholder('Digite as informações do anuncio')
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(tituloInput);
		const secondActionRow = new ActionRowBuilder().addComponents(infoInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);

		const modalIteraction = await interaction.awaitModalSubmit({
			time: 3000000,
			filter: i => i.user.id === interaction.user.id,
		}).catch(error => {
			console.error("Erro ao publicar anuncio: "+error)
			return null;
		})
		if (!modalIteraction) return;

		const titulo = modalIteraction.fields.getTextInputValue('tituloInput');
		const msg = modalIteraction.fields.getTextInputValue('infoInput');

		canal.send('@everyone')
			.then(sentMessage => sentMessage.delete());

		canal.send({
			embeds: [new EmbedBuilder()
				.setColor("Random")
				.setAuthor({ name: 'Anúncio! 📢' })
				.setDescription(msg)
				.setThumbnail('https://cdn.discordapp.com/attachments/1082081325462331432/1136080958521614477/5560c1073dccaeae79d558935cac555c.png')
				.setTimestamp()
				.setTitle(titulo)
				.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
			]
		})

		modalIteraction.reply({ content: `Anuncio enviado com sucesso!`, ephemeral: true })
			.then(() => console.log('Sucesso ao enviar um novo Anuncio!'))
			.catch((error) => console.error(`Erro ao enviar mensagem: ${error}`));

	},
};