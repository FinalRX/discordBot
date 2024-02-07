const Config = require('./config');
const discord = require('./discordGate.js');
const tools = require('./tools.js');
const twitch = require('./twitch.js');

const CHECK_INTERVAL = 5000;
const ONLINE_SLEEP_INTERVAL = 5 * 60 * 1000;

let broadcasting = false

// Main functions

async function onlineHandler(data) {
    if (!broadcasting) {
        broadcasting = true

        await discord.sendMessageToAll(data);
        await discord.sendMessageToMods(data);
        await discord.setFollowerState(data)
    }
}

async function getDataAndHandle() {
    if (discord.DiscordisReady() && twitch.isReady()) {
        const data = await twitch.getData();

        if (data) {
            tools.log("Online")
            await onlineHandler(data);
            await tools.sleep(ONLINE_SLEEP_INTERVAL);
        } else {
            tools.log("Offline")
            broadcasting = false
        }
    }

    await tools.sleep(CHECK_INTERVAL)
    getDataAndHandle();
}

// Run Code

console.log('Starting...');
getDataAndHandle();
