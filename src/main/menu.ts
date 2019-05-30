import { shell, BrowserWindow, app, MenuItemConstructorOptions, Menu } from 'electron';
import { checkVersion } from "./upgrade";

export const initAppMenu = (window: BrowserWindow) => {
    if (process.platform === 'darwin') {
        Menu.setApplicationMenu(Menu.buildFromTemplate(initMacMenu(window)));
    }
};

export const initMacMenu = (window: BrowserWindow): MenuItemConstructorOptions[] => {
    return [
        {
            label: 'i5SING',
            submenu: [
                {
                    label: '关于',
                    role: 'about',
                },
                {
                    label: '检查更新',
                    click: async () => {
                        await checkVersion();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '隐藏i5SING',
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: '隐藏其他',
                    accelerator: 'Command+Alt+H',
                    role: 'hideOthers',
                },
                {
                    label: '显示所有',
                    role: 'unhide:'
                },
                {
                    type: 'separator'
                },
                {
                    label: '退出',
                    accelerator: 'Cmd+Q',
                    click: () => app.exit(0)
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'Command+Z',
                    role: 'undo'
                },
                {
                    label: '重做',
                    accelerator: 'Shift+Command+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: '剪切',
                    accelerator: 'Command+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'Command+C',
                    role: 'copy'
                },
                {
                    label: '粘贴',
                    accelerator: 'Command+V',
                    role: 'paste'
                },
                {
                    label: '全选',
                    accelerator: 'Command+A',
                    role: 'selectAll'
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: 'DevTools',
                    accelerator: 'Alt+Command+I',
                    role: 'toggledevtools',
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
                        window.webContents.send('change-song', 'play');
                    }
                },
                {
                    label: '上一曲',
                    accelerator: 'MediaPreviousTrack',
                    click: () => {
                        window.webContents.send('change-song', 'pre');
                    }
                },
                {
                    label: '下一曲',
                    accelerator: 'MediaNextTrack',
                    click: function () {
                        window.webContents.send('change-song', 'next');
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
                    role: 'minimize:'
                },
                {
                    label: '关闭',
                    accelerator: 'Command+W',
                    role: 'close'
                },
                {
                    type: 'separator'
                },
                {
                    label: '前置全部窗口',
                    role: 'front'
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: 'GitHub',
                    click: () => {
                        shell.openExternal('https://github.com/i5sing/i5SING');
                    }
                },
                {
                    type: 'separator'
                }, {
                    label: 'Report Issues',
                    click: () => {
                        shell.openExternal('https://github.com/i5sing/i5SING/issues');
                    }
                }
            ]
        }
    ];
};
