/**
 * Created by feng on 24/12/2016.
 */
const {getSystem, DARWIN, WIN32} = require('../utils/system');
const Menu = {
    [WIN32]: require('./windows/menu'),
    [DARWIN]: require('./mac_os/menu')
};

/**
 * the menu template
 * @type {array}
 */
exports.getMenuTemplate = Menu[getSystem()].getMenuTemplate;