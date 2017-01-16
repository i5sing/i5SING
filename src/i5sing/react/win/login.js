/**
 * Created by feng on 2017/1/14.
 */
import React from 'react';
import ReactDom from 'react-dom';
import {shell, ipcRenderer} from 'electron';
import SingSdk from '../../utils/sdk';

import '../../less/win/login.less';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementById('login-btn').onclick = function () {
            let username = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            SingSdk.login({
                username: username,
                password: password
            }, function (result) {
                if (result.code == 401) {
                    document.getElementById('reason').style.display = 'block';
                } else if (result.code == 200) {
                    document.getElementById('reason').style.display = 'none';
                    ipcRenderer.send('login-success', result);
                }
            });
        };

        document.getElementById('close-btn').onclick = function () {
            console.log('close login window.');
            ipcRenderer.send('close-win', 'login');
        };
    }

    render() {
        return (
            <div>
                <div className="title">i5SING</div>
                <div className="row">
                    <input className="input" type="text" placeholder="输入帐号/邮箱/手机" id="username"/>
                </div>
                <div className="row">
                    <input className="input" type="password" placeholder="输入密码" id="password"/>
                </div>
                <div className="row">
                    <input className="button" type="button" value="登录" id="login-btn"/>
                    <input className="button cancel-btn" type="button" value="取消" id="close-btn"/>
                </div>
                <div className="row">
                    <a className="reg"
                       href="javascript:shell.openExternal(`http://5sing.kugou.com/reg/?time=${time}`);">注册</a>
                    <span id="reason">用户名或密码错误</span>
                </div>
            </div>
        );
    }
}

ReactDom.render(
    <App />,
    document.getElementById('app')
);