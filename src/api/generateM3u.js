// api/generateM3u.js
const axios = require("axios");
const externalApiUrl = 'http://176.123.9.60:3000/v1/codes';
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}
module.exports = async (req, res) => {
    const { authToken } = req.body;

    const headers = {
        'Authorization': `Bearer ${authToken}`
    };

    try {
        const response = await axios.get(externalApiUrl, { headers });
        const token = response.data.token;
        const code = parseJwt(token).code.code;

        const requestData = {
            bouquetId: 384,
            code: code,
            token: token
        };

        const subscriptionResponse = await axios.post(externalApiUrl, requestData, { headers });

        const user = subscriptionResponse.data.iptv.user;
        const pass = subscriptionResponse.data.iptv.pass;
        const newM3uUrl = `http://ugeen.live:8080/get.php?username=${user}&password=${pass}&type=m3u`;

        res.status(200).json({ m3uUrl: newM3uUrl });
    } catch (error) {
        console.error('Error generating M3U URL:', error);
        res.status(500).json({ error: 'Error generating M3U URL' });
    }
};
