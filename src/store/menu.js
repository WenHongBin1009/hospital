const localData = localStorage.getItem('Vuepro')

const state = localData ? localData.menu : {
    isCollapse: false,
    selectMenu: [],
    routerList:[],
    menuActive: '1-1'
}
const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload) {
        // 数据去重
        if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.selectMenu.push(payload)
        }
    },
    closeMenu(state, payload) {
        // 获取要删除标签的索引
        const index = state.selectMenu.findIndex(val => val.path === payload.path)
        state.selectMenu.splice(index, 1)
    },
    dynamicMenu(state, payload) {
        const modules = import.meta.glob('../views/**/**/*.vue')
        function routerSet(router) {
            router.forEach(route => {
                if (!route.children) {
                    const url = `../views${route.meta.path}/index.vue`
                    route.component = modules[url]
                }else{
                    routerSet(route.children)
                }
            });
        }
        routerSet(payload)
        state.routerList = payload
    },
    updateMenuActive(state,payload) {
        state.menuActive = payload
    },
}

export default {
    state,
    mutations
}