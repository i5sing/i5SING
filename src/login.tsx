import * as React from 'react';
import { message } from 'antd';
import 'whatwg-fetch';
import { render } from 'react-dom';

import './styles/index.less';
import { AuthModule } from "./modules/auth";

message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
});

const renderApp = () => {
    render(
        <AuthModule/>,
        document.getElementById('app')
    );
};

renderApp();
if ((module as any).hot) {
    (module as any).hot.accept()
}
