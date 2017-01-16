/**
 * Created by feng on 2017/1/14.
 */
import React from 'react';
import ReactDom from 'react-dom';

import '../../less/win/about.less';
import {shell, remote, ipcRenderer} from 'electron';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const app = remote.app;
        const titleEl = document.getElementById('title');
        const electronEl = document.getElementById('electron');
        const chromeEl = document.getElementById('chrome');
        let str = '';
        if (process.platform == "darwin") {
            str = `i5SING for Mac V${app.getVersion()}`;
        } else {
            str = `i5SING for Win V${app.getVersion()}`;
        }
        electronEl.textContent = `electron: V${process.versions.electron}`;
        chromeEl.textContent = `chrome: V${process.versions.chrome}`;
        titleEl.textContent = str;
        document.getElementById('close-btn').onclick = function () {
            console.log('close about window.');
            ipcRenderer.send('close-win', 'about');
        }
    }

    render() {
        return (
            <div className="about">
                <div id="title"></div>
                <div>
                    中国原创音乐基地 5SING 桌面版（非官方）
                </div>
                <div id="electron"></div>
                <div id="chrome"></div>
                <div id="license">License: MIT License</div>
                <div>
                    Github:
                    <a href="javascript:shell.openExternal('https://github.com/i5sing/i5SING');">
                        https://github.com/i5sing/i5SING
                    </a>
                </div>
                <div>
                    Website:
                    <a href="javascript:shell.openExternal('http://i5sing.com');">i5sing.com</a>
                </div>
                <button className="btn" id="close-btn">关闭</button>
            </div>
        );
    }
}

ReactDom.render(
    <App />,
    document.getElementById('app')
);