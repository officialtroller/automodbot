const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping').setDescription('returns the bot ping'),
    async execute(interaction, client) {
        await interaction.channel.sendTyping();
        const message = await interaction.deferReply({ fetchReply: true, });
        const newMessage = `API Latency: ${client.ws.ping}\nClient ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({ content: newMessage, });
    }
}