const Discord = require("discord.js")
const { Client, MessageActionRow, MessageButton, GatewayIntentBits, MessageType, EmbedBuilder } = require("discord.js")
const fs = require('fs');
const {fetch_prod_guild,init_new_datafile,parse_json_file} = require("./utils.js")
const config = require("./config.json");

const SlashCommandsPath = "./SlashCommands";
const functions = {};

testServer = null;
adminUser = null;

/*
GUILDS
GUILD_MEMBERS
GUILD_BANS
GUILD_EMOJIS_AND_STICKERS
GUILD_INTEGRATIONS
GUILD_WEBHOOKS
GUILD_INVITES
GUILD_VOICE_STATES
GUILD_PRESENCES
GUILD_MESSAGES
GUILD_MESSAGE_REACTIONS
GUILD_MESSAGE_TYPING
DIRECT_MESSAGES
DIRECT_MESSAGE_REACTIONS
DIRECT_MESSAGE_TYPING
GUILD_SCHEDULED_EVENTS
*/
const client = new Client({
    intents: [GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildMessages,GatewayIntentBits.Guilds]
});

client.on("connect", function (){
    console.log("Connected as "+client.user.discriminator)
})

client.on("ready", async function (){
    console.log("Ready as "+client.user.username)
    adminUser = await client.users.fetch(config.ADMIN)
    testServer = await client.guilds.fetch(config.TESTING_SERVER)

    let commands

    if(testServer){
        commands = testServer.commands
    } else {
        commands = client.application.commands
    }

    commands.fetch().then(function(c){
        c.forEach(function(cmd){
            console.log(cmd["name"])
        })
    })
    
    var files = fs.readdirSync(SlashCommandsPath);
    var loadList = [];

    files.forEach(function(file){
        try{
            var command = require("./SlashCommands/"+file);
            loadList.push(command.options);
            functions[command.options.name] = command.run;
        } catch(error){
            console.log("A command failed to load: "+error)
        }  
    })
    commands.set(loadList);
})

client.on("interactionCreate", async function(interaction){
    try {
        if(interaction.isCommand()||interaction.isContextMenu()){
            const {commandName} = interaction
            console.log("command "+commandName)
            try{
                await functions[commandName](interaction);
            } catch(error){
                console.log("Running command "+commandName+" failed: "+error)
                if(interaction.deferred||interaction.replied){
                    interaction.editReply("Something went wrong, please yell at Human")
                } else {
                    interaction.reply("Something went wrong, please yell at Human")
                }
            }
        } 
    } catch (error) {
        console.log(error);
    }
});

client.on("messageCreate",async function(message){
    if(message.webhookId != null) return;
    if(message.author.bot) return;
    
    if(!fs.existsSync(config.BOTDATA)){
        init_new_datafile()
    }

    var data = parse_json_file(config.BOTDATA);
    var g = await client.guilds.fetch(config.PROD_SERVER);
    var cat = await client.channels.fetch(data.category);
    if(message.channel.parentId == cat.id){
        //HIT
        var dt = data.lobby[message.channel.id.toString()] //dt.name dt.avatar
        if(dt != undefined){
            var files = [];
            message.attachments.each((e)=>{files.push(e.url)})
            var embeds = [];

            if(message.type == MessageType.Reply){
                var rply = await message.channel.messages.fetch(message.reference.messageId);         
                var embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    //.setTitle('Replying Too')
                    .setAuthor({ name: rply.author.username, iconURL: "https://cdn.discordapp.com/avatars/"+rply.author.id+"/"+rply.author.avatar+".png"})
                    .setDescription(rply.content)
                
                var attCount = 0;
                rply.attachments.each((e)=>{attCount++})

                if(attCount != 0){
                    embed.setFooter({text: "+ "+attCount+" attachments"})
                }
                embeds.push(embed)
            }
            for(ind in data.lobby){
                var chan = await client.channels.fetch(ind);
                var webhook = await chan.fetchWebhooks()
                webhook = webhook.first()
                
                webhook.send({
                    content: message.content,
                    username: dt.name,
                    avatarURL: dt.avatar,
                    embeds: embeds,
                    files: files
                });
            }
            message.delete()
        }
    }
})

client.login(config.BOT_TOKEN);