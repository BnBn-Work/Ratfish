//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { check_if_admin, init_new_datafile, parse_json_file } = require("../utils.js")


exports.options = {
    name: "nickname",
    type: 1,
    description:"updates your nickname",
    options: [{
            "name": "nickname",
            "description": "the category to use",
            "type": 3,
            "required": true,
        }]
}

exports.run = async function(interaction){
    console.log(interaction)
    if(!fs.existsSync(config.BOTDATA)){
        init_new_datafile()
    }
    var data = parse_json_file(config.BOTDATA);
    var cat = await interaction.client.channels.fetch(data.category);
    if(interaction.channel.parentId == cat.id){
        var dt = data.lobby[interaction.channel.id.toString()];
        if(dt != undefined){
            dt.name = interaction.options.get("nickname").value
        }
        console.log("Nickname for "+interaction.member.id+" set to "+dt.name);
        interaction.reply({content: "nickname updated, go test it out!", ephemeral: false});
    } else {
        console.log("Nickname was attempted to be set outside the lobby by "+interaction.member.id)
        interaction.reply({content:"Please do this from within your lobby!", ephemeral: true})
    }

    fs.writeFileSync(config.BOTDATA,JSON.stringify(data));
}