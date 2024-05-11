const Insta = require('./insta.js');
const axios = require('axios');
const { performance } = require('perf_hooks');
const client = new Insta.Client();

client.on('connected', () => {
    console.log(`Logged in as ${client.user.username}, Followers: ${client.user.followerCount}`);
});

client.on('pendingRequest', ctx => {
    ctx.approve();
});

client.on('messageDelete', ctx => {
    console.log(`${client.user.username} deleted a message: ${ctx.content}`);
});

client.on('newFollower', ctx => {
    console.log(`You have a new follower`);
});

client.on('messageCreate', async ctx => {
    let text = ctx.content;
    let command = text.split(" ")[0];

    switch (command.toLowerCase()) {
        case '.ping':
            let t0 = performance.now();
            let t1 = performance.now();
            let diff = ((t1 - t0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 3 });
            ctx.reply(`Pong!\nIn ${diff} seconds.`);
            break;
        case '.help':
            ctx.reply('Available Commands:\n .ping .help .google .lirik .p .npm .ssweb');
            break;
        case '.lirik':
            let lyricsResponse = await axios.get(`https://lyrics-api.xlaaf.repl.co/search?q=${text.substring(7)}`);
            ctx.reply(`Found: ${lyricsResponse.data.data}`);
            break;
        case '.google':
            let googleResponse = await axios.get(`https://google-api.xlaaf.repl.co/search?q=${text.substring(8)}`);
            let randomResult = googleResponse.data.data[Math.floor(Math.random() * googleResponse.data.data.length)];
            ctx.reply(`Found: ${text}\n${randomResult.title}\nUrl: ${randomResult.link}\nDescription: ${randomResult.desk}`);
            break;
        // Add more cases for other commands
    }
});

client.login(process.env.username, process.env.password);
