const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick').setDescription('Kick a Member.')
        .addUserOption(option => option.setName('user').setDescription('The User You want to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking (optional)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction, client) {
        const user = await interaction.options.getUser("user");
        let reason = await interaction.options.getString("reason");
        if (!reason) reason = "No Reason given";
        try {
            if (user === interaction.user) return interaction.reply({ content: `you cant kick yourself`, ephemeral: true })
            const member = await interaction.guild.members.fetch(user.id).catch(console.error);
            await member.kick({ reason: reason });
            await interaction.reply({
                content: `Kicked **${user.tag}**`,
                ephemeral: true
            });
            const kickembed = new EmbedBuilder()
                .setColor(client.kickcolor).setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                }).setThumbnail(user.displayAvatarURL()).addFields([
                    {
                        name: `**👢Kicked** ${user.tag} (ID ${user.id})`,
                        value: `**📄Reason:** "${reason}"`
                    }
                ]);
            let logChannel;
            if (interaction.guild.id === process.env.ZMLServerid) {
                logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
            } else if (interaction.guild.id === process.env.MyServerid) {
                logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
            }
            if (logChannel) {
                await logChannel.sendTyping();
                await logChannel.send({ embeds: [kickembed] }).catch(console.error);
            }
        } catch (error) {
            console.error(error);
        }
    }
};