
export const openConnectDialog = async (ctx) => {
    ctx.commit('openConnetDialog', true)
    setTimeout(() => { ctx.commit('openConnectDialog', false) }, 1000)
}

export const openLoginDialog = async (ctx) => {
    ctx.commit('openLoginDialog', true)
    setTimeout(() => { ctx.commit('openLoginDialog', false) }, 1000)
}

export const openTokenHandler = async (ctx) => {
    ctx.commit('openTokenHandler', true)
    setTimeout(() => { ctx.commit('openTokenHandler', false) }, 1000)
}