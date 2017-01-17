/**
 * Created by feng on 24/12/2016.
 */
const path = require('path');
const {app, shell, dialog} = require('electron');
const {send} = require('../../utils/event');
const WinManager = require('../../main/win/manager');
const update = require('../../utils/update');

/**
 * The tray icon name for windows.
 * @type {string}
 */
const ICON_NAME = 'tray.png';

exports.getTrayImage = function () {
    return path.join(__dirname, '../../../resources/windows/tray', ICON_NAME);
};

exports.getMenuTemplate = win => {
    return [
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
        },
        {
            label: '反馈',
            click: () => {
                shell.openExternal('https://github.com/i5sing/i5SING/issues');
            }
        },
        {
            type: 'separator'
        },
        {
            label: '检查更新',
            click: () => {
                update.checkForUpdatesByReq().then(data => {
                    let title = '',
                        message = '',
                        buttons = ['确定', '取消'];

                    if (!data.latest) {
                        title = '检查更新';
                        message = `发现新版本 ${data.app.version}, 点击 "确定" 前往下载!`;
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
                        if (index === 0 && !data.latest) {
                            return shell.openExternal("http://i5sing.com");
                        }
                    })
                }, error => {
                    console.log(error);
                })
            }
        },
        {
            label: '关于',
            click: () => {
                WinManager.create('about');
            }
        },
        {
            label: '关闭',
            accelerator: 'Command+W',
            selector: 'performClose:',
            click: () => {
                app.quit(0);
            }
        }
    ];
};