const WebSocket = require('ws')
const events = require('./events')

// WebSocket
ws_url = 'wss://gateway.discord.gg/?encoding=json&v=8'
const ws = new WebSocket(ws_url)

ws.on('open', () => events.authenticate(ws))

ws.on('message', rawData => {
    const data = JSON.parse(rawData.toString('utf8'))
    switch (data['op']) {
        // Hello
        case 10:
            events.heartbeat(ws, data['d'])
            break

        // Ready
        case 0:
            events.ready(ws, data)
            break

        // Heartbeat ACK
        case 11:
            console.log("Heartbeat Received")
            break

        default:
            console.log(data)
    }
})

ws.on('close', () => {
    console.error("Connection Closed")
})

process.on('SIGINT', () => {
    events.voice(ws)
    process.kill(process.pid)
})