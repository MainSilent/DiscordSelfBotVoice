// Authenticate
function authenticate(ws, mdata) {
    ws.send(JSON.stringify({
        op: 0,
        d: {
            server_id: mdata.server_id,
            user_id: "820709017516769281",
            session_id: mdata.session_id,
            token: mdata.token,
            video: true,
            streams: [
                {
                    "type": "screen",
                    "rid": "100",
                    "quality": 100
                }
            ]
        }
    }))
}

exports.authenticate = authenticate

// Heartbeat
function heartbeat(ws, data) {
    let last_beat = data['heartbeat_interval'] / 2
    setInterval(() => {
        console.log("\nSending Stream heartbeat: " + last_beat)
        ws.send(JSON.stringify({
            op: 3,
            d: last_beat
        }))
        last_beat += data['heartbeat_interval'] / 2
    }, last_beat)
}

exports.heartbeat = heartbeat;