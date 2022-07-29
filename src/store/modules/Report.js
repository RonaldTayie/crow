const state = {
    deviceCode: null,
    startDate: null,
    endDate: null
}
const mutations = {
    setDevice: (state,v)=> state.deviceCode = v,
    setStartDate: (state,v)=> state.startDate = v,
    setEndDate: (state,v)=> state.endDate = v
}
const actions = {
    async setData({commit},data){
        commit('setStartDate',data.date[0])
        commit('setEndDate',data.date[1])
        commit('setDevice',data.device_code)
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}
