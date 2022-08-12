const state = {
    snackbar:{
        color:null,
        visible: false,
        message: "Snackbar Message",
        timeout: 13000
    }
}
const mutations  = {
    updateSnackbarColor: (state,v)=>state.snackbar.color = v,
    showSnackbar: (state,v)=> state.snackbar.visible = v,
    updateSnackbarMessage: (state,v)=> state.snackbar.message = v
}
const actions = {
    async setSnackbarColor({commit},color){
        commit('updateSnackbarColor',color)
    },
    async showSnackbar({commit}){
        commit('showSnackbar',true)
    },
    async hideSnackbar({commit}){
        commit('showSnackbar',false)
    },
    setSnackbarMessage({commit},v){
        commit('updateSnackbarMessage',v)
    }
}
const getters = {
    snackBarMessage: (state)=> state.snackbar.message,
    snackbarColor: (state)=> state.snackbar.color,
    snackbarVisibility: (state)=> state.snackbar.visible,
    getSnackbar: (state)=> state.snackbar
}

export default{
    state,
    mutations,
    actions,
    getters
}