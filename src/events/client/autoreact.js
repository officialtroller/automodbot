module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        const massage = message.content.toLowerCase();
        //Example Usage
        if (massage.startsWith(`Hello`)) {
            await message.channel.sendTyping();
            await message.reply(`Hello There :)`)
        }
        if (massage.startsWith('!this_is_command')) {
            await message.channel.sendTyping();
            await message.channel.send('Indeed this is a custom `!` Command.')
        }
    },
};