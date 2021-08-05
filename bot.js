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

// reading commands from commands folder
fs.readdir('./commands/', (err, files) => {
    // if there is error, then it prints in console
    if (err) console.log(err);
    // all files in commands folder
    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    // if there is no files(commands), then it prints in console
    if (jsFiles.length <= 0) console.log("There are no commands to upload!");
    // info about how many commands was uploaded
    console.log(`${jsFiles.length} command(s) were(was) uploaded`);
    // find and set command
    jsFiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}. ${f} Uploaded!`);
        bot.commands.set(props.help.name, props);
    })
});

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
    // it's command
    let cmd = bot.commands.get(command.slice(prefix.length));
    // start command
    if (cmd) cmd.run(bot, message, args);
});

bot.login(token);