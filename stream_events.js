const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

// Authenticate
function authenticate(ws, mdata) {
    ws.send(JSON.stringify({
        op: 0,
        d: {
            server_id: mdata.server_id,
            user_id: process.env.user_id,
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

// Ready
function ready(ws, data) {
    console.log(data);
    // Select Protocol
    ws.send(JSON.stringify({
        "op": 1,
        "d": {
            protocol: "webrtc",
            data: "a=extmap-allow-mixed\na=ice-ufrag:2KOG\na=ice-pwd:EXctQ40tjBpYIlzIWDdVzJms\na=ice-options:trickle\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\na=extmap:5 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\na=extmap:6 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\na=rtpmap:111 opus/48000/2\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\na=extmap:13 urn:3gpp:video-orientation\na=extmap:12 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\na=extmap:11 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\na=rtpmap:96 VP8/90000\na=rtpmap:97 rtx/90000",
            sdp: "a=extmap-allow-mixed\na=ice-ufrag:2KOG\na=ice-pwd:EXctQ40tjBpYIlzIWDdVzJms\na=ice-options:trickle\na=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\na=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\na=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\na=extmap:5 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\na=extmap:6 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\na=rtpmap:111 opus/48000/2\na=extmap:14 urn:ietf:params:rtp-hdrext:toffset\na=extmap:13 urn:3gpp:video-orientation\na=extmap:12 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\na=extmap:11 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\na=rtpmap:96 VP8/90000\na=rtpmap:97 rtx/90000",
            codecs: [
                {
                    name: "opus",
                    type: "audio",
                    priority: 1000,
                    payload_type: 111
                },
                {
                    name: "H264",
                    type: "video",
                    priority: 1000,
                    payload_type: 102,
                    rtx_payload_type: 121
                },
                {
                    name: "VP8",
                    type: "video",
                    priority: 2000,
                    payload_type: 96,
                    rtx_payload_type: 97
                },
                {
                    name: "VP9",
                    type: "video",
                    priority: 3000,
                    payload_type: 98,
                    rtx_payload_type: 99
                }
            ],
            rtc_connection_id: uuidv4()
        }
    }))
}

exports.ready = ready;

// Session Description
function session(ws, data) {
    //console.log(data);
}

exports.session = session;