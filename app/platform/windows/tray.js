/**
 * Created by feng on 24/12/2016.
 */
const path = require('path');

/**
 * The tray icon name for windows.
 * @type {string}
 */
const ICON_NAME = 'trayTemplate.png';

exports.getTrayImage = function() {
    return path.join(__dirname, '../../assets/img', ICON_NAME);
};

exports.getMenuTemplate = win => {
    return [
        {
            label: 'i5SING',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        WinManager.create('about');
                    }
                },
                {
                    label: '检查更新',
                    click: () => {
                        update.checkForUpdatesByReq().then(data => {
                            let title = '',
                                message = '',
                                buttons = ['确定', '取消'];

                            if (data) {
                                title = '检查更新';
                                message = `发现新版本 ${data.name}, 点击 "确定" 前往下载!`;
                            } else {
                                title = '检查更新';
                                message = '您的版本已经是最新版了!';
                                buttons = ['确定'];
                            }

                            dialog.showMessageBox({
                                type: 'none',
                                title: title,
                                message: message,
                                buttons: buttons
                            }, index => {
                                if (index === 0 && data) {
                                    return shell.openExternal("http://i5sing.com");
                                }
                            })
                        }, error => {
                            console.log(error);
                        })
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '隐藏i5SING',
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
                        send(win, 'change-song', 'play');
                    }
                },
                {
                    label: '上一曲',
                    accelerator: 'MediaPreviousTrack',
                    click: () => {
                        send(win, 'change-song', 'pre');
                    }
                },
                {
                    label: '下一曲',
                    accelerator: 'MediaNextTrack',
                    click: function () {
                        send(win, 'change-song', 'next');
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