import sock from './constants'
import api from './constants'
import axios from "axios";
const state = {
    user_connection: null,
    broadcast: {},
    geoFences: {},
    focusGeoFenceUID: null
}
const mutations = {
    setConnection: (state, value) => state.user_connection = value,
    updateBroadcast: (state, value) => {
        let K = Object.entries(value)[0][0]
        let V = {}
        for (let [key, v] of Object.entries(value)) {
            key.length > 15 ? V.location = v : V[key] = v
        }
        state.broadcast[K] = V
    },
    setGeofence:(state,v)=>state.geoFences=v,
    updateFocusGeofenceUID: (state,v)=>state.focusGeoFenceUID=v
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
    async loadGeoFences({commit}) {
        const config = {
            method: "GET",
            url: api.api + `track/geofences`,
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        await axios(config).then((e)=>{
            const resp = [...e.data.features]
            let fences = {}
            resp.forEach((f)=>{
                let current_coords = [...f.geometry.coordinates[0]]
                let new_coords = []
                current_coords.forEach((c)=>{
                    let nc = [c[1], c[0]]
                    new_coords.push(nc)
                })
                f.geometry.coordinates[0]=new_coords
                fences[f.properties.uid] = f
            })
            commit('setGeofence',fences)
        })
    },
    updateFocusGeoFence({commit},v){
        commit('updateFocusGeofenceUID',v)
    },
    async updateGeofence({commit},data){
        commit
        console.log(data)
    }
}
const getters = {
    getUserConnection: (state) => state.user_connection,
    getBroadcast: (state) => state.broadcast,
    getGeofence: (state)=>state.geoFences,
    getFocusGeofenceUID: (state)=>state.focusGeoFenceUID
}

export default {
    state,
    mutations,
    actions,
    getters,
}