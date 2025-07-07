//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { check_if_admin, init_new_datafile, parse_json_file } = require("../utils.js")


exports.options = {
    name: "join",
    type: 1,
    description:"join the ratfish lobby"
}

exports.run = async function(interaction){
    if(!fs.existsSync(config.BOTDATA)){

        init_new_datafile()
    }

    var data = parse_json_file(config.BOTDATA);

    var exists = false;
    for(i in data.lobby){
        if(data.lobby[i].user == interaction.user.id){
            exists = true;
        } 
    }

    if(!exists) {
        var cat = await interaction.guild.channels.fetch(data.category)
        var chan = await cat.children.create({name: interaction.user.username})
        var name = "Unknown Ratfish";
        var avatar = "https://wdfw.wa.gov/sites/default/files/styles/page_body_full_width_4x3_no_crop/public/2019-03/spotted_ratfish.jpg?itok=UWxQ9qyQ"
        var web = await chan.createWebhook({name: name,avatar:avatar})

        chan.permissionOverwrites.create(interaction.member, {ViewChannel: true})
        
        data.lobby[chan.id.toString()] = {user:interaction.user.id, webhook: web.id, name: name, avatar: avatar}
        
        data = JSON.stringify(data);
        fs.writeFileSync(config.BOTDATA,data);
        
        console.log("User "+interaction.member.id+" joined the lobby")
        interaction.reply({content:"Lobby joined!", ephemeral: false})

        await chan.send("Your Ratfish Lobby can be found here! <@"+interaction.user+">")
    } else {

        console.log("User "+interaction.member.id+" tried to join the lobby, but was already in it")
        interaction.reply({content:"You're aleady in this lobby!", ephemeral: true})
    }
    
}