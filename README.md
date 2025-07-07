# Ratfish: Discord

In Ratfish, all players will be speaking through secret personas they have created for themselves. They will do their best to try and guess who is who.
The game, and all associated twists to keep it interesting are facilitated by its Gamemaster.
This bot is simply a tool to allow for an easy to use and real time anonymous chat allowing for fully customizeable profiles and support for most Discord features.

Note:
To hide all traceable activity, the bot makes a unique channel hidden to all but its specific user.
For this reason, anyone with Admin permisions in that Discord server will have the illusion broken, as channels cannot be hidden from them.

## Configuration
You will be required to add the file: config.json and fill out the following JSON attributes.

"BOT_TOKEN": The token for the discord bot you intend to use formatted as a String

"TESTING_SERVER": The Discord Server ID for the server you would like to host your game on formatted as a String

"ADMIN": The Discord User ID for the user account you want to have authority over the bot

"BOTDATA": The local path that the bot should save all relevant info to, E.G "data.json"

## Use
Right clicking on a user and selecting Promote will add them to the list of users whom can control the bot.

### Admin only commands
/clearlobby removes all users from the lobby

/setcategory updates the parent category for all lobby channels

### User Commands
/join adds the calling user to the lobby

/nickname (Nickname) sets the calling users secret nickname !THIS MUST BE DONE INSIDE THEIR LOBBY CHANNEL!

/avatar (image URL) sets the calling users secret avatar to the image that said URL resolves to !THIS MUST BE DONE INSIDE THEIR LOBBY CHANNEL! 
