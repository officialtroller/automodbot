const { REST, Routes } = require('discord.js');

const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.js'));
            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command ${command.data.name} has passed.`)
            }
        }
        const rest = new REST().setToken(process.env.token);
        try {
            console.log(`Attempting to register ${client.commandArray.length} commands...`);
            console.log(`BotID: ${process.env.BotID}, ServerID: ${process.env.MyServerid}`);

            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.BotID, process.env.MyServerid), {
                    body: client.commandArray
                }
            );

            console.log(`Successfully registered ${data.length} application (/) commands in guild ${process.env.MyServerid}.`);
        } catch (error) {
            console.error("Error registering commands:", error);
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
        }
    }
}