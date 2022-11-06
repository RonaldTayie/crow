const dev = false

const ip = dev?'127.0.0.1': 'apiproonal.co.za'
const port = dev?':8000':''

const header = dev?'http':'https'
const socket = dev?'ws':'wss'
const socketPort = dev?'':''
const api = `${header}://${ip}${port}/`
const sock = `${socket}://${ip}${port+socketPort}/`

export default {
    api,
    sock
}
