import sock from './constants'

const state = {
    user_connection: null,
    broadcast: {},
}
const mutations = {
    setConnection: (state, value) => state.user_connection = value,
    updateBroadcast: (state, value) => {
        let K = Object.entries(value)[0][0]
        let V = {}
        for (let [key, v] of Object.entries(value)) {
            key.length > 15? V.location = v : V[key] = v
        }
        state.broadcast[K] = V
    }
}
const actions = {
    connect_User({commit}) {
        const server = sock.sock
        let socket = new WebSocket(server + `socket.io/user/`)
        socket.onclose = () => {
            socket = new WebSocket(server + `socket.io/user/`)
        }
        commit('setConnection', socket)
    },
    async mutateBroadcast({commit}, v) {
        commit('updateBroadcast', v)
    },
}
    const getters = {
        getUserConnection: (state) => state.user_connection,
        getBroadcast: (state) => state.broadcast
    }

    export default {
        state,
        mutations,
        actions,
        getters,
    }