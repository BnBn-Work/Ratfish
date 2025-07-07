//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { check_if_admin, init_new_datafile, parse_json_file, is_valid_url } = require("../utils.js")


exports.options = {
    name: "avatar",
    type: 1,
    description:"updates your avatar, please use a valid link to an image",
    options: [{
            "name": "link",
            "description": "the link to the image you want to use",
            "type": 3,
            "required": true,
        }]
}

exports.run = async function(interaction){
    if(!fs.existsSync(config.BOTDATA)){
        init_new_datafile()
    }
    var data = parse_json_file(config.BOTDATA);
    var cat = await interaction.client.channels.fetch(data.category);
    if(interaction.channel.parentId == cat.id){
        var dt = data.lobby[interaction.channel.id.toString()];
        if(dt != undefined){
            var url = interaction.options.get("link").value;
            console.log(is_valid_url(url))
            if(await is_valid_url(url)){
                dt.avatar = url;
                fs.writeFileSync(config.BOTDATA,JSON.stringify(data));
                console.log("Avatar for "+interaction.member.id+" set to "+dt.avatar);
                interaction.reply({content: "Avatar updated, go test it out!", ephemeral: false});
            } else {
                console.log("Malformed Link");
                interaction.reply({content: "Sorry, the link you gave did not lead to an image!", ephemeral: false});
            }
             
        }
        
    } else {
        console.log("Nickname was attempted to be set outside the lobby by "+interaction.member.id)
        interaction.reply({content:"Please do this from within your lobby!", ephemeral: true})
    }

    
}