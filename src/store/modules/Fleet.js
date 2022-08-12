import api from './constants'
import axios from "axios";

const state = {
    fleets: {},
    vehicles: {},
    drivers: {},
    managers: {},
    focusVehicleImages:[]
}
const mutations = {
    setFleets: (state, v) => state.fleets = v,
    setVehicles: (state, v) => state.vehicles = v,
    setDrivers: (state, v) => state.drivers = v,
    setManagers: (state, v) => state.managers = v,
    setFocusVehicleImages:(state,v)=> state.focusVehicleImages =v
}
const actions = {
    async LoadFleets({commit, dispatch}) {
        const config = {
            url: api.api + `vehicle/fleets`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let fleets = await dispatch('ListViewRequestToMap', config)
        commit('setFleets', fleets)
    },
    async LoadVehicles({commit, dispatch}) {
        const config = {
            url: api.api + `vehicle/vehicles`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let cars = await dispatch('ListViewRequestToMap', config)
        commit('setVehicles', cars)
    },
    async LoadDrivers({commit, dispatch}) {
        const config = {
            url: api.api + `vehicle/drivers`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let drivers = await dispatch('ListViewRequestToMap', config)
        commit('setDrivers', drivers)
    },
    async addVehicle({commit}, data) {
        commit
        const config = {
            url: api.api + `vehicle/vehicle`,
            method: 'POST',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            },
            data: data
        }
        return await axios(config).then(() => {
            return true
        }).catch((error) => {
            return error
        })
    },
    async LoadManagers({commit, dispatch}) {
        const config = {
            url: api.api + `vehicle/managers`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            },
        }
        let managers = await dispatch('ListViewRequestToMap', config)
        commit('setManagers', managers)
    },
    async addFleet({commit}, data) {
        commit
        const config = {
            url: api.api + `vehicle/fleet`,
            method: 'POST',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            },
            data: data
        }
        return await axios(config).then(() => {
            return true
        }).catch((error) => {
            return error
        })
    },
    async updateVehicle({commit}, data) {
        commit
        let d = {...data}
        delete d.vehicle
        const config = {
            url: api.api + `vehicle/vehicle/${data.vehicle}`,
            method: 'PUT',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            },
            data: d
        }
        let result = await axios(config)
        return result.status == 202 || result.status == 200 ? true : false
    },
    async uploadVehicleImages({commit}, data) {
        commit
        const config = {
            url: api.api + `vehicle/images/${data.get('vehicle')}`,
            method: 'POST',
            headers: {
                "Authorization": `Token ${localStorage.token}`,
                "Content-Type": "multipart/form-data"
            },
            data
        }
        let result = await axios(config)
        return result.status==201||result.status==200?true:false
    },
    async loadFocusVehicleImages({commit},uid){
        commit
        const config = {
            url: api.api + `vehicle/images/${uid}`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`,
            },
        }
        await axios(config).then((r)=>{
            if(r.status==200){
                commit('setFocusVehicleImages',r.data)
            }else{
                commit('setFocusVehicleImages',null)
            }
        }).catch(error=>error)
    }
}
const getters = {
    getVehicles: (state) => state.vehicles,
    getDrivers: (state) => state.drivers,
    getFleets: (state) => state.fleets,
    getManagers: (state) => state.managers,
    getFocusVehicleImages: (state)=>state.focusVehicleImages
}

export default {
    state,
    mutations,
    actions,
    getters

}