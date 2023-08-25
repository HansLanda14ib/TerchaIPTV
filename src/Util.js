import {useState} from "react";
import axios from "axios";
import {Input, Button} from "antd";
import {LinkOutlined} from "@ant-design/icons";

const apiUrl = '/api/generateM3u'; // Update with the correct API endpoint

const Util = () => {
    const [authToken, setAuthToken] = useState('');
    const [m3uUrl, setM3uUrl] = useState('');
    const [displayM3u, setDisplayM3u] = useState(false);

    const handleTokenSubmit = async () => {
        try {
            const response = await axios.post(apiUrl, { authToken });
            const newM3uUrl = response.data.m3uUrl;
            setM3uUrl(newM3uUrl);
            setDisplayM3u(true);
        } catch (error) {
            console.error('Error generating M3U URL:', error);
        }
    };

    const handleOpenM3u = () => {
        if (m3uUrl) {
            window.open(m3uUrl, '_blank');
        }
    };

    const handleTokenChange = (event) => {
        setAuthToken(event.target.value);
    };

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
            <p style={{marginBottom: "1rem", textAlign: "center"}}>
                DISCLAIMER: The information on this site is intended for educational purposes only and is not intended
                as professional advice
                . Please ensure you have proper authorization to generate the M3u File.
            </p>
            <h1>Streaming Live Events</h1>
            <Input
                placeholder="Enter Auth Token"
                value={authToken}
                onChange={handleTokenChange}
                style={{margin: "1em", maxWidth: "300px"}}
            />
            <Button type="primary" onClick={handleTokenSubmit} style={{margin: "1em"}}>
                Get M3U URL
            </Button>
            {displayM3u && (
                <div style={{marginTop: "1em"}}>
                    <Button onClick={handleOpenM3u} icon={<LinkOutlined/>}>
                        Open M3U URL
                    </Button>

                </div>

            )}
        </div>
    )
}

export default Util;
