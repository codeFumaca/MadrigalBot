const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { SUGGESTION_CHANNEL } = process.env;
const suggestionSchema = require('../../Schemas/suggestion')

module.exports = {
    cooldown: 300,
    data: new SlashCommandBuilder()
        .setName('sugestao')
        .setDescription('Cria uma nova sugestão no canal'),

    async execute(interaction) {

        const canal = interaction.guild.channels.cache.get(SUGGESTION_CHANNEL);

        const modal = new ModalBuilder() // inicio modal
            .setCustomId('Sugestao')
            .setTitle('Nova Sugestão');

        const sugestaoInput = new TextInputBuilder()
            .setCustomId('sugestaoInput')
            .setMaxLength(2048)
            .setLabel("Qual a descrição da Sugestão ?")
            .setPlaceholder('Fale mais sobre a sugestão')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(sugestaoInput);

        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);

        const modalIteraction = await interaction.awaitModalSubmit({
            time: 3000000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            console.error("Erro ao publicar sugestao: "+error)
            return null;
        })
        if (!modalIteraction) return;

        const sugestao = modalIteraction.fields.getTextInputValue('sugestaoInput');

        const Embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: 'Nova Sugestão! 📰' })
            .setTimestamp()
            .addFields(
                { name: "Sugestão: ", value: `${sugestao}` }
            )
            .setFooter({ text: `Enviado por ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        canal.send({ embeds: [Embed] },
            modalIteraction.reply({ content: "<a:verificado:1136086161136300142> Sugestão enviada com sucesso! ", ephemeral: true }))
            .then(message => {
                message.react('✅'),
                    message.react('❌')
            })
            .catch((error) => console.error(`Erro ao enviar mensagem: ${error}`));

            await suggestionSchema.create({ suggestion: sugestao, author: interaction.user })
    },
};