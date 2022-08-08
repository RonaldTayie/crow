const dev = false

const ip = dev?'192.168.8.106': 'apiproonal.co.za'
const port = dev?':8000':''

const header = dev?'http':'https'

const api = `${header}://${ip}${port}/`
const sock = `ws://${ip}${port}/`

export default {
    api,
    sock
}