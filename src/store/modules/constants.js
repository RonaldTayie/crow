const dev = false

const ip = dev?'192.168.8.106': 'apiproonal.co.za'
const port = dev?':8000':''

const header = dev?'http':'https'
const socket = dev?'ws':'wss'
const api = `${header}://${ip}${port}/`
const sock = `${socket}://${ip}${port}/`

export default {
    api,
    sock
}