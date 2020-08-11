export function actions(actionCls) {
    const params = {};
    const methods = Object.getOwnPropertyNames(actionCls).filter(method => method !== 'length' && method !== 'name');
    methods.forEach(method => params[method] = actionCls[method]);
    return params;
}
