import api from './constants'
import axios from "axios";

const state = {
    reportData: [],
    addresses: {}
}
const mutations = {
    setReportData: (state, v) => state.reportData = v,
    setUID:(state,v) => state.uid=v,
    setAddresses: (state,v)=>state.addresses = v
}
const actions = {
    async setData({commit}, data) {
        commit('setDevice', data.device_code)
        commit('setUID',data.uid)
    },
    async generateReport({commit}, data) {
        let url = api.api + `track/report/${data.uid}/${data.startDate}/${data.endDate}`
        let records = []
        let addresses = {}
        const config = {
            method: 'GET',
            url: url,
            headers: {
                'Authorization': `Token ${localStorage.token}`,
            },
            data: data
        };

        await axios(config).then(async (r)=>{
            const resp = r.data
            records = [...resp.results]
            if(resp.next != null){
                const pageSize = resp.results.length
                const contentSize = resp.count
                let s = Math.ceil( (contentSize/pageSize) )
                for(let p = 2;p<=s;p++){
                    config.url = url+`?page=${p}`
                    await axios(config).then((e)=>{
                        e.data.results.forEach((e)=>{
                            records.push(e)
                        })
                    }).catch((error)=>{
                        error
                    })
                }
            }
        })
        // Populate addresses map
        records.forEach((e)=>{
            addresses[e.uid] = "Unknown"
        })
        commit('setReportData',records)
        commit('setAddresses',addresses)
    }
}
const getters = {
    getReportData: (state) => state.reportData,
    getAddresses: (state)=>state.addresses
}

export default {
    state,
    mutations,
    actions,
    getters
}
