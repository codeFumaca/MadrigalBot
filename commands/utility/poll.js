const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const pollschema = require('../../Schemas/poll');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enquete')
        .setDescription('Cria uma enquete')
        .addStringOption(area =>
            area.setName('area')
                .setDescription('A área que irá abordar a enquete')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('topico')
                .setDescription('O tópico que será abordado na enquete')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const topic = await interaction.options.getString('topico');
            const area = await interaction.options.getString('area');

            await interaction.reply({ content: `Sua enquete foi iniciada!`, ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `📌 Nova enquete!` })
                .setTitle(area)
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
                .setDescription(`> ${topic}`)
                .addFields({ name: `Autor`, value: `${interaction.user}`, inline: false })


            const buttons = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setCustomId('poll.sim')
                .setLabel('✅')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('poll.nao')
                .setLabel('❌')
                .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                .setCustomId('poll.votos')
                .setLabel('🔎')
                .setStyle(ButtonStyle.Secondary),

            )

            const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] })
            msg.createMessageComponentCollector();

            await pollschema.create({
                Msg: msg.id, 
                Positivos: 0,
                Negativos: 0,
                Aceitaram: [],
                Negaram: [],
                Guild: interaction.guild.id,
                Autor: interaction.user.id
            })

        } catch (erro) { console.log(erro.message) }

    }
}