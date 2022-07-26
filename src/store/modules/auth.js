import axios from 'axios'
import api from './constants'

const state = {
    user: localStorage.user != null ? JSON.parse(localStorage.user) : null,
    token: localStorage.user != null ? localStorage.token : null,
}
const mutations = {
    setUser: (state, value) => state.user = value,
    setToken: (state, value) => state.token = value
}
const actions = {
    async Login({commit}, data) {
        const config = {
            method: "POST",
            url: api.api + 'auth/signin',
            data: data
        }
        let l = await axios(config).then(async (v) => {
            let token = v.data.token
            localStorage.setItem('token', token)
            await axios({
                url: api.api + 'auth/auth-user',
                method: "GET",
                headers: {
                    "Authorization": `Token ${localStorage.token}`
                }
            }).then((e) => {
                localStorage.setItem('user', JSON.stringify(e.data))
                commit('setUser',e.data)
            })
            localStorage.setItem('token',token)
            commit('setToken',token)
            return { status: 'success', };
        }).catch((e) => {
            return { status: 'failed',message: e };
        })
        return l
    },
    async Logout({commit}){
        commit
        localStorage.clear()
    },
    async LoadUser({commit}) {
        const config = {
            url: api.api + 'auth/auth-user',
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.token}`
            }
        }
        return await axios(config).then((e) => {
            localStorage.setItem('user', JSON.stringify(e.data))
            commit('setUser',e.data)
        }).catch(() => {})
    },
    async createUser({commit},data) {
        const config = {
            url: api.api + 'auth/signup',
            method: "POST",
            headers: {
                "Authorization": `Token ${localStorage.token}`
            },
            data: data
        }
        let result = await axios(config)
        commit
        return result.status == 200 || result.status == 201 ? true : false
    }
}

const getters = {
    getUserData: (state)=> state.user,
    getApi: ()=>api.api
}

export default {
    state,
    mutations,
    actions,
    getters
}