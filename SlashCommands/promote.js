//const {MessageActionRow, MessageButton } = require("discord.js")
const fs = require('fs');
const config = require("../config.json");
const { init_new_datafile } = require("../utils.js")
exports.options = {
    name: "promote",
    type: 2
}

exports.run = async function(interaction){
    if(interaction.member.id == config.ADMIN){
        if(!fs.existsSync(config.BOTDATA)){
            init_new_datafile()
        }
    
        fs.readFile(config.BOTDATA, function(err, data) { 

            if (err) throw err; 

            var jsonData = JSON.parse(data); 
            var exists = false;

            for(var i = 0; i<jsonData.admins.length;i++){
                if(jsonData.admins[i] == interaction.targetId){
                    exists = true
                }
            }
            
            if(!exists){
                jsonData.admins.push(interaction.targetId)
                console.log("Promoted "+interaction.targetId+" to admin");
                interaction.reply({content:"Promoted!",ephemeral:false})
            } else {
                console.log("Tried to promote a user who was already an admin! "+interaction.targetId);
                interaction.reply({content:"This user is already an admin!",ephemeral:true})
            }

            jsonData = JSON.stringify(jsonData)
            fs.writeFileSync(config.BOTDATA,jsonData);
        });
    } else {
        console.log("Invalid user "+interaction.member.id+" tried to promote "+interaction.targetId)
        interaction.reply({content:"Whoah there, please ask Ben to do this", ephemeral: true})
    }
}