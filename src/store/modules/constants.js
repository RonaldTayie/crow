const dev = true

const ip = dev?'192.168.8.105': '127.0.0.1'
const port = '8000'

const api = `http://${ip}:${port}/`
const sock = `ws://${ip}:${port}/`

export default {
    api,
    sock
}