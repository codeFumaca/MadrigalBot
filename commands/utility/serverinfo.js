const { SlashCommandBuilder, EmbedBuilder, Options, TextInputAssertions } = require('discord.js');
const Discord = require("discord.js")
const { link } = require("fs");

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Envia as informações do atual servidor.'),

    async execute(interaction) {

        const icon = interaction.guild.iconURL({ dynamic: true });
        const membros = interaction.guild.memberCount;
        const dono = interaction.guild.ownerId;

        const embed1 = new Discord.EmbedBuilder()
            .setColor('White')
            .setTitle('<:discord:1042624339842973717> ' + interaction.guild.name)
            .setThumbnail(icon)
            .setImage(interaction.guild.splashURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
            .addFields(
                { name: `🆔 ID`, value: interaction.guild.id, inline: true },
                { name: `<:crown:1059992552327106560> Dono`, value: `<@${dono}> \`(${dono})\``, inline: true },
                { name: `👥 Membros (${membros})`, value: ` `, inline: true },
                { name: `📅 Criado em`, value: `${interaction.guild.createdAt.toLocaleDateString("pt-br")}`, inline: true },
                { name: `🌟 Entrei aqui em`, value: `${interaction.guild.joinedAt.toLocaleDateString("pt-br")}`, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: `💬 Canais (${interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice || c.type === Discord.ChannelType.GuildText).size})`, value: ` `, inline: true },
                { name: `📝 Texto: ${interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildText).size}`, value: ` `, inline: true },
                { name: `🗣️ Voz: ${interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice).size}`, value: ` `, inline: true },
            );

        const botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setURL(icon)
                .setLabel("Ícone do servidor")
                .setStyle(Discord.ButtonStyle.Link)
        )

        interaction.reply({ embeds: [embed1], components: [botao] , ephemeral: true })
    }
}