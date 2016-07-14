/**
 * Created by zhaofeng on 7/11/16.
 */
const path = require('path');
const {Menu, app} = require('electron');
const ipc = require('./../backend/ipc');

// cache win obj
let win;

const menuTemplate = [
    {
        label: 'Elsa',
        submenu: [
            {
                label: '关于',
                click: () => {
                }
            },
            {
                label: '退出',
                accelerator: 'Cmd+Q',
                click: function () {
                    app.quit();
                }
            }
        ]
    },
    {
        label: '播放控制',
        submenu: [
            {
                label: '播放/暂停',
                accelerator: 'MediaPlayPause',
                click: () => {
                    ipc.send(win, 'change-song', 'play');
                }
            },
            {
                label: '上一曲',
                accelerator: 'MediaPreviousTrack',
                click: () => {
                    ipc.send(win, 'change-song', 'pre');
                }
            },
            {
                label: '下一曲',
                accelerator: 'MediaNextTrack',
                click: function () {
                    ipc.send(win, 'change-song', 'next');
                }
            }
        ]
    }
];

exports.build = function (winObj) {
    win = winObj;
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};