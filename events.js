// Authenticate
function authenticate(ws) {
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: "ODIwNzA5MDE3NTE2NzY5Mjgx.YE5HKQ.3pnpetwzqZNmEKCyWSKGbF0z-Ec",
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
    setInterval(() => {
        ws.send(JSON.stringify({ op: 1 }))
    }, data['heartbeat_interval'])
}

exports.heartbeat = heartbeat;