import api from './constants'

const state = {
    fleets: {},
    vehicles: {},
    drivers: {}
}
const mutations = {
    setFleets: (state, v) => state.fleets = v,
    setVehicles: (state, v) => state.vehicles = v,
    setDrivers: (state, v) => state.drivers = v
}
const actions = {
    async LoadFleets({commit,dispatch}) {
        const config = {
            url: api.api + `vehicle/fleet`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let fleets = await dispatch('ListViewRequestToMap',config)
        commit('setFleets',fleets)
    },
    async LoadVehicles({commit,dispatch}) {
        const config = {
            url: api.api + `vehicle/vehicles`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let cars = await dispatch('ListViewRequestToMap',config)
        commit('setVehicles',cars)
    },
    async LoadDrivers({commit,dispatch}) {
        const config = {
            url: api.api + `vehicle/fleet`,
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let drivers = await dispatch('ListViewRequestToMap',config)
        console.log(drivers)
        commit
    },
}
const getters = {
    getVehicles: (state) => state.vehicles,
    getDrivers: (state) => state.drivers,
    getFleets: (state) => state.fleets
}

export default {
    state,
    mutations,
    actions,
    getters

}