const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { PUNISHMENTS_CHANNEL } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bane um player')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuario para ser banido.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const user = interaction.options.getUser('usuario');
        let motivo = interaction.options.getString('motivo');
        const canal = interaction.guild.channels.cache.get(PUNISHMENTS_CHANNEL)

        if (motivo === null) motivo = "Não definido.";

        interaction.guild.members.ban(user, { reason: motivo }).then(() => {
            canal.send({
                embeds: [new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Banimento! <a:BANNED:1103347795412402176>")
                    .setDescription(`O usuário ${user} foi banido com sucesso! `)
                    .setFooter({ text: 'Copyright © Supremy Flyff' })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Motivo: ', value: `${motivo}`, inline: true },
                        { name: 'ID: ', value: `${user.id}`, inline: true },
                        { name: 'Staff: ', value: `${interaction.user}`, inline: true },)
                    .setTimestamp()]
            }),
                interaction.reply({ content: "Usuário punido!", ephemeral: true })
        }).catch(e => {
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: "❌ | Error" })
                    .setDescription(`Não foi possível banir ${user} do servidor!\n*Contate um Administrador e informe o motivo.*`)
                    .addFields(
                        { name: 'Motivo: ', value: `${e.message}`, inline: true },)
                    .setFooter({ text: 'Copyright © Supremy Flyff' })
                    .setTimestamp()
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))], ephemeral: true
            })
        })
    },
};