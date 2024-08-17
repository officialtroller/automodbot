const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewblocklist')
        .setDescription('Sends a full List of the current Blacklist.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction, client) {
        let logChannel;
        if (interaction.guild.id === process.env.ZMLServerid) {
            logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
        } else if (interaction.guild.id === process.env.MyServerid) {
            logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
        }

        let hasContent = false;

        if (client.blockedWords && client.blockedWords.length > 0) {
            const blocklistembed = new EmbedBuilder()
                .setColor(client.moderationcolor)
                .setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                })
                .setThumbnail(client.user.displayAvatarURL())
                .addFields([
                    {
                        name: `Current Blacklist:`,
                        value: `\`\`\`\n${client.blockedWords.join(", ")}\n\`\`\``
                    }
                ]);

            if (logChannel) {
                await logChannel.sendTyping();
                await logChannel.send({ embeds: [blocklistembed] }).catch(console.error);
                hasContent = true;
            }
        }

        if (client.blockedRegexes && client.blockedRegexes.length > 0) {
            const regexEmbed = new EmbedBuilder()
                .setColor(client.moderationcolor)
                .setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                })
                .setThumbnail(client.user.displayAvatarURL())
                .addFields([
                    {
                        name: `Current Regexes:`,
                        value: `\`\`\`\n${client.blockedRegexes.join("\n")}\n\`\`\``
                    }
                ]);

            if (logChannel) {
                await logChannel.sendTyping();
                await logChannel.send({ embeds: [regexEmbed] }).catch(console.error);
                hasContent = true;
            }
        }

        if (hasContent) {
            await interaction.reply({ content: `Blacklist sent to <#${logChannel.id}>`, ephemeral: true });
        } else {
            await interaction.reply({ content: `There are no words or regexes in the blocklist.`, ephemeral: true });
        }
    }
};