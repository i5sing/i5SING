import * as os from 'os';
import { app, autoUpdater } from 'electron';
import * as request from 'request';

const updateUrl = 'https://i5sing.com';

export function checkForUpdatesByReq(): any {
    let platform = `${ os.platform() }_${ os.arch() }`;
    let version = app.getVersion();
    let url = `${ updateUrl }/check-version/${ platform }/${ version }`;

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
    let platform = `${ os.platform() }_${ os.arch() }`;
    let version = app.getVersion();
    autoUpdater.setFeedURL({ url: `${ updateUrl }/check-version/${ platform }/${ version }` });
    return autoUpdater.checkForUpdates();
}
