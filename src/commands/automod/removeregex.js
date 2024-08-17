const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeregex').setDescription('Remove a regex to the bots blocklist.')
        .addStringOption((option) => option.setName('regex').setDescription('The Regex you want to remove').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction, client) {
        const regex = interaction.options.getString('regex');
        if (client.blockedRegexes.includes(regex)) {
            try {
                client.blockedRegexes = client.blockedRegexes.filter(w => w !== regex);
                fs.writeFileSync("blocked_regex.txt", client.blockedRegexes.join('\n'));
                let logChannel;
                if (interaction.guild.id === process.env.ZMLServerid) {
                    logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
                } else if (interaction.guild.id === process.env.MyServerid) {
                    logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
                }
                const removeregexembed = new EmbedBuilder()
                    .setColor(client.moderationcolor).setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: `${interaction.user.tag} (ID ${interaction.user.id})`
                    }).setThumbnail(client.user.displayAvatarURL()).addFields([
                        {
                            name: `**♾️Regex removed from the BlackList:**`,
                            value: `${interaction.user.tag} removed \`${regex}\``
                        }
                    ]);
                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [removeregexembed] }).catch(console.error);
                }
                await interaction.reply({
                    content: `Regex \`${regex}\` removed.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(`Failed to remove Regex. Reason: ${error}`);
            }
        } else {
            await interaction.reply({
                content: `Regex \`${regex}\` is not on the list.`,
                ephemeral: true
            });
        }
    }
}