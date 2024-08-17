const { EmbedBuilder } = require('discord.js');

const ignoredroles = [
    //insert here role ids that the bot ignores
    '',
]
module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        function findBlockedWord(content) {
            return client.blockedWords.find(word => content.toLowerCase().includes(word));
        }
        function findBlockedRegex(content) {
            return client.blockedRegexes.find(regex => new RegExp(regex).test(content.toLowerCase()));
        }
        if (message.author.bot) return;
        const member = await message.guild.members.fetch(message.author.id);
        const user = message.author;
        if (member.roles.cache.some(role => ignoredroles.includes(role.id))) return;
        let logChannel;
        if (message.guild.id === process.env.ZMLServerid) {
            logChannel = await client.channels.fetch(process.env.ZMLlogchannel).catch(() => null);
        } else if (message.guild.id === process.env.MyServerid) {
            logChannel = await client.channels.fetch(process.env.Mylogchannel).catch(() => null);
        }
        const blockedword = findBlockedWord(message.content);
        if (blockedword) {
            await message.delete();
            const reason = `The word \`${blockedword}\` is banned, watch your language.`;

            try {
                await member.kick(reason);
                const automodembed = new EmbedBuilder()
                    .setColor(client.kickcolor)
                    .setAuthor({
                        iconURL: client.user.displayAvatarURL(),
                        name: `${client.user.tag} (ID ${client.user.id})`
                    })
                    .setThumbnail(user.displayAvatarURL())
                    .addFields([
                        {
                            name: `**👢Kicked** ${user.tag} (ID ${user.id})`,
                            value: `**📄Reason:** "${reason}"`
                        }
                    ]);

                if (logChannel) {
                    await logChannel.sendTyping();
                    await logChannel.send({
                        embeds: [automodembed]
                    });
                }
            } catch (error) {
                console.error(`Failed to kick user ${user.tag}: ${error}`);
            }
        }
        const blockedregex = findBlockedRegex(message.content);
        if (blockedregex) {
            const regex = new RegExp(blockedregex);
            const match = regex.exec(message.content);
            if (match) {
                const blockedpart = match[0];
                await message.delete();
                const reason = `\`${blockedpart}\` is banned, watch your language.`;

                try {
                    await member.kick(reason);
                    const automodembed = new EmbedBuilder()
                        .setColor(client.kickcolor)
                        .setAuthor({
                            iconURL: client.user.displayAvatarURL(),
                            name: `${client.user.tag} (ID ${client.user.id})`
                        })
                        .setThumbnail(user.displayAvatarURL())
                        .addFields([
                            {
                                name: `**👢Kicked** ${user.tag} (ID ${user.id})`,
                                value: `**📄Reason:** "${reason}"`
                            }
                        ]);

                    if (logChannel) {
                        await logChannel.sendTyping();
                        await logChannel.send({
                            embeds: [automodembed]
                        });
                    }
                } catch (error) {
                    console.error(`Failed to kick user ${user.tag}: ${error}`);
                }
            }
        }
    },
};