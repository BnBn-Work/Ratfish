//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { check_if_admin, init_new_datafile, parse_json_file,fetch_prod_guild } = require("../utils.js")


exports.options = {
    name: "clearlobby",
    type: 1,
    description:"Removes all players from the ratfish lobby"
}

exports.run = async function(interaction){
    if(!fs.existsSync(config.BOTDATA)){
        init_new_datafile()
    }

    if(check_if_admin(interaction.member.id)){
        
        var data = parse_json_file(config.BOTDATA);

        Object.keys(data.lobby).forEach(async function(element){
            console.log(element);
            var chan = await interaction.client.channels.fetch(element);
            chan.delete()
        });

        data.lobby = {};
        data = JSON.stringify(data);
        fs.writeFileSync(config.BOTDATA,data);
        
        console.log("User "+interaction.member.id+" cleared the lobby")
        interaction.reply({content:"Lobby cleared!", ephemeral: false})

    } else {
        console.log("Non-admin user "+interaction.member.id+" tried to run "+interaction.commandName)
        interaction.reply({content:"Whoah there, please ask an Admin to do this!", ephemeral: true})
    }
}