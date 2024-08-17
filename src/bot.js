require("dotenv").config();
const { token } = process.env;
const { Client, Collection } = require("discord.js");
const fs = require("fs");


const client = new Client({ intents: 3276799 });
client.commands = new Collection();
client.commandArray = [];
client.kickcolor = 0xD99A2D;
client.bancolor = 0xE65D5D;
client.timeoutcolor = 0xA06FBE;
client.moderationcolor = 0xD0EB06;
client.blockedWords = fs.readFileSync("blocked_words.txt", "utf-8").split("\n").filter(Boolean);
client.blockedRegexes = fs.readFileSync("blocked_regex.txt", "utf-8").split("\n").filter(Boolean);

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}


client.handleEvents();
client.handleCommands();
client.login(token);