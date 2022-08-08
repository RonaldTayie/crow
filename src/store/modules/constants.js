const dev = false

const ip = dev?'192.168.8.106': '139.59.26.73'
const port = dev?':8000':''

const header = dev?'http':'https'

const api = `${header}://${ip}${port}/`
const sock = `ws://${ip}${port}/`

export default {
    api,
    sock
}