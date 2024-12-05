const { ActivityType } = require("discord.js");
module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // Edit your Presence here!
        client.user.setPresence({
            activities: [
                {
                    name: "Example Presence",
                    type: ActivityType.Playing,
                },
            ],
            status: "online",
        });
        console.log(`%cReady!!! ${client.user.tag} is logged in and online.`, "color: #00ff00");
    },
};
