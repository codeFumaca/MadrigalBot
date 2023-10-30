const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    cooldown: 21600,
    data: new SlashCommandBuilder()
        .setName('invasao')
        .setDescription('Envia uma mensagem de invasão')
        .addStringOption(local =>
            local.setName('local')
                .setDescription('Horário do evento.')),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const canal = interaction.guild.channels.cache.get('958894534815780916')

        let local = interaction.options.getString('local');

        if (!local) local = `\`Não informado.\``;

        canal.send('@everyone')
            .then(sentMessage => sentMessage.delete());

        canal.send({
            embeds: [new EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: 'Atenção! 🚨' })
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle("Invasão! ⚔")
                .addFields(
                    { name: "Descrição", value: `Preparem-se para a batalha, pois monstros estão surgindo por toda parte.`, inline: true },
                    { name: "Local", value: `*${local}*` }
                )
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            ]
        },
            interaction.reply({ content: `Evento enviado com sucesso!`, ephemeral: true }))
            .catch((error) => console.error(`Erro ao enviar mensagem: ${error}`));
    },
};