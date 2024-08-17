const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban').setDescription('Ban a Member.')
        .addUserOption(option => option.setName('user').setDescription('The User You want to ban.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for banning (optional)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        const user = await interaction.options.getUser("user");
        let reason = await interaction.options.getString("reason");
        if (!reason) reason = "No Reason given";
        let logChannel;
        if (interaction.guild.id === process.env.ZMLServerid) {
            logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
        } else if (interaction.guild.id === process.env.MyServerid) {
            logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
        }
        try {
            if (user === interaction.user) return interaction.reply({content: `you cant ban yourself`, ephemeral:true})
            await interaction.guild.members.ban(user.id, { reason: reason });
            await interaction.reply({
                content: `Banned **${user.tag}**`,
                ephemeral: true
            });
            const banembed = new EmbedBuilder()
                .setColor(client.bancolor).setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: `${interaction.user.tag} (ID ${interaction.user.id})`
                }).setThumbnail(user.displayAvatarURL()).addFields([
                    {
                        name: `**🔨Banned** ${user.tag} (ID ${user.id})`,
                        value: `**📄Reason:** "${reason}"`
                    }
                ]);

            if (logChannel) {
                await logChannel.sendTyping();
                await logChannel.send({ embeds: [banembed] }).catch(console.error);
            }
        } catch (error) {
            console.error(`Failed to ban user ${user.tag}: ${error}`);
        }
    }
};