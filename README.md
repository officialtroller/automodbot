# Auto Mod Discord Bot

Source Code for my Auto Mod Discord Bot. For Questions or Bugs join my [Discord Server](https://discord.gg/JFCXza3tnd).

# Usage
1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the neccecary Node.JS Packages.
4. Setup the `.env` correctly with your Server ID, Channel ID for logging, the Bot ID and the Bot token.
5. In `.\src\events\client` check `automod.js` and insert the Role ID's that the bot should ignore, as well as `autoreact.js` where you can setup custom responses of the bot, create small ! commands... and last check `ready.js` and rename your presence for the bot.
6. Run `npm run test` to start the bot.
7. Check if the Bot is online in your Server.