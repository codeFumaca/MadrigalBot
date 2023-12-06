const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa msgs do chat')
        .addIntegerOption(option =>
            option.setName("qtd")
                .setRequired(true)
                .setDescription(`Quantidade de linhas para excluir do canal`)),

    async execute(interaction) {

        const numero = interaction.options.getInteger('qtd');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        } else {
            if (parseInt(numero) > 99 || parseInt(numero) <= 0) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: "🚫 Error!! 🤖" })
                            .setDescription(`Só consigo deletar de **\`1 a 99\` ** linhas.`)
                            .setFooter({ text: 'Copyright © Flyff Madrigal', iconURL: interaction.guild.iconURL() })
                            .setColor("Random")
                            .setTimestamp()
                            .setThumbnail("https://cdn.discordapp.com/attachments/1101744901449850971/1103193324287967292/error-red-notification.gif")
                    ], ephemeral: true
                })
            } else {
                interaction.channel.bulkDelete(parseInt(numero))
            }
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: '🧹 Limpeza Concluída!' })
                    .setDescription(`O canal ${interaction.channel} teve \`${numero}\` mensagens deletadas.`)
                    .setTimestamp()
                    .setColor("Random")
                    .setFooter({ text: `Limpo por:  ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            ]
        })
    },
};