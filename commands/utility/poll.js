const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pesquisa')
        .setDescription('Cria uma pesquisa')
        .addStringOption(area =>
            area.setName('area')
                .setDescription('A área que irá abordar a pesquisa')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('topico')
                .setDescription('O tópico que será abordado na pesquisa')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const topic = await interaction.options.getString('topico');
            const area = await interaction.options.getString('area');

            await interaction.reply({ content: `Sua pesquisa foi iniciada!`, ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `📌 Nova enquete!` })
                .setTitle(area)
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
                .setDescription(`> ${topic}`)
                .addFields({ name: `Autor`, value: `${interaction.user}`, inline: false })


            const msg = await interaction.channel.send({ embeds: [embed]})
                .then(message => {
                    message.react('✅'),
                        message.react('❌')
                });

        } catch (erro) { console.log(erro.message) }

    }
}