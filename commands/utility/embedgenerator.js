const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('embedbuilder')
        .setDescription('Cria um embed personalizado (descrição será solicitada em um modal)')
        .addChannelOption(canal =>
            canal.setName('canal')
                .setDescription('Canal onde o embed será enviado')
                .setRequired(true))
        .addStringOption(titulo =>
            titulo.setName('titulo')
                .setDescription('Título do embed'))
        .addStringOption(thumb =>
            thumb.setName('thumb')
                .setDescription('Thumbnail do embed'))
        .addStringOption(subtitulo =>
            subtitulo.setName('subtitulo')
                .setDescription('Subtítulo do embed'))
        .addStringOption(img =>
            img.setName('imagem')
                .setDescription('Imagem do embed (URL)')),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        let canal = interaction.options.getChannel('canal');

        if (canal.type !== ChannelType.GuildText && canal.type !== ChannelType.GuildAnnouncement) {
            return interaction.reply({ content: "O canal selecionado não é um válido!", ephemeral: true })
        };

        const modal = new ModalBuilder()
            .setCustomId('Embed Builder')
            .setTitle('Corpo do Embed');

        const descEmbedInput = new TextInputBuilder()
            .setCustomId('descEmbedInput')
            .setMaxLength(2048)
            .setLabel("Qual a descrição do Embed ?")
            .setPlaceholder('Redija o conteúdo do embed')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(descEmbedInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const modalIteraction = await interaction.awaitModalSubmit({
            time: 3000000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error("Erro ao publicar modal: " + error)
            return null;
        })
        if (!modalIteraction) return interaction.reply({ content: 'Tempo excedido', ephemeral: true });

        const desc = modalIteraction.fields.getTextInputValue('descEmbedInput');

        let titulo = interaction.options.getString('titulo');
        let subtitulo = interaction.options.getString('subtitulo');
        let thumb = interaction.options.getString('thumb');
        let img = interaction.options.getString('imagem');

        if (!titulo) titulo = ` `;
        if (!subtitulo) subtitulo = ` `;
        if (!desc) desc = ` `;

        canal.send({
            embeds: [new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: `${subtitulo}` })
                .setDescription(desc)
                .setImage(img)
                .setThumbnail(thumb)
                .setTimestamp()
                .setTitle(titulo)
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
            ]
        }, modalIteraction.reply({ content: "<a:verificado:1136086161136300142> Embed enviado com sucesso! ", ephemeral: true }))
    }
}