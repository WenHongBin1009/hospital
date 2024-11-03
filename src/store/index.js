import { createStore } from 'vuex';
import menu from './menu';
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
    plugins:[new createPersistedstate({
        key:'Vuepro'
    })],
    modules: {
        menu
    }
})