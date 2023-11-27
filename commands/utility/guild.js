const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Schemas/user.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription('Ações de guild.')
        .addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Adicionar', value: 'guild_add' },
					{ name: 'Remover', value: 'guild_remove' },
					{ name: 'verificar', value: 'guild_verify' },
				)),

    async execute(interaction) {
    },
};