const fs = require('fs').promises;
const Config = require('./config');

module.exports = {
    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    log: async function (msg) {
        try {
            const d = new Date();
            const date = `[${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}][${d.getHours()}:${d.getMinutes()}] `;
            
            console.log(date + Config.twitch.username + " " + msg);
            
            const data = await fs.readFile("log.txt");
            
            fs.writeFile("log.txt", data + "\n" + msg).catch(err => console.error('Error saving data:', err));
        } catch (err) {
            console.error('Error reading save data:', err);
            return null;
        }
    },
};