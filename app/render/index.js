/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {Provider} from 'react-redux'
import ReactDom from 'react-dom';
import {Router, hashHistory} from 'react-router'

import {createRedux} from './utils/redux';
import Core from './page/core';
import "../assets/style/index.less";


let store = createRedux();

let childRoutes = [];
let tempRoutes = [
    require('./routes/dashboard'),
    require('./routes/collections'),
    require('./routes/favorite'),
    require('./routes/programa'),
    require('./routes/rank'),
    require('./routes/search'),
    require('./routes/singer'),
    require('./routes/square'),
    require('./routes/webview')
];

tempRoutes.forEach(route => {
    if (route.length) {
        childRoutes = childRoutes.concat(route);
    } else {
        childRoutes.push(route);
    }
});

let routes = {
    path: '/',
    indexRoutes: {
        component: require('./page/dashboard')
    },
    childRoutes: childRoutes,
    component: Core
};

ReactDom.render(
    <Provider store={store}>
        <Router history={hashHistory} routes={routes}/>
    </Provider>,
    document.getElementById('app')
);