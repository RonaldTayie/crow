import axios from "axios";

const state = {
    theme: {
        is_dark: localStorage.is_dark || true,
    },
    map: {
        url: `https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=x1UxbPz4S3XPxg6AdHj12qOnoydCOeuUb7hCqeURpcK6OjmXu7E1OzODPq0Voiox`,
        attribution:
            '<a href=\\"https://www.jawg.io\\" target=\\"_blank\\">&copy; Jawg</a> - <a href=\\"https://www.openstreetmap.org\\" target=\\"_blank\\">&copy; OpenStreetMap</a>&nbsp;contributors',
    },
    mapZoom: localStorage.mapZoom!=undefined?localStorage.mapZoom:14,
    initDrawingTools: false,
    isDeviceMenuOpen: false,
    isOptionsMenuOpen:false,
    isReportWindowOpen:false,
    isGeoFenceListOpen: false,
    isStaffMenuOpen: false,
}
const mutations = {
    setTheme:(state,value)=>{
        localStorage.is_dark = value
        state.is_dark = value
    },
    updateZoom: (state,value)=> state.zoom = value,
    changeDrawingTools:(state)=>state.initDrawingTools=!state.initDrawingTools,
    changeDeviceMenu:(state,v)=>state.isDeviceMenuOpen=v,
    changeOptionsMenu:(state,v)=> state.isOptionsMenuOpen=v,
    changeReportWindow:(state,v)=>state.isReportWindowOpen = v,
    changeGeoFenceListView: (state,v)=>state.isGeoFenceListOpen=v,
    changeStaffMenu: (state,v)=>state.isStaffMenuOpen = v
}
const actions = {
    async updateZoom({commit},zoom){
        localStorage.mapZoom = zoom
        commit('updateZoom',zoom)
    },
    async toggleDrawingTools({commit}){
        commit('changeDrawingTools')
        //Close GeoFenceList
        commit('changeGeoFenceListView',false)
    },
    async toggleDeviceMenu({commit}){
        commit('changeReportWindow',false)
        commit('changeDeviceMenu',true)
        commit('changeOptionsMenu',false)
        commit('changeStaffMenu',false)
        //Close GeoFenceList
        commit('changeGeoFenceListView',false)
    },
    async toggleOptionsMenu({commit}){
        commit('changeReportWindow',false)
        commit('changeDeviceMenu',false)
        commit('changeOptionsMenu',true)
        commit('changeStaffMenu',false)
        //Close GeoFenceList
        commit('changeGeoFenceListView',false)
    },
    async toggleReportWindow({commit}){
        commit('changeOptionsMenu',false)
        commit('changeDeviceMenu',false)
        commit('changeReportWindow',true)
        commit('changeStaffMenu',false)
        //Close GeoFenceList
        commit('changeGeoFenceListView',false)
    },
    async toggleGeoFenceListView({commit},value){
        commit('changeOptionsMenu',false)
        commit('changeDeviceMenu',false)
        commit('changeReportWindow',false)
        commit('changeStaffMenu',false)

        commit('changeGeoFenceListView',value)
    },
    async toggleStaffMenu({commit},value){
        commit('changeOptionsMenu',false)
        commit('changeDeviceMenu',false)
        commit('changeReportWindow',false)
        commit('changeGeoFenceListView',false)

        commit('changeStaffMenu',value)
    },

    async ListViewRequestToMap({commit},config){
        let map = {}
        await axios(config).then(async (r) => {
            const resp = r.data
            if (resp.count > 0) {
                let results = [...resp.results]
                results.forEach((e) => {
                    map[e.uid] = e
                })
                if (resp.next != null) {
                    // Get the number of items in the page
                    const pageSize = resp.fleets.length
                    // get the number of total items available
                    const contentSize = resp.count
                    // Round up the number
                    let s = Math.ceil((contentSize / pageSize))
                    for (let p = 2; p <= s; p++) {
                        config.url = config.url + `?page=${p}`
                        await axios(config).then((e) => {
                            e.data.results.forEach((e) => {
                                map[e.uid] = e
                            })
                        }).catch((error) => {
                            error
                        })
                    }
                }
            }
        })
        commit
        return map
    },
    async ListViewRequestToList({commit},config){
        let list = []
        await axios(config).then(async (r)=>{
            const resp = r.data
            list = [...resp.results]
            if(resp.next != null){
                const pageSize = resp.results.length
                const contentSize = resp.count
                let s = Math.ceil( (contentSize/pageSize) )
                for(let p = 2;p<=s;p++){
                    config.url = config.url+`?page=${p}`
                    await axios(config).then((e)=>{
                        e.data.results.forEach((e)=>{
                            list.push(e)
                        })
                    }).catch((error)=>{
                        error
                    })
                }
            }
        })
        commit
        return list
    }

}


const getters = {
    getMapAttribution: (state)=> state.map.attribution,
    getMapUrl: (state)=> state.map.url,
    getMapZoom: (state)=>state.zoom,
    getTheme: (state)=> state.theme,
    drawingToolsStatus: (state)=> state.initDrawingTools,
    getDeviceMenuState: (state)=>state.isDeviceMenuOpen,
    getOptionsMenuState:(state)=> state.isOptionsMenuOpen,
    getReportWindowState:(state)=>state.isReportWindowOpen,
    getGeoFenceListViewState: (state)=> state.isGeoFenceListOpen,
    getStaffMenuState: (state)=> state.isStaffMenuOpen
}

export default {
    state,
    mutations,
    actions,
    getters
}