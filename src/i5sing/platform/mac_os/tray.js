/**
 * Created by feng on 24/12/2016.
 */
const path = require('path');

/**
 * The tray icon name for mac os.
 * @type {string}
 */
const ICON_NAME = 'trayTemplate.png';

exports.getTrayImage = function () {
    return path.resolve(__dirname, '../../../resources/osx/tray/' + ICON_NAME);
};

exports.getMenuTemplate = win => {
    return [];
};