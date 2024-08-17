const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban').setDescription('Unban a Member.')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the User You want to unban.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const userid = await interaction.options.getString("userid");
        const user = await client.users.fetch(userid);
        if (user === interaction.user) return interaction.reply({ content: `bro tries to unban himself`, ephemeral: true });
        const fetched = await interaction.guild.bans.fetch(userid);
        if (fetched) {
            try {
                await interaction.guild.bans.remove(userid);
                await interaction.reply({
                    content: `<@${userid}> (ID ${userid}) has been unbanned.`,
                    ephemeral: true
                });
                let logChannel;
                if (interaction.guild.id === process.env.ZMLServerid) {
                    logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
                } else if (interaction.guild.id === process.env.MyServerid) {
                    logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
                }
                const unbanembed = new EmbedBuilder()
                    .setColor(client.bancolor).setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: `${interaction.user.tag} (ID ${interaction.user.id})`
                    }).setThumbnail(user.displayAvatarURL()).addFields([
                        {
                            name: `**⚠️Ban got revoken from**:`,
                            value: `${user} (ID ${userid})`
                        }
                    ]);
                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [unbanembed] }).catch(console.error);
                }
            } catch (error) {
                console.error(`Failed to kick user ${user}: ${error}`);
            }
        } else {
            await interaction.reply({
                content: `Did not find this User ID in the ban list.`,
                ephemeral: true
            });
        }
    }
};