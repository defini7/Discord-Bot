const Discord = module.require("discord.js");
const profile = require('../profile.json');
module.exports.run = async(bot, message, args) => {
    try {
        if (!message.member.hasPermission("BAN_MEMBERS")) message.channel.send("You don't have permission.");
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        let reason = message.guild.members.cache.get(args[1]);

        if (!rUser) return message.channel.send("Invalid user ID");

        message.guild.member(rUser).ban(reason);
        
        delete(profile[rUser.id]);

        let embed = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setDescription("Ban")
        .addField("Administrator", message.author.username)
        .addField("Banned", rUser.user.username)
        .addField(`Reason: ${reason}`);
        message.channel.send(embed);

    } catch(error) {
        // name, message, stack
        console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
    }    
};
module.exports.help = {
    name: "ban"
}