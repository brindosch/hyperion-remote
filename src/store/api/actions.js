export const setPendingTokens = (ctx, val) => {
    if (Array.isArray(val)) {
        val.forEach((el) => {
            el = Object.assign(el, {
                timer: setTimeout(() => ctx.commit('removePendingToken', el.id), el.timeout)
            })
            ctx.commit('setPendingToken', el)
        })
    } else if (val !== undefined) {
        val = Object.assign(val, {
            timer: setTimeout(() => ctx.commit('removePendingToken', val.id), val.timeout)
        })
        if (val.comment == '')
            ctx.commit('removePendingToken', val.id)
        else
            ctx.commit('setPendingToken', val)
    }
}