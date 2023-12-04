const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const slaps = [
    "https://i.giphy.com/media/3XlEk2RxPS1m8/giphy.gif",
    "https://i.giphy.com/media/mEtSQlxqBtWWA/giphy.gif",
    "https://i.giphy.com/media/j3iGKfXRKlLqw/giphy.gif",
    "https://i.giphy.com/media/2M2RtPm8T2kOQ/giphy.gif",
    "https://i.giphy.com/media/l3YSimA8CV1k41b1u/giphy.gif",
    "https://i.giphy.com/media/WLXO8OZmq0JK8/giphy.gif",
    "https://media1.tenor.com/images/0720ffb69ab479d3a00f2d4ac7e0510c/tenor.gif",
    "https://media1.tenor.com/images/8b80166ce48c9c198951361715a90696/tenor.gif",
    "https://media1.tenor.com/images/6aa432caad8e3272d21a68ead3629853/tenor.gif",
    "https://media1.tenor.com/images/4ec47d7b87a9ce093642fc8a3c2969e7/tenor.gif",
    "https://media.tenor.com/wKKCNA6Ni-MAAAAC/cheh-t1-t1lose.gif",
    "https://media.tenor.com/MrhME3n9Z2UAAAAC/dungeong.gif",
    "https://media.tenor.com/MCEtXDF30sgAAAAC/batman-slap-in-the-face.gif"
];
module.exports = {
    data: new SlashCommandBuilder()
        .setName("tapa")
        .setDescription("Dê literalmente um tapa!")
        .addUserOption(option =>
            option.setName("alvo")
                .setDescription("Quem você quer dar um tapa ??")
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member } = interaction

        const user = options.getUser("alvo");

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setImage(slaps[Math.floor(Math.random() * slaps.length)])
                    .setDescription(
                        `${member} deu um tapa em ${user}!`
                    )
            ]
        });
    }
}