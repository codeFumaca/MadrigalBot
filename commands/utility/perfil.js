const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Schemas/user.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Consiga o perfil do usuário.')
        .addUserOption(option => option.setName('usuario')
            .setDescription('Usuario para mostrar')),

    async execute(interaction) {
        let user = interaction.options.getUser('usuario');

        if (!user) user = interaction.user;
        const usuario = await userSchema.findOne({ owner: user.id });

        await interaction.deferReply();
		await wait(4000);

        if (usuario) return await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setAuthor({ name: '💷 | Perfil de ' + user.username })
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
                .addFields({ name: 'Nicknames:', value: `${usuario.nicknames.join(', ')}` },)
                .setColor("Red")
                .setTimestamp()], ephemeral: true
        });
        
        return await interaction.editReply({ content: "Este usuário não possui registro.", ephemeral: true });
    },
};