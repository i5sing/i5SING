/**
 * Created by zhaofeng on 7/11/16.
 */
import React from 'react';
import {Provider} from 'react-redux'
import {render} from 'react-dom';
import App from './containers/app';
import {createRedux} from './utils/redux';

import "./style/index.less";

let store = createRedux();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);