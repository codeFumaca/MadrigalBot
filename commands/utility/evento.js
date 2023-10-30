const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('evento')
        .setDescription('Envia um novo evento no canal de eventos')
        .addStringOption(titulo =>
            titulo.setName('titulo')
                .setRequired(true)
                .setDescription('Titulo do evento.'))
        .addStringOption(horario =>
            horario.setName('horario')
                .setDescription('Horário do evento.')),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const canal = interaction.guild.channels.cache.get('959079304673787964')

        const modal = new ModalBuilder() // inicio modal
            .setCustomId('Anuncio')
            .setTitle('Novo Anuncio');

        const descInput = new TextInputBuilder()
            .setCustomId('descInput')
            .setMaxLength(2048)
            .setLabel("Qual a descrição do Evento ?")
            .setPlaceholder('Fale mais sobre o evento')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(descInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const modalIteraction = await interaction.awaitModalSubmit({
            time: 300000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error("Erro ao publicar evento: "+error)
            return null;
        })
        if (!modalIteraction) return;

        const titulo = interaction.options.getString('titulo');
        let evento = modalIteraction.fields.getTextInputValue('descInput');
        let horario = interaction.options.getString('horario');

        if (!horario) horario = `\`Não informado.\``;
        if (!evento) evento = "Sem descrição."

        canal.send('@everyone')
            .then(sentMessage => sentMessage.delete());

        canal.send({
            embeds: [new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: 'Evento! 🎉' })
                .setTimestamp()
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(titulo)
                .addFields(
                    { name: "Descrição", value: `${evento}`, inline: true },
                    { name: "Horário", value: `*${horario}*` }
                )
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            ]
        },
            modalIteraction.reply({ content: `Evento enviado com sucesso!`, ephemeral: true }))
            .catch((error) => console.error(`Erro ao enviar mensagem: ${error}`));
    },
};