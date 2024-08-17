const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeword').setDescription('Remove a word to the bots blocklist.')
        .addStringOption((option) => option.setName('word').setDescription('The Word you want to remove').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction, client) {
        const word = interaction.options.getString('word').toLowerCase();
        if (client.blockedWords.includes(word)) {
            try {
                client.blockedWords = client.blockedWords.filter(w => w !== word);
                fs.writeFileSync("blocked_words.txt", client.blockedWords.join('\n'));
                let logChannel;
                if (interaction.guild.id === process.env.ZMLServerid) {
                    logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
                } else if (interaction.guild.id === process.env.MyServerid) {
                    logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
                }
                const removewordembed = new EmbedBuilder()
                    .setColor(client.moderationcolor).setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: `${interaction.user.tag} (ID ${interaction.user.id})`
                    }).setThumbnail(client.user.displayAvatarURL()).addFields([
                        {
                            name: `**⬅️Word removed from the BlackList:**`,
                            value: `${interaction.user.tag} removed \`${word}\``
                        }
                    ]);
                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [removewordembed] }).catch(console.error);
                }
                await interaction.reply({
                    content: `Word \`${word}\` removed.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(`failed to remove word. Reason: ${error}`);
            }
        } else {
            await interaction.reply({
                content: `Word \`${word}\` is not on the list.`,
                ephemeral: true
            });
        }
    }
}