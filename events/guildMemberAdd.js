const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {

        const channel = member.guild.channels.cache.get('959082774294319114');
        const channel2 = member.guild.channels.cache.get('1136067184209174560');

        if (!channel) return;

        channel.send({
            embeds: [new EmbedBuilder()
                .setTitle(member.user.username + " | Seja bem-vindo (a)")
                .setColor("Random")
                .setDescription(`Salve ${member.user}, você acaba de ingressar no servidor, onde terá a oportunidade de interagir com uma comunidade diversificada, desfrutar de vários canais para entretenimento, seguir regras para garantir um ambiente agradável para todos e muito mais!!`)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: 'Direitos reservados © Flyff Madrigal' })
                .addFields(
                    { name: "<:twitch:1042625074731163729> Twitch", value: "[Canal da Twitch](https://www.twitch.tv/flyffmadrigaloficial)", inline: true },
                    { name: "<:youtube:1042641455103082536> Canal do YT", value: "[Canal YouTube](https://www.youtube.com/channel/UC-iIuFcFfY6YRXgnkI5r-Cg)", inline: true },
                    { name: "<:facebook:1042641793751199754> Página do Facebook", value: "[Página Facebook](https://www.facebook.com/flyfffmadrigaloficial)", inline: true },
                    { name: "<:whatsapp:1042642238527782983> Entra no grupo do Whatsapp!", value: "[Grupo WatsApp](https://chat.whatsapp.com/Ix2C1yk6bcqIzcYcFLTTLe)", inline: true },
                    { name: "💈 Contagem", value: `Você foi nosso ${member.guild.memberCount}º usuário`, inline: true },
                    { name: "👮 Fique atento!", value: "Leia as nossas <#1042546816706683000> para evitar punições!", inline: true }
                )
            ]
        })
        channel2.setName(`👤 •  Discord: ${member.guild.memberCount}`)
    }
}