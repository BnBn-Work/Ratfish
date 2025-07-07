//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { check_if_admin, init_new_datafile, parse_json_file } = require("../utils.js")


exports.options = {
    name: "setcategory",
    type: 1,
    description:"Sets which category will be used by the gamesystem",
    options: [{
            "name": "category",
            "description": "The category to use",
            "type": 7,
            "required": true,
        }]
}

exports.run = async function(interaction){
    console.log(interaction)
    if(!fs.existsSync(config.BOTDATA)){
        init_new_datafile()
    }

    if(check_if_admin(interaction.member.id)){
        
        var data = parse_json_file(config.BOTDATA);
        var chan = interaction.options.get("category").channel
        var chanID = interaction.options.get("category").value;
        if(chan.type == 4){ //category
            
            data.category = chanID
            data = JSON.stringify(data);
            fs.writeFileSync(config.BOTDATA,data);
            
            console.log("User "+interaction.member.id+" set the category to "+chanID)
            interaction.reply({content:"Category Set!", ephemeral: false})
        } else {
            console.log("User "+interaction.member.id+" tried to set the category to a non category channel "+chanID)
            interaction.reply({content:"This channel isn't a category!", ephemeral: true})
        }
    } else {
        console.log("Non-admin user "+interaction.member.id+" tried to run "+interaction.commandName)
        interaction.reply({content:"Whoah there, please ask an Admin to do this!", ephemeral: true})
    }
}