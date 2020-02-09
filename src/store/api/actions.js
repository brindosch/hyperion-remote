export const setPendingTokens = (ctx, val) => {
    if (Array.isArray(val)) {
        val.forEach((el) => {
            // prevent duplicated entries
            if (!ctx.getters['getPendingTokens'].find((et) => et.id == el.id)) {
                el = Object.assign(el, {
                    timer: setTimeout(() => ctx.commit('removePendingToken', el.id), el.timeout)
                })
                ctx.commit('setPendingToken', el)
            }
        })
    } else if (val !== undefined) {
        // prevent duplicated entries
        if (!ctx.getters['getPendingTokens'].find((et) => et.id == val.id)) {
            val = Object.assign(val, {
                timer: setTimeout(() => ctx.commit('removePendingToken', val.id), val.timeout)
            })
            ctx.commit('setPendingToken', val)
        }
        if (val.comment == '')
            ctx.commit('removePendingToken', val.id)
    }
}