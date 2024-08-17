const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Mute/Unmute a User. This command allows you to mute and unmute.')
        .addUserOption(option => option.setName('user').setDescription('The User You want to mute/unmute.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('REASON FOR MUTING ONLY!!'))
        .addIntegerOption(option => option.setName('duration').setDescription('Duration for muting in hours (FOR MUTING ONLY!!)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction, client) {
        const user = interaction.options.getUser("user");
        let reason = interaction.options.getString("reason") || "No Reason given";
        let time = interaction.options.getInteger("duration");
        try {
            if (user === interaction.user) return interaction.reply({ content: `you cant timeout yourself`, ephemeral: true })
            const member = await interaction.guild.members.fetch(user.id);

            if (time) {
                const timeoutDuration = time * 60 * 60 * 1000;
                await member.timeout(timeoutDuration, reason);
                await interaction.reply({
                    content: `Muted **${user.tag}** for ${time} hour(s).\nReason: ${reason}`,
                    ephemeral: true
                });
            } else {
                if (member.communicationDisabledUntil) {
                    await member.timeout(null, reason);
                    await interaction.reply({
                        content: `Unmuted **${user.tag}**`,
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: `**${user.tag}** is not currently muted.`,
                        ephemeral: true
                    });
                    return;
                }
            }

            let logChannel;
            if (interaction.guild.id === process.env.ZMLServerid) {
                logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
            } else if (interaction.guild.id === process.env.MyServerid) {
                logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
            }
            const unmuteembed = new EmbedBuilder()
                .setColor(client.timeoutcolor).setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                }).setThumbnail(user.displayAvatarURL()).addFields([
                    {
                        name: `**⏱Timed out removed**`,
                        value: `${user.tag} (ID ${user.id})`
                    }
                ]);
            const muteembed = new EmbedBuilder()
                .setColor(client.timeoutcolor).setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                }).setThumbnail(user.displayAvatarURL()).addFields([
                    {
                        name: `**⏱Timed out** ${user.tag} (ID ${user.id})`,
                        value: `**Duration**: ${time} hours`
                    },
                    {
                        name: `**📄Reason:**`,
                        value: `"${reason}"`
                    }
                ]);

            if (logChannel) {
                if (time) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [muteembed] }).catch(console.error);
                } else if (!member.communicationDisabledUntil) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [unmuteembed] }).catch(console.error);
                }
            }
        } catch (error) {
            console.error('Error in timeout command:', error);
            await interaction.reply({
                content: `Failed to ${time ? 'mute' : 'unmute'} ${user.tag}. Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};