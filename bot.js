// include discord.js library
const Discord = module.require('discord.js');
// our bot
const bot = new Discord.Client();
// new collection of bot
bot.commands = new Discord.Collection();
// include fs
const fs = require('fs');
// import our bot config (was taken from discord.com/developers/applications)
let config = require('./bot-config.json');
// token of our bot
let token = config.token;
// prefix (a symbol with which all bot commands begin)
let prefix = config.prefix;
// profile of person
let profile = require('./profile.json');
// logs
let logs = './logs.log';

let warnsToBan = 100;

let embed;

function warnLog(authorId, rUser) {
    fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} warned ${rUser}`);
}

function banLog(authorId, rUser, reason) {
    fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} banned ${rUser} | Reason: ${reason}`);
}

function errorLog(typeError, errorText) {
    fs.appendFileSync(logs, `\nERROR | ${Date.now()} | ${typeError} ${errorText}`);
}

function unwarnLog(authorId, rUser) {
    fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} unwarned ${rUser}`);
}

bot.on('ready', () => {
  console.log(`${bot.user.username} was started`);
  // comment 2 lines if this bot is already on your server
  bot.generateInvite(['ADMINISTRATOR']).then(link => {
      console.log(link);
  })
});

bot.on('message', async message => {
    // if message's author is a bot then do nothing
    if (message.author.bot) return;
    // if someone want to connect with bot in pm, then ignore this person
    if (message.channel.type == "dm") return;
    // author of message
    let authorName = message.author.username;
    // id of message author
    let authorId = message.author.id;
    // 
    if (!profile[authorId]) {
        profile[authorId] = {
            coins: 0,
            warns: 0,
            hours: 0,
        }
    }
    fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
        if (err) console.log(err);
    });
    let a = profile[authorId];
    a.coins++;
    // each word or symbol of message, like: Hello friend - {"Hello", "friend"}
    let messageArray = message.content.split(" ");
    // user command
    let command = messageArray[0].toLowerCase();
    // count of arguments instead of command
    let args = messageArray.slice(1);
    // if command start not with prefix(!) then it does nothing
    if (!message.content.startsWith(prefix)) return;

    // start command
    switch (command) {
        case '!ban':
            try {
                if (!message.member.hasPermission("BAN_MEMBERS")) {
                    message.channel.send("You don't have permission.");
                    break;
                }

                let rUser = message.guild.member(message.mentions.users.first() || args[0]);
                let reason = args[1];
        
                if (!rUser) {
                    message.channel.send("Invalid user ID"); 
                    break;
                }
        
                message.guild.member(rUser).ban(reason);
                
                delete(profile[rUser.id]);
        
                embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setDescription("Ban")
                .addField("Administrator", message.author.username)
                .addField("Banned", rUser.user.username)
                .addField(`Reason: ${reason}`);

                message.channel.send(embed);

                banLog(authorId, rUser, reason);
        
            } catch(error) {
                // name, message, stack
                console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
                errorLog(error.name, error.message);
            }    
            break;

        case '!warn':
            try {
                if (!message.member.hasPermission("BAN_MEMBERS")) {
                    message.channel.send("You don't have permission.");
                    break;
                }

                let rUser = message.guild.member(message.mentions.users.first() || args[0]);
        
                if (!rUser) {
                    message.channel.send("Invalid user ID");
                    break;
                } 
        
                profile[rUser.id].warns++;
                fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
                    if (err) console.log(err);
                });
        
                if (profile[rUser.id].warns >= warnsToBan) {
                    message.guild.member(rUser).ban(`${profile[rUser.id].warns}/${warnsToBan}`);
                    banLog(authorId, rUser, "${warnsToBan}/${warnsToBan} warns");
                }
        
                embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setDescription("Warn")
                .addField("Administrator", message.author.username)
                .addField("Gave warn to", rUser.user.username)
                .addField(`Amount of warns: ${profile[rUser.id].warns}/${warnsToBan}`);
                message.channel.send(embed);
                warnLog(authorId, rUser);
        
            } catch(error) {
                // name, message, stack
                console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
                errorLog(error.name, error.message);
            }
            break;

        case '!unwarn':
            try {
                if (!message.member.hasPermission("BAN_MEMBERS")) {
                    message.channel.send("You don't have permission.");
                    break;
                }

                let rUser = message.guild.member(message.mentions.users.first() || args[0]);
        
                if (!rUser) { 
                    message.channel.send("Invalid user ID"); 
                    break; 
                } 
        
                if (profile[rUser.id].warns <= 0) {
                    message.channel.send("This user has already 0 warns.");
                    break;
                } 
                else profile[rUser.id].warns--;
                
                fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
                    if (err) console.log(err);
                });
        
                embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setDescription("Warn")
                .addField("Administrator", message.author.username)
                .addField("Take warn from", rUser.user.username)
                .addField(`Amount of warns: ${profile[rUser.id].warns}/${warnsToBan}`);

                message.channel.send(embed);

                unwarnLog(authorId, rUser);
        
            } catch(error) {
                // name, message, stack
                console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
                errorLog(error.name, error.message);
            }    
            break;

        case '!ping':
            message.channel.send(`Ping is ${Date.now() - message.createdTimestamp}ms (${message.author.username}).`);
            fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} want to know ping`);
            break;

        /*case '!mute':
            try {
                let rUser = message.guild.member(message.mentions.users.first() || args[0]);
                let muterole = message.guild.roles.cache.find(role => role.name == "Muted");
                rUser.roles.add(muterole);
                embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setDescription("Mute")
                .addField("Administrator", message.author.username)
                .addField("Muted", rUser.user.username);
                message.channel.send(embed);
                fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} muted ${rUser}`);
            }
            catch(error) {
                console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
                errorLog(error.name, error.message);
            }
            break;
        
        case '!unmute':
            try {
                let rUser = message.guild.member(message.mentions.users.first() || args[0]);
                let muterole = message.guild.roles.cache.find(role => role.name == "Muted");
                rUser.roles.remove(muterole);
                embed = new Discord.MessageEmbed()
                .setColor('#7289da')
                .setDescription("Unmute")
                .addField("Administrator", message.author.username)
                .addField("Unmuted", rUser.user.username);
                message.channel.send(embed);
                fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} unmuted ${rUser}`);
            }
            catch(error) {
                console.log(`1. ${error.name}\n2. ${error.message}\n3. ${error.stack}`);
                errorLog(error.name, error.message);
            }
            break;*/

        case '!clear':
            try {
                if (!message.member.hasPermission("MANAGE_MESSAGES")) {
                    message.channel.send("You don't have permissions!");
                    break;
                }

                if (args[0] > 100 || args[0] < 1) {
                    message.channel.send("You can't delete more than 100 messages or less than 1.");
                    break;
                }

                if (!args[0]) {
                    message.channel.send("There is no pointer to amount of messages to delete.");
                    break;
                }

                message.channel.bulkDelete(args[0]).then(() => {
                    bot.send(`${args[0]} messages was deleted!`);
                });
            }
            catch(error) {
                message.channel.send("Can't delete messages, which are more than 14 days");
                errorLog(error.name, error.message);
            }

            fs.appendFileSync(logs, `\nINFO | ${Date.now()} | ${authorId} deleted ${args[0]} last messages`);
            break;

        case '!serverinfo':
            embed = new Discord.MessageEmbed()
            .setColor('#7289da')
            .setDescription("Server Info")
            .addField("Server name is ", message.guild.name)
            .addField("Server exists since ", message.guild.createdAt)
            .addField("You are on this server since ", message.guild.joinedAt)
            .addField("Amount of members is ", message.guild.memberCount)
            .addField("Region is ", message.guild.region)
            .setThumbnail(message.guild.iconURL);

            message.channel.send(embed);

            break;

        case '!userinfo':
            let user = args[0];

            if (!user) {
                user = authorId;
            }
            
            embed = new Discord.MessageEmbed()
            .setColor('#7289da')
            .setDescription("User Info")
            .addField("User name is ", user.username)
            .addField("User tag is ", user.tag)
            .addField("Discriminator ", user.discriminator)
            .addField("User exists since ", user.createdAt)
            .addField("User ID is ", user.id)
            .addField("It's is ", user.bot)
            .setThumbnail(message.guild.iconURL);

            message.channel.send(embed);

            break;

        default:
            message.channel.send("This command doesn't exist");
    }
});

bot.login(token);