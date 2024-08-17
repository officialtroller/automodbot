const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addregex').setDescription('Add a regex to the bots blocklist.')
        .addStringOption((option) => option.setName('regex').setDescription('The Regex you want to add').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction, client) {
        const regex = interaction.options.getString('regex');
        if (!client.blockedRegexes.includes(regex)) {
            try {
                client.blockedRegexes.push(regex);
                fs.appendFileSync("blocked_regex.txt", regex + `\n`);
                let logChannel;
                if (interaction.guild.id === process.env.ZMLServerid) {
                    logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
                } else if (interaction.guild.id === process.env.MyServerid) {
                    logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
                }
                const addregexembed = new EmbedBuilder()
                    .setColor(client.moderationcolor).setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: `${interaction.user.tag} (ID ${interaction.user.id})`
                    }).setThumbnail(client.user.displayAvatarURL()).addFields([
                        {
                            name: `**♾️Regex added to the BlackList:**`,
                            value: `${interaction.user.tag} added \`${regex}\``
                        }
                    ]);
                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [addregexembed] }).catch(console.error);
                }
                await interaction.reply({
                    content: `Regex \`${regex}\` added.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(`Failed to add Regex. Reason: ${error}`);
            }
        } else {
            await interaction.reply({
                content: `Regex \`${regex}\` is already on the list.`,
                ephemeral: true
            });
        }
    }
}