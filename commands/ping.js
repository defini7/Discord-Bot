const Discord = module.require("discord.js");
const fs = require("fs");
module.exports.run = async(bot, message, args) => {
    message.channel.send(`Ping is ${Date.now() - message.createdTimestamp}ms (${message.author.username}).`);
};
module.exports.help = {
    name: "ping"
}