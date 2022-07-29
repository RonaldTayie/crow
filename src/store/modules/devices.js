import api from './constants'
import axios from 'axios'
import {latLng} from "leaflet";
const state = {
    devices:{},
    focusDeviceUID: null,
}
const mutations = {
    setDevices: (state,value)=>state.devices = value,
    updateDeviceLocation:(state,data)=> {
        state.devices[data.key].last_location = data.location
    },
    updateFocusDeviceUID:(state,v)=>state.focusDeviceUID=v
}
const actions = {
    async LoadDevices({commit},page=0){
        const p = page !=0? `?page=${page}`:'';
        const config = {
            method: "GET",
            url: api.api + `track/devices${p}`,
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        return await axios(config).then((r)=>{
            let devices = r.data.results
            let dList = {}
            devices.forEach((r)=>{
                const loc = latLng([r.last_location.latitude,r.last_location.longitude])
                r.last_location = loc
                dList[r.uid] = r
            })
            commit('setDevices',dList)
            return r.data
        })
    },
    async setFocusDeviceUID({commit},uid){
        commit('updateFocusDeviceUID',uid)
    }
}
const getters = {
    getDevices: (state)=>state.devices,
}

export default{
    state,
    mutations,
    actions,
    getters
}