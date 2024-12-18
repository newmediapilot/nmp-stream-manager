const { getSecret } = require("../store/manager");
const startTwitchServices = () => {
    let cycles = 0;
    const getOnlineStatus = () => {
        try {
            const accessToken = getSecret("twitch_access_token");
            const twitchUserName = getSecret("twitch_channel_id");
            axios.get('https://api.twitch.tv/helix/streams', {
                params: {
                    user_login: twitchUserName
                },
                headers: {
                    "Client-Id": process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(response => {
                if (response.data.data && response.data.data.length > 0) {
                    console.log(`startTwitchServices :: ${twitchUserName} is currently streaming`);
                } else {
                    console.log(`startTwitchServices :: ${twitchUserName} is not streaming right now`);
                }
            }).catch(error => {
                console.log(`startTwitchServices ::error  ${error}`);
            }).finally(() => {
                console.log(`startTwitchServices :: status check complete`);
            });
        } catch (error) {
            console.error('startTwitchServices :: Error checking Twitch stream status:', error);
        }
        ++cycles;
    };
    setInterval(getOnlineStatus, 60000);
    getOnlineStatus();
};
module.exports = {startTwitchServices};