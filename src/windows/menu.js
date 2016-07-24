/**
 * Created by zhaofeng on 7/11/16.
 */
const path = require('path');
const {Menu, app, shell} = require('electron');
const remote = require('electron').remote;
const ipc = require('./../backend/ipc');
const WinManager = require('./manager');

// cache win obj
let win;

const menuTemplate = [
    {
        label: '5SING',
        submenu: [
            {
                label: '关于',
                click: () => {
                    WinManager.create('about');
                }
            },
            {
                type: 'separator'
            },
            {
                label: '隐藏5SING',
                accelerator: 'Command+H',
                selector: 'hide:'
            },
            {
                label: '隐藏其他',
                accelerator: 'Command+Alt+H',
                selector: 'hideOtherApplications:'
            },
            {
                label: '显示所有',
                selector: 'unhideAllApplications:'
            },
            {
                type: 'separator'
            },
            {
                label: '退出',
                accelerator: 'Cmd+Q',
                click: function () {
                    app.exit(0);
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                accelerator: 'Command+Z',
                selector: 'undo:'
            },
            {
                label: '重做',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: '剪切',
                accelerator: 'Command+X',
                selector: 'cut:'
            },
            {
                label: '复制',
                accelerator: 'Command+C',
                selector: 'copy:'
            },
            {
                label: '粘贴',
                accelerator: 'Command+V',
                selector: 'paste:'
            },
            {
                label: '全选',
                accelerator: 'Command+A',
                selector: 'selectAll:'
            }
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '刷新',
                accelerator: 'Command+R',
                click: () => {

                }
            },
            {
                label: 'DevTools',
                accelerator: 'Alt+Command+I',
                click: () => {
                    WinManager.getWin('main').toggleDevTools();
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
    },
    {
        label: '窗口',
        submenu: [
            {
                label: '最小化',
                accelerator: 'Command+M',
                selector: 'performMiniaturize:'
            },
            {
                label: '关闭',
                accelerator: 'Command+W',
                selector: 'performClose:'
            },
            {
                type: 'separator'
            },
            {
                label: '前置全部窗口',
                selector: 'arrangeInFront:'
            }
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: 'GitHub',
                click: () => {
                    shell.openExternal('https://github.com/i5sing/5sing');
                }
            },
            {
                type: 'separator'
            }, {
                label: 'Report Issues',
                click: () => {
                    shell.openExternal('https://github.com/i5sing/5sing');
                }
            }
        ]
    }
];

exports.build = function (winObj) {
    win = winObj;
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};