/**
 * Created by zhaofeng on 22/08/2016.
 */
const os = require('os');
const {app, autoUpdater} = require('../../common/electron');
const request = require('request');
const updateUrl = 'http://zfeng-i5sing-auto-update-server.daoapp.io';


exports.checkForUpdatesByReq = function () {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    let url = `${updateUrl}/update/${platform}/${version}`;

    return new Promise((resolve, reject) => {
        request({
                method: 'get',
                uri: url,
                json: true
            },
            function (err, response, body) {
                if (err) {
                    return reject(err);
                }

                return resolve(body);
            });
    });
};

exports.checkForUpdates = function () {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    autoUpdater.setFeedURL(`${updateUrl}/update/${platform}/${version}`);
    return autoUpdater.checkForUpdates();
};