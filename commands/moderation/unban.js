const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { PUNISHMENTS_CHANNEL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Desbane um player')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario para ser desbanido.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento.')),

    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
        } else {
            const user = interaction.options.getUser('usuario');
            let motivo = interaction.options.getString('motivo');
            const canal = interaction.guild.channels.cache.get(PUNISHMENTS_CHANNEL)

            if (motivo === null) motivo = "Não definido.";

            let embedwork = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Desbanimento! <a:BANNED:1103347795412402176>")
                .setDescription(`O usuário ${user} foi desbanido com sucesso! `)
                .setFooter({ text: 'Copyright © Flyff Madrigal' })
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Motivo: ', value: `${motivo}`, inline: true },
                    { name: 'ID: ', value: `${user.id}`, inline: true },
                    { name: 'Staff: ', value: `${interaction.user}`, inline: true },)
                .setTimestamp()

            if (!motivo) motivo = "Não definido.";

            interaction.guild.members.unban(user).then(() => {
                canal.send({ embeds: [embedwork] }),
                    interaction.reply({ content: "Usuário desbanido!", ephemeral: true })
            }).catch(e => {
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: "❌ | Error" })
                        .setDescription(`Não foi possível desbanir ${user} do servidor!\n*Contate um Administrador e informe o motivo.*`)
                        .addFields(
                            { name: 'Motivo: ', value: `${e}`, inline: true },)
                        .setFooter({ text: 'Copyright © Flyff Madrigal' })
                        .setTimestamp()
                        .setThumbnail(user.displayAvatarURL({ dynamic: true }))], ephemeral: true 
                })
            })
        }
    },
};