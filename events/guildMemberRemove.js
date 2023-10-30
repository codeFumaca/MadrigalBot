const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {

        const channel = member.guild.channels.cache.get('1136067184209174560');

        if (!channel) return;

        channel.setName(`👤 •  Discord: ${member.guild.memberCount}`)

    }
}