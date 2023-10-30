const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    cooldown: 20,
    data: new SlashCommandBuilder()
        .setName('embedbuilder')
        .setDescription('Cria um embed personalizado')
        .addChannelOption(canal =>
            canal.setName('canal')
                .setDescription('Canal onde o embed será enviado')
                .setRequired(true))
        .addStringOption(titulo =>
            titulo.setName('titulo')
                .setDescription('Título do embed'))
        .addStringOption(desc =>
            desc.setName('descrição')
                .setDescription('Descrição do embed'))
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

        let titulo = interaction.options.getString('titulo');
        let subtitulo = interaction.options.getString('subtitulo');
        let desc = interaction.options.getString('descrição');
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
        })

        await interaction.reply({ content: `Embed criado com sucesso!`, ephemeral: true })
            .catch((error) => console.error(`Erro ao enviar embed: ${error}`));

    }
}