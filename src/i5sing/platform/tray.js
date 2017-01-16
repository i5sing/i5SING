/**
 * Created by feng on 24/12/2016.
 */
const {getSystem, DARWIN, WIN32} = require('../utils/system');
const Tray = {
    [WIN32]: require('./windows/tray'),
    [DARWIN]: require('./mac_os/tray')
};

/**
 * get tray image and adapt your system.
 */
exports.getTrayImage = Tray[getSystem()].getTrayImage;

/**
 * get tray menu template and adapt your system.
 */
exports.getMenuTemplate = Tray[getSystem()].getMenuTemplate;