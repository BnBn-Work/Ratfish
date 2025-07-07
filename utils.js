const fs = require('fs');
const config = require("./config.json");

function parse_json_file(path){
    var data = fs.readFileSync(path);
    data = JSON.parse(data);
    return(data);
}
exports.parse_json_file = parse_json_file

exports.check_if_admin = function(id){
    var data = parse_json_file(config.BOTDATA);
    var found = false;

    data.admins.forEach(element => {
        if(element == id){
            found = true;
        }
    });

    return(found);
}

exports.init_new_datafile = function(){
    var data = {
        admins: [],
        lobby: {},
        category: "",
        inprogress: false
    }
    data = JSON.stringify(data);
    fs.writeFileSync(config.BOTDATA,data)
}

exports.fetch_prod_guild = function(interaction){
    return (interaction.client.user.guilds.fetch(config.PROD_SERVER))
}

exports.is_valid_url = function(url){
    var rtn = false;
    try {
        rtn = fetch(url, {method: 'HEAD'}).then(res => {
            return res.headers.get('Content-Type').startsWith('image')
        }).catch((err)=>{return false});
        return rtn;
    } catch(err) {
        return false;
    }
}