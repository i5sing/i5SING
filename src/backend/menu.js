/**
 * Created by zhaofeng on 7/11/16.
 */
const path = require('path');
const electron = require('electron');
const menuLang = require('../lang/en-US.json').menu;

const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

const menuTemplate = [
    {
        label: 'Elsa',
        submenu: [
            {
                label: menuLang.about,
                click: () => {
                }
            },
            {
                label: menuLang.exit,
                accelerator: 'Cmd+Q',
                click: function () {
                    global.terminate();
                }
            }
        ]
    }
];

module.exports = Menu.buildFromTemplate(menuTemplate);