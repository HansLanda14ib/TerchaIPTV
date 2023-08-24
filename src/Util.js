import { useState } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";
const apiUrl = '/proxy/codes';
const Util = () => {
    const [authToken, setAuthToken] = useState('');
    const [m3uUrl, setM3uUrl] = useState('');
    const [displayM3u, setDisplayM3u] = useState(false);

    const handleTokenSubmit = () => {
        const headers = {
            'Authorization': `Bearer ${authToken}`
        };

        // Making a GET request
        axios.get(apiUrl, { headers })
            .then(response => {
                const token = response.data.token;
                setAuthToken(token);

                // Extract code from token
                const code = parseJwt(token).code.code;

                // Request parameters
                const requestData = {
                    bouquetId: 384,
                    code: code,
                    token: token
                };

                // Making a POST request
                axios.post('http://176.123.9.60:3000/v1/subscriptions', requestData, { headers })
                    .then(response => {
                        const user = response.data.iptv.user;
                        const pass = response.data.iptv.pass;
                        const newM3uUrl = `http://ugeen.live:8080/get.php?username=${user}&password=${pass}&type=m3u`;
                        setM3uUrl(newM3uUrl);
                        setDisplayM3u(true); // Show the generated M3U URL
                    })
                    .catch(error => {
                        console.error('Error generating M3U URL:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching token:', error);
            });
    };

    const handleOpenM3u = () => {
        if (m3uUrl) {
            window.open(m3uUrl, '_blank');
        }
    };

    const handleTokenChange = (event) => {
        setAuthToken(event.target.value);
    };

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        return decoded;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
            }}
        >
            <p style={{ marginBottom: "1rem", textAlign: "center" }}>
               DISCLAIMER: The information on this site is intended for educational purposes only and is not intended as professional advice
                . Please ensure you have proper authorization to generate the M3u File.
            </p>
            <h1>Streaming Live Events</h1>
            <Input
                placeholder="Enter Auth Token"
                value={authToken}
                onChange={handleTokenChange}
                style={{ margin: "1em", maxWidth: "300px" }}
            />
            <Button type="primary" onClick={handleTokenSubmit} style={{ margin: "1em" }}>
                Get M3U URL
            </Button>
            {displayM3u && (
                <div style={{ marginTop: "1em" }}>
                    <Button onClick={handleOpenM3u} icon={<LinkOutlined />}>
                        Open M3U URL
                    </Button>

                </div>

            )}
        </div>
    )
}

export default Util;
