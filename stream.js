const events = require('./stream_events')

module.exports = mdata => {
    const WebSocket = require('ws')

    const ws = new WebSocket(`wss://${mdata.endpoint}/?v=5`)
    
    ws.on('open', () => events.authenticate(ws, mdata))

    ws.on('message', rawData => {
        const data = JSON.parse(rawData.toString('utf8'))

        switch (data['op']) {
            // Hello
            case 8:
                events.heartbeat(ws, data['d'])
                break
    
            // Ready
            case 2:
                events.ready(ws, data['d'])
                break
    
            // Heartbeat ACK
            case 6:
                console.log("Stream Heartbeat Received")
                break

            // Session Description
            case 4:
                events.session(ws, data['d'])
                break
    
            default:
                ![5,15].includes(data['op']) && console.log(data)
        }
    })
    
    ws.on('close', () => console.log('Stream Closed'))
}