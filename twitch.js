const Config = require('./config');
const axios = require('axios');
const { sleep } = require('./tools');

const redirectUri = 'http://localhost:3000/callback'; // Update with your redirect URI

let accessToken = null;
let gettingToken = false

async function getToken() {
    gettingToken = true
    if (!accessToken) {
        try {
            const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: Config.twitch.clientId,
                    client_secret: Config.twitch.clientSecret,
                    grant_type: 'client_credentials',
                },
            });

            const { access_token } = response.data;

            accessToken = access_token;

            console.log('Authorization successful! Access token received.');

            return accessToken;
        } catch (error) {
            console.error('Error obtaining token:', error.message);
            gettingToken = false

            throw error;
        }
    } else {
        return accessToken;
    }
}

async function getData() {
    try {
        const token = await getToken();

        const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${Config.twitch.username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-ID': Config.twitch.clientId
            },
        });

        const response2 = await axios.get(`https://api.twitch.tv/helix/users?id=${response.data.data[0].user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-ID': Config.twitch.clientId
            },
        });

        const response3 = await axios.get(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${response.data.data[0].user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-ID': Config.twitch.clientId
            },
        });

        if (response.data.data[0] && response2.data.data[0] && response3.data) {
            const userdata = {
                user_id: response.data.data[0].user_id,
                user_login: response.data.data[0].user_login,
                user_name: response.data.data[0].user_name,
                title: response.data.data[0].title,
                viewer_count: response.data.data[0].viewer_count,
                thumbnail_url: response.data.data[0].thumbnail_url,
                tags: response.data.data[0].tags,
                profile_image_url: response2.data.data[0].profile_image_url,
                followers: new Intl.NumberFormat("de-DE").format(response3.data.total)
            }

            return userdata
        } else {
            return false
        }
    } catch (error) {
        if (error.response) {
            console.error("Error fetching data: HTTP status code", error.response.status);
        } else {
            console.error("Error fetching data:", error.message);
        }
        
        return false
    }
}

module.exports = {
    getData: getData,
    isReady: function () {
        if (!accessToken & !gettingToken) {
            getToken();
            return false
        } else if (accessToken) {
            return accessToken
        }
    }
};