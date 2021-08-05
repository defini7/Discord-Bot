const Discord = module.require("discord.js");
const fs = require('fs');
const profile = require('../profile.json');
module.exports.run = async(bot, message, args) => {
    try {
        if (!message.member.hasPermission("BAN_MEMBERS")) message.channel.send("You don't have permission.");
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));

        if (!rUser) return message.channel.send("Invalid user ID");

        if (profile[rUser.id].warns <= 0) return message.channel.send("This user has already 0 warns.");
        else profile[rUser.id].warns--;
        
        fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
            if (err) console.log(err);
        });

        let embed = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setDescription("Warn")
        .addField("Administrator", message.author.username)
        .addField("Take warn from", rUser.user.username)
        .addField(`Amount of warns: ${profile[rUser.id].warns}/3`);
        message.channel.send(embed);

    } catch(error) {
        // name, message, stack
        console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
    }    
};
module.exports.help = {
    name: "unwarn"
}