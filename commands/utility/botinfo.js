const { SlashCommandBuilder } = require('discord.js');
const Discord = require("discord.js")

module.exports = {
  cooldown: 10,
    data: new SlashCommandBuilder()
    .setName('botinfo')
	.setDescription('Fornece informações sobre o bot.'),

  async execute(interaction) {

    let dono = "315622721142652928"; // Coloque seu ID
    //let membros = interaction.client.users.cache.size;
    let servidores = interaction.client.guilds.cache.size;
    let canais = interaction.client.channels.cache.size;
    let bot = interaction.client.user.tag;
    let avatar_bot = interaction.client.user.displayAvatarURL({ dynamic: true });
    let linguagem = "JavaScript";
    let livraria = "Discord.js";
    let ping = interaction.client.ws.ping;

    const embed = new Discord.EmbedBuilder()
    .setColor("Random")
    .setAuthor({ name: bot, iconURL: avatar_bot })
    .setFooter({ text: bot, iconURL: avatar_bot })
    .setTimestamp(new Date())
    .setThumbnail(avatar_bot)
    .setDescription(`Olá ${interaction.user}, aqui estão alguns informações:\n\n> 🤖 Meu nome: \`${bot}\`.\n> ⭐ Meu dono: ${interaction.client.users.cache.get(dono)}.
\n> <:js:1136086311359479870> Linguagem de programação: \`${linguagem}\`.\n> 📚 Biblioteca: \`${livraria}\`.
\n> Estou em \`${servidores}\` servidores.\n> \`${canais}\` canais.\n> Ping: \`${ping}\` *(Pong!)*`);

    interaction.reply({ embeds: [embed] , ephemeral: true })


  }
}