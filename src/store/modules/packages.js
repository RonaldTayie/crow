import api from './constants'
import axios from "axios";

const state = {
    packages: {},
    packageImages: {},
    hazardLevels: {}
}
const mutations = {
    setPackages: (state, value) => state.packages = value,
    setPackageImages: (state, value) => state.packageImages = value,
    setHazardLevels: (state,value)=> state.hazardLevels = value
}
const actions = {
    async loadPackages({commit}) {
        const config = {
            url: api.api + 'package/items/',
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        let packages = await axios(config)
        if (packages.status == 200) {
            let res = [...packages.data.results]
            if (res.length > 0) {
                let packages = {}
                for (const e of res) {
                    packages[e.uid] = e
                }
                let packageImages = {}
                for(let key in packages){
                    await axios({
                        url: api.api + `package/img/${key}/`,
                        method: "GET",
                        headers: {
                            "Authorization": `Token ${localStorage.token}`
                        }
                    }).then((e)=>{
                        const images =  e.data
                        packageImages[key] = images
                    })
                }
                commit('setPackages', packages)
                commit('setPackageImages', packageImages)
            }
        }
    },
    async loadHazards({commit}){
        const config = {
            url: api.api + `package/hazards`,
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        await axios(config).then((r)=>{
            let d = r.data
            let levels = {}
            d.forEach((h)=>{
                levels[h.uid] = h
            })
            commit('setHazardLevels',levels)
        })
    }
}
const getters = {
    getPackages:(state)=>state.packages,
    getHazardLevels: (state)=>state.hazardLevels,
    getPackageImages: (state)=> state.packageImages
}
export default {
    state,
    mutations,
    actions,
    getters
}