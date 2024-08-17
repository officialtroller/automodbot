const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addword').setDescription('Add a word to the bots blocklist.')
        .addStringOption((option) => option.setName('word').setDescription('The Word you want to add').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction, client) {
        const word = interaction.options.getString('word').toLowerCase();
        if (!client.blockedWords.includes(word)) {
            try {
                client.blockedWords.push(word);
                fs.appendFileSync("blocked_words.txt", `${word}\n`);
                let logChannel;
                if (interaction.guild.id === process.env.ZMLServerid) {
                    logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
                } else if (interaction.guild.id === process.env.MyServerid) {
                    logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
                }
                const addwordembed = new EmbedBuilder()
                    .setColor(client.moderationcolor).setAuthor({
                        iconURL: interaction.user.displayAvatarURL(),
                        name: `${interaction.user.tag} (ID ${interaction.user.id})`
                    }).setThumbnail(client.user.displayAvatarURL()).addFields([
                        {
                            name: `**Word added to the BlackList:**`,
                            value: `${interaction.user.tag} added \`${word}\``
                        }
                    ]);
                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({ embeds: [addwordembed] }).catch(console.error);
                }
                await interaction.reply({
                    content: `Word \`${word}\` added.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(`Failed to add Word to the Blacklist. Error: ${error}`);
            }
        } else {
            await interaction.reply({
                content: `Word \`${word}\` is already on the list.`,
                ephemeral: true
            });
        }
    }
}