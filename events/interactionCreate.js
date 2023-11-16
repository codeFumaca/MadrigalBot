const { Events, Collection, EmbedBuilder } = require('discord.js');
const { LOG_CHANNEL } = process.env;

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {

			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({ content: `<:Sv_Timer:1142530095978905822> Espere, o comando \`${command.data.name}\` está em cooldown. Você pode utilizar novamente em <t:${expiredTimestamp}:R>.`, ephemeral: true });
			}
		}

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		const embed = new EmbedBuilder()
		.setAuthor({ name: `📜  Log` , iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })
		.setDescription(`**${interaction.user.tag}** executou o comando **${interaction.commandName}**`)
		.setTimestamp()
		.setColor('Red')
		.setFooter({ text: 'Direitos reservados © Flyff Madrigal' })

		try {
			await command.execute(interaction);
			const logchannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
			await logchannel.send({ embeds: [embed]});
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};