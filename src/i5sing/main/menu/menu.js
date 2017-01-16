/**
 * Created by zhaofeng on 7/11/16.
 */
const {Menu} = require('electron');
const {menu} = require('../../platform');

// cache win obj
let win = null;

const menuTemplate = menu.getMenuTemplate(win);

exports.build = function (winObj) {
    win = winObj;
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};