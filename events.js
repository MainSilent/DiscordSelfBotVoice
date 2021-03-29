require('dotenv').config()

// Authenticate
function authenticate(ws) {
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: process.env.token,
            capabilities: 61,
            properties: {
                os: "Linux",
                browser: "Chrome",
                device: "",
                system_locale: "en-US",
                browser_user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
                browser_version: "89.0.4389.82",
                os_version: "",
                referrer: "https://discord.com/",
                referring_domain: "discord.com",
                referrer_current: "",
                referring_domain_current: "",
                release_channel: "stable",
                client_build_number: 80728,
                client_event_source: null
            },
            presence: {
                status: "online",
                since: 0,
                activities: [],
                afk: false
            },
            compress: false,
            client_state: {
                guild_hashes: {},
                highest_last_message_id: "0",
                read_state_version: 0,
                user_guild_settings_version: -1
            }
        }
    }))
}

exports.authenticate = authenticate;

// Heartbeat
function heartbeat(ws, data) { 
    let last_beat = data['heartbeat_interval'] / 2
    setInterval(() => {
        console.log("\nSending heartbeat: " + last_beat)
        ws.send(JSON.stringify({
            op: 1,
            d: last_beat
        }))
        last_beat += data['heartbeat_interval'] / 2
    }, last_beat)
}

exports.heartbeat = heartbeat;

// Ready
const filter = [
    'CHANNEL_UPDATE',
    'CHANNEL_DELETE',
    'READY_SUPPLEMENTAL',
    'GUILD_MEMBER_UPDATE',
    'STREAM_UPDATE',
    'VOICE_SERVER_UPDATE'
]

function ready(ws, data) {
    switch (data['t']) {
        case 'READY':
            console.log('Connected')
            voice(ws)
            break

        case 'VOICE_STATE_UPDATE':
            session_id = data['d'].session_id
            break

        case 'STREAM_CREATE':
            rtc_server_id = data['d'].rtc_server_id
            break

        case 'STREAM_SERVER_UPDATE':
            stream_token = data['d'].token
            stream_endpoint = data['d'].endpoint

            require('./stream')({
                server_id: rtc_server_id,
                session_id: session_id,
                token: stream_token,
                endpoint: stream_endpoint
            })
            break

        default:
            !filter.includes(data['t']) && console.log(data)
    }
}

exports.ready = ready;

// Voice
let voice_connected = false

function voice(ws) {
    ws.send(JSON.stringify({
        op: 4,
        d: {
            guild_id: !voice_connected && process.env.guild_id,
            channel_id: !voice_connected && process.env.channel_id,
            self_mute: false,
            self_deaf: false,
            self_video: false,
            preferred_region: null
        }
    }), () => {
        console.log("Joined voice channel")
        screen(ws)
    })
    voice_connected = true
}

exports.voice = voice;

// Screen Share
function screen(ws) {
    // start sharing
    ws.send(JSON.stringify({
        op: 18,
        d: {
            type: "guild",
            guild_id: process.env.guild_id,
            channel_id: process.env.channel_id,
            preferred_region: null
        }
    }), () => {
        // send stream key
        ws.send(JSON.stringify({
            op: 22,
            d: {
                paused: false,
                stream_key: `guild:${process.env.guild_id}:${process.env.channel_id}:${process.env.user_id}`
            }
        }), () => console.log("Stream started"))
    })
}

exports.screen = screen;

// Data variables
let rtc_server_id, session_id
let stream_token, stream_endpoint