import { createStore } from 'vuex'

export default createStore({
    state: {
        Authorization: localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : '',
        loginID: '',
        loginUsername: '',
    },
    getters: {},
    mutations: {
        changeLogin(state, user) {
            state.Authorization = user.Authorization;
            localStorage.setItem('Authorization', user.Authorization)
            localStorage.setItem('loginUsername', user.loginUsername)
            localStorage.setItem('loginID', user.loginID)
        },
    },
    actions: {},
    modules: {}
})