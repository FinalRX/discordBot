const Config = require('./config');
const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

var ready = false

const Mods = Config.discord.mods

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: '9' }).setToken(Config.discord.token);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  ready = true
});

module.exports = {
  sendMessageToAll: function (data) {
    if (ready) {
      const MutenLiveEmbed = new EmbedBuilder()
        .setTitle(data.title)
        .setColor(0x674ea7)
        .setAuthor({ name: data.user_name, iconURL: data.profile_image_url, url: `https://www.twitch.tv/${data.user_login}`, })
        .setURL(`https://www.twitch.tv/${data.user_login}`)
        .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.user_login}-1920x1080.jpg`);

      client.channels.fetch(Config.discord.broadcastingChannelId).then((channel) => { 
        channel.send({ embeds: [MutenLiveEmbed] }); 
      }).catch(console.error);
    }
  },
  sendMessageToMods: function (data) {
    if (ready) {
      Mods.forEach(element => {
        client.users.fetch(element, false).then((user) => {
          const MutenLiveEmbedSTATUSMods = new EmbedBuilder()
            .setTitle(`${data.user_name} IST LIVE 🥳`)
            .setDescription(`Komm rein und mach deine Mod-Arbeit!`)
            .setColor(0x40ff00)
            .setAuthor({ name: data.user_name, iconURL: data.profile_image_url, url: `https://www.twitch.tv/${data.user_login}`, })
            .setURL(`https://www.twitch.tv/${data.user_login}`);

          user.send({ embeds: [MutenLiveEmbedSTATUSMods] });
      });
      });
    }
  },
  setFollowerState: function (data) {

    client.channels.fetch(Config.discord.followerChannelId).then((channel) => { 
      channel.setName(`Followers: ${data.followers}`);
    }).catch(console.error);
  },
  DiscordisReady: function () {
    return ready
  },
};

client.login(Config.discord.token);