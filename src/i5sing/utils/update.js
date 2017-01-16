/**
 * Created by zhaofeng on 22/08/2016.
 */

import os from 'os';
import {app, autoUpdater} from 'electron';
import request from 'request';

const updateUrl = 'http://i5sing.com';

export function checkForUpdatesByReq() {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    let url = `${updateUrl}/check-version/${platform}/${version}`;

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
}

export function checkForUpdates() {
    let platform = `${os.platform()}_${os.arch()}`;
    let version = app.getVersion();
    autoUpdater.setFeedURL(`${updateUrl}/check-version/${platform}/${version}`);
    return autoUpdater.checkForUpdates();
}