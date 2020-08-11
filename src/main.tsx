import { ipcRenderer } from 'electron';
import * as React from 'react';
import { message } from 'antd';
import 'whatwg-fetch';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { configureStore } from './helpers';
import { Provider } from 'react-redux';
import reducers from './reducers';

import './styles/index.less';
import { GET_STORE_CACHE_EVENT, SEND_STORE_CACHE_EVENT } from "./constants/events.constant";
import { Routes } from "./modules";

message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
});

const preloadState = ipcRenderer.sendSync(GET_STORE_CACHE_EVENT);
const store = configureStore(preloadState || {});

const renderApp = () => {
    store.subscribe(() => {
        ipcRenderer.send(SEND_STORE_CACHE_EVENT, store.getState());
    });
    store.replaceReducer(reducers);

    render(
        <Provider store={store}>
            <Router>
                <Routes/>
            </Router>
        </Provider>,
        document.getElementById('app')
    );
};

renderApp();
if ((module as any).hot) {
    (module as any).hot.accept()
}
