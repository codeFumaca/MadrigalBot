const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const pollschema = require('../Schemas/poll');

module.exports = {
    name: Events.InteractionCreate,
    async execute(i) {

        if (!i.guild) return;
        if (!i.message) return;
        if (!i.isButton()) return;

        const data = await pollschema.findOne({ Guild: i.guild.id, Msg: i.message.id });

        if (!data) return;

        const msg = await i.channel.messages.fetch(data.Msg);

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

        if (i.customId === 'poll.sim') {
            if (data.Aceitaram.includes(i.user.id)) return i.reply({ content: `Você já votou!`, ephemeral: true });

            data.Aceitaram.push(i.user.id);
            if (data.Negaram.includes(i.user.id)) {
                data.Negaram.pull(i.user.id);
            }

            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `Aceitaram`, value: `> **${data.Aceitaram.length}** Votos`, inline: true }, { name: `Negaram`, value: `> **${data.Negaram.length}** Votos`, inline: true }, { name: `Autor`, value: `> <@${data.Autor}>` });

            await i.update({ embeds: [newembed], components: [buttons] });

            data.save();
        }
        if (i.customId === 'poll.nao') {

            if (data.Negaram.includes(i.user.id)) return i.reply({ content: `Você já votou!`, ephemeral: true });

            data.Negaram.push(i.user.id);
            if (data.Aceitaram.includes(i.user.id)) {
                data.Aceitaram.pull(i.user.id);
            }

            const newembed = EmbedBuilder.from(msg.embeds[0]).setFields({ name: `Aceitaram`, value: `> **${data.Aceitaram.length}** Votos`, inline: true }, { name: `Negaram`, value: `> **${data.Negaram.length}** Votos`, inline: true }, { name: `Autor`, value: `> <@${data.Autor}>` });

            await i.update({ embeds: [newembed], components: [buttons] });

            data.save();
        }

        if (i.customId === 'poll.votos') {

            let votaramPositivo = [];
            await data.Aceitaram.forEach(async voto => {
                votaramPositivo.push(`<@${voto}>`)
            });

            let votaramNegativo = [];
            await data.Negaram.forEach(async voto => {
                votaramNegativo.push(`<@${voto}>`)
            });

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: `🗳️ Votos` })
            .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
            .addFields({ name: `A favor (${votaramPositivo.length})`, value: ` ${votaramPositivo.join(', ').slice(0, 1020)}`, inline: false })
            .addFields({ name: `Contra (${votaramNegativo.length})`, value: ` ${votaramNegativo.join(', ').slice(0, 1020)}`, inline: false })
            .addFields({ name: `Autor`, value: ` <@${data.Autor}>`, inline: false })
            .setThumbnail(i.guild.iconURL({ dynamic: true }))

        await i.reply({ embeds: [embed], ephemeral: true });
        }
    },
};