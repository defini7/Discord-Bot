const Discord = module.require("discord.js");
const fs = require('fs');
const profile = require('../profile.json');
module.exports.run = async(bot, message, args) => {
    try {
        if (!message.member.hasPermission("BAN_MEMBERS")) message.channel.send("You don't have permission.");
        let rUserID = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        if (!rUserID) return message.channel.send("Invalid user ID");

        profile[rUser.id].warns++;
        fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
            if (err) console.log(err);
        });

        if (profile[rUser.id].warns >= 3) {
            message.guild.member(rUser).ban("3/3 warns.");
        }

        let embed = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setDescription("Warn")
        .addField("Administrator", message.author.username)
        .addField("Gave warn to", rUser.user.username)
        .addField(`Amount of warns: ${profile[rUser.id].warns}/3`);
        message.channel.send(embed);

    } catch(error) {
        // name, message, stack
        console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
    }    
};
module.exports.help = {
    name: "warn"
}