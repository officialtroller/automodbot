# Auto Mod Discord Bot

Source Code for my Auto Mod Discord Bot. For Questions or Bugs join my [Discord Server](https://discord.gg/JFCXza3tnd).

I am mod in a discord server and noticed this server has some small issues with automated moderating so i sat down and started coding in one file a simple auto mod discord bot where every other moderator can add things to the blacklist through commands that we dont need a website or something else to setup the bot. Later on the bot became so advanced that i added proper handlers to the bot and so this bot got created.

# Usage
1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the neccecary Node.JS Packages.
4. Setup the `.env` correctly with your Server ID, Channel ID for logging, the Bot ID and the Bot token.
5. In `.\src\events\client` check `automod.js` and insert the Role ID's that the bot should ignore, as well as `autoreact.js` where you can setup custom responses of the bot, create small ! commands... and last check `ready.js` and rename your presence for the bot.
6. Run `npm run test` to start the bot.
7. Check if the Bot is online in your Server.

# Commands
* `/ban` the normal ban command.
* `/kick` the normal kick command.
* `/timeout` this command times out and untimes out. the time must be specified in hours, so if you want to mute someone for 2 days you have to use 42. To unmute you simply just run the command again without specifying the reason and duration.
* `/unban` needs the user id of the user you want to unban.
* `/addword` adds a word to the blacklist.
* `/removeword` removes a specific word from the blacklist.
* `/addregex` <a id="important">This is an advanced Command.</a> You can use regexes as well to block specific things. For example `discord(?:.com|app.com|.gg)[/invite/]?(?:[a-zA-Z0-9-]{2,32})` blocks every single type of discord invite links.
* `/removeregex` removes a specific regex from the blacklist
* `/viewblocklist` lets you view your current setup of you blacklist with your regexes and words.
